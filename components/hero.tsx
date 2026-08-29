import Image from "next/image";
import { heroPhoto } from "@/lib/stays";

export function Hero() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden">
      <Image
        src={heroPhoto.src}
        alt={heroPhoto.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="dusk-veil absolute inset-0" />
      <div className="relative z-10 flex min-h-[100svh] flex-col justify-end px-6 pb-28 pt-32 sm:px-10">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-[0.7rem] font-light uppercase tracking-[0.28em] text-mist/80">
            From the north
          </p>
          <h1 className="mt-5 max-w-3xl font-serif text-5xl font-light leading-[1.05] tracking-tight text-ivory sm:text-7xl">
            The north keeps its own hours.
          </h1>
          <p className="mt-6 max-w-md font-serif text-xl italic leading-relaxed text-mist">
            Private rooms for the long dusk.
          </p>
        </div>
      </div>
    </section>
  );
}
