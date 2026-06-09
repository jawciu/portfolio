import { Marquee } from "@/components/Marquee";

// Continuous loop of the tools Caroline uses. Placeholder tiles for now — swap
// each for the real program icon (drop SVGs/PNGs in /public/assets/toolkit and
// render an <img>/<Image> inside the tile). The marquee handles the rest.
const TILES = Array.from({ length: 12 });

export function Toolkit() {
  return (
    <section aria-label="Toolkit" className="mx-auto max-w-6xl px-8 py-24 md:px-12 md:py-32">
      <div className="mb-8 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
        {"// toolkit"}
      </div>
      <div className="overflow-hidden rounded-2xl border border-fg/10 bg-bg-elev/60 py-7">
        <Marquee durationSec={24} pauseOnHover className="w-full">
          <div className="flex items-center gap-5 pr-5">
            {TILES.map((_, i) => (
              <div
                key={i}
                className="grid size-14 flex-none place-items-center rounded-xl border border-fg/10 bg-fg/[0.03] font-mono text-xs text-fg-muted md:size-16"
              >
                {String(i + 1).padStart(2, "0")}
              </div>
            ))}
          </div>
        </Marquee>
      </div>
    </section>
  );
}
