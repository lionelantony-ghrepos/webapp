import { createClient, type InsForgeClient } from "@insforge/sdk";

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL?.trim();
const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY?.trim();

let client: InsForgeClient | null = null;

/** True only when both public InsForge env vars are present. */
export function isInsforgeConfigured(): boolean {
  return Boolean(baseUrl && anonKey);
}

/**
 * Returns an InsForge client when env is set; otherwise null.
 * Safe to import without secrets — missing vars are a no-op.
 */
export function getInsforgeClient(): InsForgeClient | null {
  if (!isInsforgeConfigured()) {
    return null;
  }

  if (!client) {
    client = createClient({
      baseUrl,
      anonKey,
    });
  }

  return client;
}
