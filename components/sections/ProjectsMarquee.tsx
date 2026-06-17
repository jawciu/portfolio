import { Marquee } from "@/components/Marquee";

// Two stacked strips of giant "PROJECTS" type — top filled, bottom outlined —
// both scrolling right-to-left on a continuous loop. Flip a row's direction by
// passing `reverse` to its <Marquee> (opposite directions is the common alt look).
const UNITS = Array.from({ length: 6 });

function Row({ outline = false }: { outline?: boolean }) {
  return (
    <div className="flex items-center">
      {UNITS.map((_, i) => (
        <span
          key={i}
          className={`flex items-center pr-8 font-display font-black lowercase leading-none tracking-tight md:pr-14 ${
            outline ? "text-outline" : "text-fg"
          }`}
          style={{ fontSize: "clamp(2.75rem, 11vw, 9rem)" }}
        >
          projects
          <span aria-hidden className="px-6 text-accent-magenta md:px-10">
            /
          </span>
        </span>
      ))}
    </div>
  );
}

export function ProjectsMarquee() {
  return (
    <section aria-label="Projects" className="select-none py-10 md:py-16">
      <Marquee durationSec={30} className="w-full">
        <Row />
      </Marquee>
      <Marquee durationSec={30} className="-mt-2 w-full md:-mt-4">
        <Row outline />
      </Marquee>
    </section>
  );
}
