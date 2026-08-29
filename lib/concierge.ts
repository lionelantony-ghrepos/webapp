import { stays, type Stay } from "@/lib/stays";
import { getInsforgeClient, isInsforgeConfigured } from "@/lib/insforge";

export const CONCIERGE_FUNCTION_SLUG = "concierge-chat";

export const UNCONFIGURED_CONCIERGE_REPLY =
  "The desk is not connected on this machine. Conversation needs the InsForge URL and anon key in a local env file, and the concierge function on the project.";

const FALLBACK_REPLY =
  "The desk could not answer just now. Try again in a moment.";

export type ConciergeRole = "user" | "assistant";

export type ConciergeMessage = {
  role: ConciergeRole;
  content: string;
};

export type ConciergeAskResult = {
  reply: string;
  unconfigured: boolean;
};

function readReply(data: unknown): string | null {
  if (typeof data === "string") {
    const trimmed = data.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;
  if (typeof record.reply === "string" && record.reply.trim()) {
    return record.reply.trim();
  }

  if (record.data && typeof record.data === "object") {
    const inner = record.data as Record<string, unknown>;
    if (typeof inner.reply === "string" && inner.reply.trim()) {
      return inner.reply.trim();
    }
  }

  return null;
}

function isUnconfiguredPayload(data: unknown): boolean {
  if (!data || typeof data !== "object") {
    return false;
  }
  const record = data as Record<string, unknown>;
  return record.error === "unconfigured";
}

export function mentionedStays(text: string): Stay[] {
  const lower = text.toLowerCase();
  return stays.filter(
    (stay) =>
      lower.includes(stay.slug) || lower.includes(stay.name.toLowerCase()),
  );
}

export async function askConcierge(
  messages: ConciergeMessage[],
): Promise<ConciergeAskResult> {
  if (!isInsforgeConfigured()) {
    return { reply: UNCONFIGURED_CONCIERGE_REPLY, unconfigured: true };
  }

  const client = getInsforgeClient();
  if (!client) {
    return { reply: UNCONFIGURED_CONCIERGE_REPLY, unconfigured: true };
  }

  try {
    const { data, error } = await client.functions.invoke(
      CONCIERGE_FUNCTION_SLUG,
      { body: { messages } },
    );

    const reply = readReply(data);
    if (reply) {
      return {
        reply,
        unconfigured: isUnconfiguredPayload(data),
      };
    }

    if (error) {
      const status = "statusCode" in error ? error.statusCode : undefined;
      if (status === 404) {
        return {
          reply:
            "The desk is not on the line yet. The concierge function has not been deployed to this project.",
          unconfigured: true,
        };
      }
    }

    return { reply: FALLBACK_REPLY, unconfigured: false };
  } catch {
    return { reply: FALLBACK_REPLY, unconfigured: false };
  }
}
