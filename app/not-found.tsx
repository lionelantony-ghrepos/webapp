import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[80svh] flex-col items-center justify-center px-6 text-center">
      <p className="text-[0.7rem] uppercase tracking-[0.24em] text-muted">
        Lost in weather
      </p>
      <h1 className="mt-4 font-serif text-5xl font-light text-ivory">
        This room is not on the map.
      </h1>
      <Link
        href="/"
        className="mt-8 text-[0.7rem] uppercase tracking-[0.2em] text-mist hover:text-ivory"
      >
        Return home
      </Link>
    </div>
  );
}
