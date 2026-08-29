import Link from "next/link";
import { AuthControls } from "@/components/auth-controls";

export function SiteHeader() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[60]">
      <div className="hairline" />
      <div className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
        <Link href="/" className="wordmark text-[0.95rem] text-ivory">
          Havn
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-6 sm:gap-8">
          <Link
            href="/#stays"
            className="text-[0.72rem] font-light uppercase tracking-[0.22em] text-mist transition-colors hover:text-ivory"
          >
            Stays
          </Link>
          <AuthControls />
        </nav>
      </div>
    </header>
  );
}
