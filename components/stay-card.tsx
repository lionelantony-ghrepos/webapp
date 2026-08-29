import Image from "next/image";
import Link from "next/link";
import type { Stay } from "@/lib/stays";

type StayCardProps = {
  stay: Stay;
  index: number;
};

export function StayCard({ stay, index }: StayCardProps) {
  const numeral = String(index + 1).padStart(2, "0");

  return (
    <article>
      <Link href={`/stays/${stay.slug}`} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden bg-fjord">
          <Image
            src={stay.image.src}
            alt={stay.image.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
          <p className="absolute left-6 top-6 font-serif text-lg italic text-ivory/70">
            {numeral}
          </p>
        </div>
        <div className="mt-6 space-y-2">
          <p className="text-[0.68rem] font-light uppercase tracking-[0.22em] text-muted">
            {stay.region}, {stay.country}
          </p>
          <h3 className="font-serif text-3xl font-light tracking-tight text-ivory transition-colors group-hover:text-ember">
            {stay.name}
          </h3>
          <p className="max-w-sm font-serif text-lg italic leading-relaxed text-mist">
            {stay.mood}
          </p>
        </div>
      </Link>
    </article>
  );
}
