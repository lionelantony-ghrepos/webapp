import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-line px-6 pb-28 pt-16 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="wordmark text-sm text-ivory">Havn</p>
          <p className="mt-4 max-w-xs font-serif text-2xl font-light leading-snug text-mist">
            Quiet rooms at the edge of the north.
          </p>
        </div>
        <div className="space-y-3 text-[0.7rem] font-light uppercase tracking-[0.18em] text-muted">
          <p>
            <Link href="/#stays" className="hover:text-ivory">
              The four stays
            </Link>
          </p>
          <p>Photography via Unsplash. Credits in the README.</p>
          <p>© {new Date().getFullYear()} Havn</p>
        </div>
      </div>
    </footer>
  );
}
