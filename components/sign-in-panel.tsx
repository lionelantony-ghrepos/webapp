"use client";

import { FormEvent, useId, useState } from "react";
import { useAuth } from "@/components/auth-provider";

type SignInPanelProps = {
  heading?: string;
  lede?: string;
};

export function SignInPanel({
  heading = "A word with the desk",
  lede = "We will send a short code. No password. The house keeps the rest.",
}: SignInPanelProps) {
  const { sendCode, verifyCode } = useAuth();
  const emailId = useId();
  const otpId = useId();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [awaitingCode, setAwaitingCode] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const message = await sendCode(email);
    setPending(false);
    if (message) {
      setError(message);
      return;
    }
    setAwaitingCode(true);
  }

  async function onVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const message = await verifyCode(email, otp);
    setPending(false);
    if (message) {
      setError(message);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="font-serif text-2xl font-light text-ivory">{heading}</p>
        <p className="mt-2 font-serif italic leading-relaxed text-mist">{lede}</p>
      </div>

      {awaitingCode ? (
        <form onSubmit={onVerify} className="space-y-4">
          <p className="text-sm font-light text-mist">
            A code is on its way to {email}. It lasts a few minutes.
          </p>
          <div>
            <label htmlFor={otpId} className="club-label">
              The code
            </label>
            <input
              id={otpId}
              name="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
              className="club-input tracking-[0.35em]"
              required
            />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" className="club-button" disabled={pending}>
              {pending ? "A moment…" : "Enter"}
            </button>
            <button
              type="button"
              className="text-[0.7rem] uppercase tracking-[0.18em] text-muted transition-colors hover:text-ivory"
              disabled={pending}
              onClick={() => {
                setAwaitingCode(false);
                setOtp("");
                setError(null);
              }}
            >
              Use another email
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={onSend} className="space-y-4">
          <div>
            <label htmlFor={emailId} className="club-label">
              Email
            </label>
            <input
              id={emailId}
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="club-input"
              required
            />
          </div>
          <button type="submit" className="club-button" disabled={pending}>
            {pending ? "A moment…" : "Send the code"}
          </button>
        </form>
      )}

      {error ? (
        <p className="text-sm font-light text-ember" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
