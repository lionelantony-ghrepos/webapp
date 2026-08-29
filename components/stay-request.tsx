"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { SignInPanel } from "@/components/sign-in-panel";
import { UnconfiguredNote } from "@/components/unconfigured-note";
import { submitStayRequest } from "@/lib/stay-requests";

type StayRequestProps = {
  staySlug: string;
  stayName: string;
};

export function StayRequest({ staySlug, stayName }: StayRequestProps) {
  const { configured, ready, guest } = useAuth();
  const [draft, setDraft] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const [datesNote, setDatesNote] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const name =
    guest && draft?.id === guest.id ? draft.name : (guest?.name ?? "");
  const email =
    guest && draft?.id === guest.id ? draft.email : (guest?.email ?? "");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const result = await submitStayRequest({
      staySlug,
      guestName: name,
      guestEmail: email,
      datesNote,
      message,
    });
    setPending(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSent(true);
  }

  return (
    <div id="request" className="space-y-6">
      <div>
        <p className="text-[0.68rem] uppercase tracking-[0.2em] text-muted">
          Membership of the house
        </p>
        <h2 className="mt-3 font-serif text-3xl font-light text-ivory">
          Request this stay
        </h2>
        <p className="mt-3 font-serif italic leading-relaxed text-mist">
          A letter, not a booking. The desk reads it when the light is right.
        </p>
      </div>

      {!ready ? (
        <p className="text-sm font-light text-muted">A moment…</p>
      ) : !configured ? (
        <UnconfiguredNote />
      ) : sent ? (
        <p className="font-serif text-xl font-light leading-relaxed text-ivory">
          The house has your note for {stayName}. We will write back.
        </p>
      ) : !guest ? (
        <SignInPanel
          heading="First, a quiet word"
          lede="Sign in with a code to your email. Then the letter."
        />
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label htmlFor="request-name" className="club-label">
              Name
            </label>
            <input
              id="request-name"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(event) => {
                if (!guest) {
                  return;
                }
                setDraft({
                  id: guest.id,
                  name: event.target.value,
                  email,
                });
              }}
              className="club-input"
              required
            />
          </div>
          <div>
            <label htmlFor="request-email" className="club-label">
              Email
            </label>
            <input
              id="request-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                if (!guest) {
                  return;
                }
                setDraft({
                  id: guest.id,
                  name,
                  email: event.target.value,
                });
              }}
              className="club-input"
              required
            />
          </div>
          <div>
            <label htmlFor="request-dates" className="club-label">
              Dates, or a season
            </label>
            <input
              id="request-dates"
              name="dates"
              value={datesNote}
              onChange={(event) => setDatesNote(event.target.value)}
              placeholder="Late January, or the week after polar night"
              className="club-input"
              required
            />
          </div>
          <div>
            <label htmlFor="request-message" className="club-label">
              A note
            </label>
            <textarea
              id="request-message"
              name="message"
              rows={5}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="club-input min-h-28 resize-y"
              required
            />
          </div>
          <button type="submit" className="club-button" disabled={pending}>
            {pending ? "Sending…" : "Send the request"}
          </button>
          {error ? (
            <p className="text-sm font-light text-ember" role="alert">
              {error}
            </p>
          ) : null}
        </form>
      )}
    </div>
  );
}
