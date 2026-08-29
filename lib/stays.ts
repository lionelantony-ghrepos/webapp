import { getInsforgeClient } from "@/lib/insforge";

export type PhotoCredit = {
  src: string;
  alt: string;
  photographer: string;
  profileUrl: string;
  unsplashUrl: string;
};

export type Stay = {
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
  image: PhotoCredit;
};

/** Postgres `stays` row (flattened image fields + sort_order). */
export type StayRow = {
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
  image_src: string;
  image_alt: string;
  image_photographer: string;
  image_profile_url: string;
  image_unsplash_url: string;
  sort_order: number;
};

const STAY_SELECT =
  "slug, name, region, country, mood, season, sleeps, setting, lede, body, image_src, image_alt, image_photographer, image_profile_url, image_unsplash_url, sort_order";

const unsplash = (id: string, width = 2000) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;

export const heroPhoto: PhotoCredit = {
  src: unsplash("photo-1520769669658-f07657f5a307", 2400),
  alt: "A Norwegian flag on a cliff at dusk, looking over dark water and a crimson horizon",
  photographer: "Mikita Karasiou",
  profileUrl: "https://unsplash.com/@starpollen",
  unsplashUrl: "https://unsplash.com/photos/HO6aBrYi3kE",
};

export const stays: Stay[] = [
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
    image: {
      src: unsplash("photo-1663428520845-056989f8a664"),
      alt: "Crimson rorbuer cabins on the rocky shore of Reine, Lofoten, beneath steep grey peaks",
      photographer: "Benoît Deschasaux",
      profileUrl: "https://unsplash.com/@benowa",
      unsplashUrl: "https://unsplash.com/photos/ut7XZMquCoU",
    },
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
    image: {
      src: unsplash("photo-1519681393784-d120267933ba"),
      alt: "Snow-covered mountain peaks under a star-filled violet night sky",
      photographer: "Benjamin Voros",
      profileUrl: "https://unsplash.com/@vorosbenisop",
      unsplashUrl: "https://unsplash.com/photos/phIFdC6lA4E",
    },
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
    image: {
      src: unsplash("photo-1464146072230-91cabc968266"),
      alt: "A pale manor house reflected in still water, set against a wooded rise",
      photographer: "Unsplash",
      profileUrl: "https://unsplash.com",
      unsplashUrl: "https://unsplash.com/photos/91cabc968266",
    },
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
    image: {
      src: unsplash("photo-1470770841072-f978cf4d019e"),
      alt: "A wooden cabin on stilts over a still mountain lake at dusk",
      photographer: "Luca Bravo",
      profileUrl: "https://unsplash.com/@lucabravo",
      unsplashUrl: "https://unsplash.com/photos/zAjdgNXsMeg",
    },
  },
];

export const photoCredits: PhotoCredit[] = [heroPhoto, ...stays.map((stay) => stay.image)];

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
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

export function mapStayRow(row: unknown): Stay | null {
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
    !body ||
    !isNonEmptyString(record.image_src) ||
    !isNonEmptyString(record.image_alt) ||
    !isNonEmptyString(record.image_photographer) ||
    !isNonEmptyString(record.image_profile_url) ||
    !isNonEmptyString(record.image_unsplash_url)
  ) {
    return null;
  }

  return {
    slug: record.slug,
    name: record.name,
    region: record.region,
    country: record.country,
    mood: record.mood,
    season: record.season,
    sleeps: record.sleeps,
    setting: record.setting,
    lede: record.lede,
    body,
    image: {
      src: record.image_src,
      alt: record.image_alt,
      photographer: record.image_photographer,
      profileUrl: record.image_profile_url,
      unsplashUrl: record.image_unsplash_url,
    },
  };
}

/**
 * Home catalog. Reads `stays` from InsForge when env is set; otherwise the
 * static four rooms so the shell still renders without secrets.
 */
export async function listStays(): Promise<Stay[]> {
  const client = getInsforgeClient();

  if (!client) {
    return stays;
  }

  const { data, error } = await client.database
    .from("stays")
    .select(STAY_SELECT)
    .order("sort_order", { ascending: true })
    .limit(50);

  if (error || !data) {
    return stays;
  }

  const mapped = data
    .map((row) => mapStayRow(row))
    .filter((stay): stay is Stay => stay !== null);

  return mapped.length > 0 ? mapped : stays;
}

/**
 * Stay detail. Prefers InsForge when configured; falls back to static data.
 */
export async function getStay(slug: string): Promise<Stay | undefined> {
  const fromStatic = stays.find((stay) => stay.slug === slug);
  const client = getInsforgeClient();

  if (!client) {
    return fromStatic;
  }

  const { data, error } = await client.database
    .from("stays")
    .select(STAY_SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return fromStatic;
  }

  return mapStayRow(data) ?? fromStatic;
}
