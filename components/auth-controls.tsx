"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { SignInPanel } from "@/components/sign-in-panel";
import { UnconfiguredNote } from "@/components/unconfigured-note";

export function AuthControls() {
  const { configured, ready, guest, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onPointerDown(event: PointerEvent) {
      if (!panelRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  if (!ready) {
    return (
      <p className="text-[0.72rem] font-light uppercase tracking-[0.22em] text-muted">
        …
      </p>
    );
  }

  if (guest) {
    return (
      <div className="flex max-w-[14rem] items-center gap-4 sm:max-w-none">
        <p
          className="truncate text-[0.72rem] font-light tracking-[0.08em] text-mist"
          title={guest.email}
        >
          {guest.email}
        </p>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            void signOut();
          }}
          className="shrink-0 text-[0.72rem] font-light uppercase tracking-[0.22em] text-mist transition-colors hover:text-ivory"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="text-[0.72rem] font-light uppercase tracking-[0.22em] text-mist transition-colors hover:text-ivory"
        aria-expanded={open}
      >
        Sign in
      </button>
      {open ? (
        <div className="glass-panel absolute right-0 mt-4 w-[min(22rem,calc(100vw-3rem))] rounded-2xl p-6">
          {configured ? <SignInPanel /> : <UnconfiguredNote />}
        </div>
      ) : null}
    </div>
  );
}
