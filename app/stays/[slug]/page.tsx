import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StayRequest } from "@/components/stay-request";
import { getStay, stays } from "@/lib/stays";

type StayPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return stays.map((stay) => ({ slug: stay.slug }));
}

export async function generateMetadata({
  params,
}: StayPageProps): Promise<Metadata> {
  const { slug } = await params;
  const stay = await getStay(slug);

  if (!stay) {
    return { title: "Stay" };
  }

  return {
    title: stay.name,
    description: stay.mood,
  };
}

export default async function StayPage({ params }: StayPageProps) {
  const { slug } = await params;
  const stay = await getStay(slug);

  if (!stay) {
    notFound();
  }

  return (
    <>
      <section className="relative isolate min-h-[78svh] overflow-hidden">
        <Image
          src={stay.image.src}
          alt={stay.image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="dusk-veil absolute inset-0" />
        <div className="relative z-10 flex min-h-[78svh] flex-col justify-end px-6 pb-16 pt-32 sm:px-10">
          <div className="mx-auto w-full max-w-6xl">
            <p className="text-[0.7rem] font-light uppercase tracking-[0.24em] text-mist/80">
              {stay.region}, {stay.country}
            </p>
            <h1 className="mt-4 font-serif text-5xl font-light tracking-tight text-ivory sm:text-7xl">
              {stay.name}
            </h1>
            <p className="mt-5 max-w-lg font-serif text-xl italic text-mist">
              {stay.mood}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-16 px-6 py-20 sm:px-10 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6">
          <p className="font-serif text-2xl font-light leading-snug text-ivory">
            {stay.lede}
          </p>
          {stay.body.map((paragraph) => (
            <p
              key={paragraph}
              className="max-w-xl font-light leading-relaxed text-mist"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <aside className="space-y-8 border-t border-line pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <dl className="space-y-6 text-sm">
            <div>
              <dt className="text-[0.68rem] uppercase tracking-[0.2em] text-muted">
                Season
              </dt>
              <dd className="mt-2 font-serif text-xl text-ivory">{stay.season}</dd>
            </div>
            <div>
              <dt className="text-[0.68rem] uppercase tracking-[0.2em] text-muted">
                Sleeps
              </dt>
              <dd className="mt-2 font-serif text-xl text-ivory">{stay.sleeps}</dd>
            </div>
            <div>
              <dt className="text-[0.68rem] uppercase tracking-[0.2em] text-muted">
                Setting
              </dt>
              <dd className="mt-2 font-serif text-xl text-ivory">{stay.setting}</dd>
            </div>
          </dl>
          <StayRequest staySlug={stay.slug} stayName={stay.name} />
          <Link
            href="/#stays"
            className="inline-block text-[0.7rem] uppercase tracking-[0.2em] text-ivory underline-offset-4 hover:underline"
          >
            Return to the four stays
          </Link>
        </aside>
      </section>
    </>
  );
}
