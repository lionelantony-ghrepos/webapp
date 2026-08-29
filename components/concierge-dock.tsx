"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  askConcierge,
  mentionedStays,
  type ConciergeMessage,
} from "@/lib/concierge";
import { isInsforgeConfigured } from "@/lib/insforge";

const prompts = [
  "A week of polar night",
  "Somewhere with a horizon",
  "Glass, and nothing else",
];

export function ConciergeDock() {
  const [open, setOpen] = useState(true);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ConciergeMessage[]>([]);
  const [pending, setPending] = useState(false);
  const [configured] = useState(() => isInsforgeConfigured());
  const scrollerRef = useRef<HTMLDivElement>(null);

  const lastAssistant = [...messages]
    .reverse()
    .find((message) => message.role === "assistant");
  const requestStays = lastAssistant
    ? mentionedStays(lastAssistant.content)
    : [];

  useEffect(() => {
    const node = scrollerRef.current;
    if (node) {
      node.scrollTop = node.scrollHeight;
    }
  }, [messages, pending]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || pending) {
      return;
    }

    const nextMessages: ConciergeMessage[] = [
      ...messages,
      { role: "user", content },
    ];
    setMessages(nextMessages);
    setDraft("");
    setPending(true);

    const result = await askConcierge(nextMessages);
    setMessages([
      ...nextMessages,
      { role: "assistant", content: result.reply },
    ]);
    setPending(false);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void send(draft);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6">
      <div className="glass-panel mx-auto max-w-xl rounded-2xl">
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <span
              className="size-1.5 rounded-full bg-ember"
              aria-hidden="true"
            />
            <p className="text-[0.68rem] font-light uppercase tracking-[0.22em] text-mist">
              Concierge
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="text-[0.68rem] font-light uppercase tracking-[0.18em] text-muted transition-colors hover:text-ivory"
            aria-expanded={open}
          >
            {open ? "Fold" : "Open"}
          </button>
        </div>

        {open ? (
          <div className="space-y-4 border-t border-line px-5 pb-5 pt-4">
            <div
              ref={scrollerRef}
              className="max-h-52 space-y-3 overflow-y-auto pr-1"
              aria-live="polite"
            >
              <p className="font-serif text-lg font-light leading-relaxed text-ivory">
                Good evening. I keep the keys and the weather. Tell me how you
                wish to arrive.
              </p>

              {!configured ? (
                <p className="font-serif italic leading-relaxed text-mist">
                  The desk is not connected on this machine. Conversation needs
                  the InsForge URL and anon key in a local env file, and the
                  concierge function on the project. The four stays still show.
                </p>
              ) : null}

              {messages.map((message, index) =>
                message.role === "user" ? (
                  <p
                    key={`user-${index}`}
                    className="text-sm font-light leading-relaxed text-mist"
                  >
                    {message.content}
                  </p>
                ) : (
                  <p
                    key={`assistant-${index}`}
                    className="font-serif text-lg font-light leading-relaxed text-ivory"
                  >
                    {message.content}
                  </p>
                ),
              )}

              {pending ? (
                <p className="text-sm font-light text-muted">A moment…</p>
              ) : null}
            </div>

            {requestStays.length > 0 && !pending ? (
              <div className="flex flex-wrap gap-3">
                {requestStays.map((stay) => (
                  <Link
                    key={stay.slug}
                    href={`/stays/${stay.slug}#request`}
                    className="text-[0.68rem] font-light uppercase tracking-[0.18em] text-mist underline-offset-4 transition-colors hover:text-ivory hover:underline"
                  >
                    Request {stay.name}
                  </Link>
                ))}
              </div>
            ) : null}

            {messages.length === 0 ? (
              <div className="flex flex-wrap gap-2">
                {prompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    disabled={pending}
                    onClick={() => void send(prompt)}
                    className="rounded-full border border-line px-3 py-1.5 text-[0.7rem] font-light tracking-wide text-mist transition-colors hover:border-ivory/30 hover:text-ivory disabled:opacity-55"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="flex items-center gap-2">
              <label htmlFor="concierge-note" className="sr-only">
                Write to the concierge
              </label>
              <input
                id="concierge-note"
                type="text"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Write to the desk…"
                autoComplete="off"
                disabled={pending}
                className="h-11 flex-1 rounded-full border border-line bg-ink/40 px-4 text-sm font-light text-ivory outline-none placeholder:text-muted focus:border-ivory/30 disabled:opacity-55"
              />
              <button
                type="submit"
                disabled={pending || draft.trim().length === 0}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ivory transition-colors hover:border-ivory/40 disabled:opacity-55"
                aria-label="Send note"
              >
                →
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
}
