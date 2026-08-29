export type Guest = {
  id: string;
  email: string;
  name: string | null;
};

type AuthUserLike = {
  id?: unknown;
  email?: unknown;
  profile?: { name?: unknown } | null;
};

export function mapGuest(user: unknown): Guest | null {
  if (!user || typeof user !== "object") {
    return null;
  }

  const record = user as AuthUserLike;

  if (typeof record.id !== "string" || record.id.length === 0) {
    return null;
  }

  if (typeof record.email !== "string" || record.email.length === 0) {
    return null;
  }

  const profileName = record.profile?.name;

  return {
    id: record.id,
    email: record.email,
    name: typeof profileName === "string" && profileName.length > 0 ? profileName : null,
  };
}

export function authErrorMessage(
  error: { message?: string } | null | undefined,
  fallback: string,
): string {
  const message = error?.message?.trim();
  return message && message.length > 0 ? message : fallback;
}
