import { Hero } from "@/components/hero";
import { StayCard } from "@/components/stay-card";
import { stays } from "@/lib/stays";

export default function Home() {
  return (
    <>
      <Hero />

      <section
        id="stays"
        className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10 sm:py-32"
      >
        <div className="max-w-xl">
          <p className="text-[0.7rem] font-light uppercase tracking-[0.24em] text-muted">
            Four rooms
          </p>
          <h2 className="mt-4 font-serif text-4xl font-light tracking-tight text-ivory sm:text-5xl">
            Held between water and weather.
          </h2>
          <p className="mt-6 font-light leading-relaxed text-mist">
            A small house of stays. No calendar, no booking desk yet — only the
            rooms, as they are.
          </p>
        </div>

        <div className="mt-16 grid gap-x-10 gap-y-20 md:grid-cols-2">
          {stays.map((stay, index) => (
            <StayCard key={stay.slug} stay={stay} index={index} />
          ))}
        </div>
      </section>
    </>
  );
}
