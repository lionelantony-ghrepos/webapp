/**
 * Havn concierge — InsForge Deno edge function.
 *
 * Deploy (never install the CLI globally):
 *   npx @insforge/cli functions deploy concierge-chat --file functions/concierge-chat.ts --name "Concierge chat" --description "Stay-grounded Havn concierge"
 *
 * Secrets (function env, never commit):
 *   OPENAI_API_KEY — paste via `npx @insforge/cli secrets add OPENAI_API_KEY` in a local terminal
 *   OPENAI_CHAT_MODEL (optional) — default gpt-4o-mini
 *   INSFORGE_BASE_URL + ANON_KEY (optional) — live `stays` catalog; static fallback is built in
 */

import { createClient } from "npm:@insforge/sdk";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const MAX_MESSAGES = 16;
const MAX_CONTENT = 2000;
const DEFAULT_MODEL = "gpt-4o-mini";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  role: ChatRole;
  content: string;
};

type StaySummary = {
  slug: string;
  name: string;
  region: string;
  country: string;
  mood: string;
  season: string;
  sleeps: string;
  setting: string;
  lede: string;
  body: string[];
};

/** Compact catalog matching lib/stays.ts when Postgres is unreachable. */
const FALLBACK_STAYS: StaySummary[] = [
  {
    slug: "eggum",
    name: "Eggum Lodge",
    region: "Lofoten",
    country: "Norway",
    mood: "Cliff wind, still water, a fire that lasts.",
    season: "September–April",
    sleeps: "Four",
    setting: "Outer islands, above the drop",
    lede: "A lodge on the outer islands, where the road ends and the Atlantic keeps time.",
    body: [
      "The rooms face the cliff. In winter the sun barely clears the ridge; in June it refuses to leave. You come for the silence between gusts, and for a fire that is never quite allowed to go out.",
      "There is no spa menu and no welcome cocktail. There is rye, butter, and a window that holds the whole of Vestfjorden. Arrivals are arranged quietly, when the desk opens in a later stay.",
    ],
  },
  {
    slug: "kide",
    name: "Kide",
    region: "Inari",
    country: "Finnish Lapland",
    mood: "Glass, snow, and the slow green of the sky.",
    season: "November–March",
    sleeps: "Two",
    setting: "Snowline, under glass",
    lede: "A glass cabin held above the snow in Inari. At night the roof is all sky.",
    body: [
      "There is no television. There is weather, and the occasional green. The glass is warm to the touch so the frost stays outside, and the bed is placed where the aurora, if it comes, will find you without asking.",
      "Days are for walking the fell and returning to silence. The cabin is a single room, a stove, and enough linen. The north does not decorate.",
    ],
  },
  {
    slug: "havblik",
    name: "Havblik",
    region: "North Zealand",
    country: "Denmark",
    mood: "A pale house facing the Kattegat.",
    season: "Year-round",
    sleeps: "Six",
    setting: "Coastal manor, wind and lawn",
    lede: "A pale manor on the North Zealand coast, windows to the Kattegat.",
    body: [
      "The rooms are high-ceilinged and slightly faded, which is the point. Breakfast is rye, cold butter, and whatever the garden still offers. The sea is always in the house, even when you cannot see it.",
      "Walks follow the beach in either direction until the light goes. There is a library with too few books and too many chairs. The manor does not try to be new.",
    ],
  },
  {
    slug: "lysfjord",
    name: "Lysfjord",
    region: "Sognefjord",
    country: "Norway",
    mood: "Steam over black water. The mountain does not speak.",
    season: "October–May",
    sleeps: "Two",
    setting: "Fjord edge, outdoor pool",
    lede: "A spa house on a black fjord in western Norway. Steam from the pool meets the mountain.",
    body: [
      "Treatments are few and slow. You come to be emptied, not entertained. The water is hot; the air is not. Between them, a wooden deck and the sound of the fjord against rock.",
      "Evenings end when the last light leaves the opposite shore. There is a single dining table and a cook who prefers not to be praised. The mountain, as ever, does not speak.",
    ],
  },
];

const STAY_SELECT =
  "slug, name, region, country, mood, season, sleeps, setting, lede, body";

function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function asParagraphs(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.length === 0) {
    return null;
  }
  if (!value.every((item) => typeof item === "string" && item.length > 0)) {
    return null;
  }
  return value;
}

function mapStay(row: unknown): StaySummary | null {
  if (!row || typeof row !== "object") {
    return null;
  }
  const record = row as Record<string, unknown>;
  const body = asParagraphs(record.body);
  if (
    !isNonEmptyString(record.slug) ||
    !isNonEmptyString(record.name) ||
    !isNonEmptyString(record.region) ||
    !isNonEmptyString(record.country) ||
    !isNonEmptyString(record.mood) ||
    !isNonEmptyString(record.season) ||
    !isNonEmptyString(record.sleeps) ||
    !isNonEmptyString(record.setting) ||
    !isNonEmptyString(record.lede) ||
    !body
  ) {
    return null;
  }
  return {
    slug: record.slug.trim(),
    name: record.name.trim(),
    region: record.region.trim(),
    country: record.country.trim(),
    mood: record.mood.trim(),
    season: record.season.trim(),
    sleeps: record.sleeps.trim(),
    setting: record.setting.trim(),
    lede: record.lede.trim(),
    body,
  };
}

function parseMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input) || input.length === 0) {
    return null;
  }
  const sliced = input.slice(-MAX_MESSAGES);
  const messages: ChatMessage[] = [];
  for (const item of sliced) {
    if (!item || typeof item !== "object") {
      return null;
    }
    const record = item as Record<string, unknown>;
    const role = record.role;
    const content =
      typeof record.content === "string" ? record.content.trim() : "";
    if ((role !== "user" && role !== "assistant") || !content) {
      return null;
    }
    if (content.length > MAX_CONTENT) {
      return null;
    }
    messages.push({ role, content });
  }
  if (messages[messages.length - 1]?.role !== "user") {
    return null;
  }
  return messages;
}

function formatCatalog(stays: StaySummary[]): string {
  return stays
    .map((stay) => {
      const paragraphs = stay.body.join(" ");
      return [
        `### ${stay.name} (${stay.slug})`,
        `${stay.region}, ${stay.country}. Season: ${stay.season}. Sleeps: ${stay.sleeps}. Setting: ${stay.setting}.`,
        `Mood: ${stay.mood}`,
        stay.lede,
        paragraphs,
      ].join("\n");
    })
    .join("\n\n");
}

async function loadStays(): Promise<StaySummary[]> {
  const baseUrl = Deno.env.get("INSFORGE_BASE_URL")?.trim();
  const anonKey = Deno.env.get("ANON_KEY")?.trim();
  if (!baseUrl || !anonKey) {
    return FALLBACK_STAYS;
  }

  try {
    const client = createClient({ baseUrl, anonKey });
    const { data, error } = await client.database
      .from("stays")
      .select(STAY_SELECT)
      .order("sort_order", { ascending: true })
      .limit(8);

    if (error || !data) {
      return FALLBACK_STAYS;
    }

    const mapped = data
      .map((row: unknown) => mapStay(row))
      .filter((stay: StaySummary | null): stay is StaySummary => stay !== null);

    return mapped.length > 0 ? mapped : FALLBACK_STAYS;
  } catch {
    return FALLBACK_STAYS;
  }
}

function systemPrompt(catalog: string): string {
  return `You are the Havn concierge. Havn is a quiet, expensive travel house for the Scandinavian north. Four private stays only.

Voice: spare, certain, never chipper. No emoji. No exclamation marks. Never "I'd be happy to help", "Of course", "Great question", or any generic chatbot filler. Write as a desk that keeps the keys and the weather. One or two short paragraphs. Prefer sentences over lists. Packing may use a brief list only if the guest asked what to bring.

You may speak about: the four houses, seasons, polar night and midnight sun, packing for wind and cold, winter light, which house fits a guest's temperament.

You must never invent: availability, open dates, prices, rates, occupancy, amenities not in the catalog, other properties, flights, or bookings. There is no booking desk and no calendar. If they wish to stay, they write a request on that house's page ("Request this stay"). You may name the house and point them there. You do not take the letter yourself.

If you do not know, say the house has not told you. Do not guess.

Catalog:

${catalog}`;
}

async function completeChat(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  catalog: string,
): Promise<{ reply: string | null; unconfigured?: boolean }> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt(catalog) },
        ...messages,
      ],
      max_tokens: 500,
      temperature: 0.45,
    }),
  });

  if (response.status === 401 || response.status === 403) {
    return { reply: null, unconfigured: true };
  }

  if (!response.ok) {
    return { reply: null };
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: unknown } }>;
  };
  const content = payload.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    return { reply: null };
  }
  return { reply: content.trim() };
}

export default async function (req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse(
      {
        error: "method_not_allowed",
        reply: "Write to the desk; it only reads notes.",
      },
      405,
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonResponse(
      {
        error: "invalid_json",
        reply: "That note did not arrive intact. Send it again.",
      },
      400,
    );
  }

  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const messages = parseMessages(record.messages);
  if (!messages) {
    return jsonResponse(
      {
        error: "invalid_messages",
        reply: "Write a line, and I will answer.",
      },
      400,
    );
  }

  const apiKey = Deno.env.get("OPENAI_API_KEY")?.trim();
  if (!apiKey) {
    return jsonResponse({
      error: "unconfigured",
      reply:
        "The desk has no lamp tonight. The OpenAI key is not set on the concierge function.",
    });
  }

  const model = Deno.env.get("OPENAI_CHAT_MODEL")?.trim() || DEFAULT_MODEL;
  const stays = await loadStays();

  try {
    const result = await completeChat(apiKey, model, messages, formatCatalog(stays));
    if (result.unconfigured) {
      return jsonResponse({
        error: "unconfigured",
        reply:
          "The desk has no lamp tonight. The OpenAI key on the function was refused.",
      });
    }
    if (!result.reply) {
      return jsonResponse({
        error: "empty",
        reply: "The desk could not answer just now. Try again in a moment.",
      });
    }
    return jsonResponse({ reply: result.reply });
  } catch {
    return jsonResponse({
      error: "upstream",
      reply: "The desk could not answer just now. Try again in a moment.",
    });
  }
}
