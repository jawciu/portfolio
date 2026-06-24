"use client";

// Reusable showcase project card — extracted from the E.ON Next / project-01
// design so every real project shares one source of truth for spacing, type,
// glass and the gradient blob. See DESIGN.md › Components › Project card.
//
// One flex cell in the bento row:
//   • collapsed → a dim vertical-label wisp (the spine blob), narrow.
//   • expanded  → blooms a corner gradient blob behind frosted glass, with the
//     project copy on the LEFT and an optional product visual floating on the
//     RIGHT (split layout). Copy: year (top-left), logo + mono kicker, title,
//     subtitle, tags (pinned bottom-left).
import { useRouter } from "next/navigation";
import { Grain } from "./softBits";

// Gradient-blob colours: a warm core diffusing out to a cool edge. Optional stops
// tune how far the core holds before the edge takes over — bump `coreStop` to keep
// more of the warm core visible in the bloom (defaults reproduce the original ramp).
export type CardBlob = { core: string; edge: string; coreStop?: number; edgeStop?: number; fadeStop?: number };

export type ProjectCardProps = {
  open: boolean;
  onActivate: () => void;
  /** collapsed-state vertical label — the company name only, e.g. "E.ON Next";
      the year is appended (dimmed) from the `year` prop. */
  collapsedLabel: string;
  year: string;
  /** mono kicker shown above the title, e.g. "/e.on_next" */
  label: string;
  title: string;
  subtitle?: string;
  tags?: string[];
  /** optional brand logo shown left of the kicker */
  logo?: { src: string; alt: string };
  /** optional product visual; when present the card uses the split layout */
  image?: { src: string; alt: string };
  /** override the product-visual positioning classes (default: floats centred off
      the right edge). e.g. pass a bottom/right-anchored variant for device shots. */
  imageClassName?: string;
  /** the corner gradient blob colours */
  blob: CardBlob;
  /** optional case-study route — clicking the OPEN card navigates here */
  href?: string;
};

// Expanded bloom — one big blurred circle whose centre sits just OUTSIDE the
// card's bottom-right corner, so only a quarter blooms in. Warm core → cool edge
// → diffuse to transparent (the edge hex + "00" alpha) before any edge reads.
function bloom({ core, edge, coreStop = 0, edgeStop = 48, fadeStop = 80 }: CardBlob) {
  return `radial-gradient(circle 820px at 98% 112%, ${core} 0%, ${core} ${coreStop}%, ${edge} ${edgeStop}%, ${edge}00 ${fadeStop}%)`;
}

// Collapsed wisp — dim, centred, vertical spine in the same palette, so it
// crossfades cleanly into the bloom when the card opens.
function spine({ core, edge }: CardBlob) {
  return [
    `radial-gradient(30% 70% at 50% 35%, ${core}99, transparent 66%)`,
    `radial-gradient(38% 85% at 50% 70%, ${edge}88, transparent 68%)`,
  ].join(", ");
}

export function ProjectCard({
  open,
  onActivate,
  collapsedLabel,
  year,
  label,
  title,
  subtitle,
  tags,
  logo,
  image,
  imageClassName,
  blob,
  href,
}: ProjectCardProps) {
  const router = useRouter();
  // Default: artwork floats centred, bleeding slightly off the right edge.
  const imgClass =
    imageClassName ??
    "pointer-events-none absolute right-[-6%] top-1/2 h-[88%] w-auto -translate-y-1/2 object-contain object-left";
  // Collapsed click → open the card; open click (with a case study) → navigate.
  const onClick = () => {
    if (open && href) router.push(href);
    else onActivate();
  };
  return (
    <button
      type="button"
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onClick}
      aria-label={open && href ? `Open ${title} case study` : undefined}
      className={`group relative min-h-0 overflow-hidden rounded-3xl text-left outline-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        open && href ? "cursor-pointer" : ""
      }`}
      style={{ flexGrow: open ? 6 : 1, flexBasis: 0 }}
    >
      {/* colour blob BEHIND the glass — bloom (open) crossfades with spine
          (collapsed); same palette so the transition is seamless. */}
      <div
        aria-hidden
        className="absolute inset-0 transition-opacity duration-700"
        style={{ background: bloom(blob), opacity: open ? 1 : 0 }}
      />
      <div
        aria-hidden
        className="absolute inset-0 transition-opacity duration-700"
        style={{ background: spine(blob), opacity: open ? 0 : 0.95 }}
      />

      {/* glass surface — translucent gradient + backdrop blur/saturate */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-3xl border border-white/10 backdrop-blur-xl backdrop-saturate-150"
        style={{
          background:
            "linear-gradient(155deg, rgba(255,255,255,0.06) 0%, rgba(10,10,13,0.18) 30%, rgba(10,10,13,0.34) 100%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
        }}
      />
      {/* rim glint — peaks toward the top-left, like light on an edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, rgba(245,245,245,0.05), rgba(255,255,255,0.55) 22%, rgba(245,245,245,0.12) 55%, rgba(245,245,245,0.04))",
        }}
      />
      {/* diagonal sheen sweep — static */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          background:
            "linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 18%, transparent 34%, transparent 74%, rgba(255,255,255,0.05) 100%)",
        }}
      />
      <Grain opacity={0.06} />

      {/* collapsed — vertical label floating in the wisp */}
      {!open && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="whitespace-nowrap font-mono text-sm uppercase tracking-[0.3em] text-fg md:text-base"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {collapsedLabel}
            <span className="text-fg/55"> · {year}</span>
          </span>
        </div>
      )}

      {/* expanded — split layout: copy left, product visual right */}
      <div
        className={`absolute inset-0 flex transition-opacity ${
          open
            ? "opacity-100 delay-200 duration-500"
            : "pointer-events-none opacity-0 duration-200"
        }`}
      >
        {/* LEFT — copy sits a bit above centre; year top-left, tags bottom-left */}
        <div
          className={`relative flex flex-col justify-center p-6 md:p-9 ${
            image ? "w-[50%] flex-none" : "flex-1"
          }`}
        >
          <p className="absolute left-6 top-6 font-mono text-[10px] uppercase tracking-[0.25em] text-fg/60 md:left-9 md:top-9">
            {year}
          </p>
          <div className="-mt-[5%] -translate-y-4">
            {/* logo + mono kicker */}
            <div className="flex items-center gap-3">
              {logo && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={logo.src} alt={logo.alt} className="h-[27px] w-auto md:h-[33px]" />
              )}
              <span className="font-mono text-xs lowercase tracking-[0.2em] text-fg/70 md:text-sm">
                {label}
              </span>
            </div>
            <h3 className="mt-[1.8rem] max-w-none font-hero text-xl font-bold uppercase leading-[1.05] tracking-tight text-fg md:text-[1.75rem]">
              {title}
            </h3>
            {subtitle && (
              /* subtitle — Geist Mono, lowercase, same colour as the heading */
              <p className="mt-[1.875rem] max-w-xs font-mono text-xs lowercase leading-relaxed text-fg md:text-sm">
                {subtitle}
              </p>
            )}
          </div>
          {tags && tags.length > 0 && (
            <p className="absolute inset-x-6 bottom-6 flex items-center gap-x-2 whitespace-nowrap font-mono text-xs uppercase tracking-[0.1em] text-fg md:inset-x-9 md:bottom-9 md:text-sm">
              <span aria-hidden className="mr-1 inline-block h-2 w-2 bg-fg/60" />
              {tags.join(" · ")}
            </p>
          )}
        </div>

        {/* RIGHT — product visual floating on the blob; transparent artwork so
            the gradient reads straight through it (no frame/border/shadow). */}
        {image && (
          <div className="relative flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.src} alt={image.alt} className={imgClass} />
          </div>
        )}
      </div>
    </button>
  );
}
