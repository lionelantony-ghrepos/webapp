"use client";

import { FormEvent, useState } from "react";

const prompts = [
  "A week of polar night",
  "Somewhere with a horizon",
  "Glass, and nothing else",
];

export function ConciergeDock() {
  const [open, setOpen] = useState(true);
  const [draft, setDraft] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
            <p className="font-serif text-lg font-light leading-relaxed text-ivory">
              Good evening. I keep the keys and the weather. Tell me how you
              wish to arrive.
            </p>

            <div className="flex flex-wrap gap-2">
              {prompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setDraft(prompt)}
                  className="rounded-full border border-line px-3 py-1.5 text-[0.7rem] font-light tracking-wide text-mist transition-colors hover:border-ivory/30 hover:text-ivory"
                >
                  {prompt}
                </button>
              ))}
            </div>

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
                className="h-11 flex-1 rounded-full border border-line bg-ink/40 px-4 text-sm font-light text-ivory outline-none placeholder:text-muted focus:border-ivory/30"
              />
              <button
                type="submit"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ivory transition-colors hover:border-ivory/40"
                aria-label="Send note (display only)"
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
