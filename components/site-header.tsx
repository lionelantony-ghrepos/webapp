import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-40">
      <div className="hairline" />
      <div className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
        <Link href="/" className="wordmark text-[0.95rem] text-ivory">
          Havn
        </Link>
        <nav aria-label="Primary">
          <Link
            href="/#stays"
            className="text-[0.72rem] font-light uppercase tracking-[0.22em] text-mist transition-colors hover:text-ivory"
          >
            Stays
          </Link>
        </nav>
      </div>
    </header>
  );
}
