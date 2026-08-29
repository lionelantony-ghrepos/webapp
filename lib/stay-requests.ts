import { getInsforgeClient } from "@/lib/insforge";
import { authErrorMessage, mapGuest } from "@/lib/guest";

export type StayRequestInput = {
  staySlug: string;
  guestName: string;
  guestEmail: string;
  datesNote: string;
  message: string;
};

export async function submitStayRequest(
  input: StayRequestInput,
): Promise<{ error: string | null }> {
  const client = getInsforgeClient();

  if (!client) {
    return {
      error:
        "The desk is not connected. Set NEXT_PUBLIC_INSFORGE_URL and NEXT_PUBLIC_INSFORGE_ANON_KEY locally.",
    };
  }

  const { data, error: sessionError } = await client.auth.getCurrentUser();
  const guest = mapGuest(data?.user);

  if (sessionError || !guest) {
    return {
      error: authErrorMessage(
        sessionError,
        "Sign in first, then send the request.",
      ),
    };
  }

  const guestName = input.guestName.trim();
  const guestEmail = input.guestEmail.trim();
  const datesNote = input.datesNote.trim();
  const message = input.message.trim();

  if (!guestName || !guestEmail || !datesNote || !message) {
    return { error: "Every field is needed." };
  }

  const { error } = await client.database.from("stay_requests").insert([
    {
      stay_slug: input.staySlug,
      user_id: guest.id,
      guest_name: guestName,
      guest_email: guestEmail,
      dates_note: datesNote,
      message,
    },
  ]);

  if (error) {
    return {
      error: authErrorMessage(
        error,
        "The house could not keep this note. Try again in a moment.",
      ),
    };
  }

  return { error: null };
}
