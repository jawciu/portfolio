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
import { CaseStudyButton } from "../../project/CaseStudyButton";

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
  /** short project name shown (dimmed) after the company on the collapsed spine,
      e.g. "Wiki Whisperer" — lets multiple projects under one brand read apart. */
  collapsedTitle?: string;
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
  /** optional link — clicking the OPEN card follows it. An absolute http(s) URL
      opens in a new tab (external); a relative path navigates in-app. */
  href?: string;
  /** when present, the OPEN card shows these CTA buttons (outline + bold mono
      label, like the case-study "Check it out") instead of a single whole-card
      link — e.g. blog post / live product / source code. Overrides `href`. */
  actions?: { label: string; href: string }[];
  /** optional non-interactive note shown where the CTA row would sit, e.g.
      "case study coming soon" — a dim outlined chip, not a link. */
  note?: string;
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
    `radial-gradient(24% 82% at 50% 32%, ${core}cc, transparent 66%)`,
    `radial-gradient(30% 100% at 50% 72%, ${edge}b3, transparent 68%)`,
  ].join(", ");
}

export function ProjectCard({
  open,
  onActivate,
  collapsedLabel,
  collapsedTitle,
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
  actions,
  note,
}: ProjectCardProps) {
  const router = useRouter();
  const hasActions = !!(actions && actions.length);
  // Default: artwork floats centred, bleeding slightly off the right edge.
  const imgClass =
    imageClassName ??
    "pointer-events-none absolute right-[-6%] top-1/2 h-[88%] w-auto -translate-y-1/2 object-contain object-left";
  // Collapsed click → open the card; open click (with a link) → follow it.
  // External http(s) links open in a new tab; relative paths navigate in-app.
  const isExternal = !!href && /^https?:\/\//.test(href);
  const onClick = () => {
    if (open && href) {
      if (isExternal) window.open(href, "_blank", "noopener,noreferrer");
      else router.push(href);
    } else onActivate();
  };
  const rootClass = `group relative min-h-0 overflow-hidden rounded-3xl text-left outline-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
    (hasActions ? !open : open && href) ? "cursor-pointer" : ""
  }`;
  const rootStyle = { flexGrow: open ? 6 : 1, flexBasis: 0 };

  const inner = (
    <>
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
        style={{ background: spine(blob), opacity: open ? 0 : 0.67 }}
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

      {/* collapsed — vertical label floating in the wisp. Two stacked columns
          (vertical-rl flows block children right-to-left): company + year on the
          right, the project name dimmer beside it — so a long name never overflows
          the card height as one run would. */}
      {!open && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="whitespace-nowrap text-center font-mono uppercase tracking-[0.3em]"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            <span className="block text-sm text-fg md:text-base">
              {collapsedLabel}
              <span className="text-fg/55"> · {year}</span>
            </span>
            {collapsedTitle && (
              <span className="mt-2.5 block text-xs text-fg/70 md:text-sm">
                {collapsedTitle}
              </span>
            )}
          </div>
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
            image ? (hasActions ? "w-[56%] flex-none" : "w-[50%] flex-none") : "flex-1"
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
            <h3
              className={`mt-[1.8rem] whitespace-pre-line font-hero text-xl font-bold uppercase leading-[1.05] tracking-tight text-fg md:text-[1.75rem] ${
                image ? "max-w-none" : "max-w-xl"
              }`}
            >
              {title}
            </h3>
            {subtitle && (
              /* subtitle — Geist Mono, lowercase, same colour as the heading */
              <p
                className={`mt-[1.875rem] font-mono text-xs lowercase leading-relaxed text-fg md:text-sm ${
                  image ? "max-w-xs" : "max-w-md"
                }`}
              >
                {subtitle}
              </p>
            )}
            {/* CTA buttons — outline + bold mono label (light tone for the dark
                card); a single compact row, each opening its own link instead of
                a whole-card click. */}
            {hasActions && (
              // Desktop (lg+) keeps the single nowrap row exactly as before. Below lg the
              // row may wrap so 3 CTAs drop to a second line cleanly instead of squeezing;
              // each label is nowrap so a button never grows "fat" by wrapping its own text.
              <div className="mt-7 flex flex-wrap items-center gap-4 lg:flex-nowrap">
                {actions!.map((a) => (
                  <CaseStudyButton
                    key={a.href}
                    href={a.href}
                    tone="light"
                    size="sm"
                    className="whitespace-nowrap"
                  >
                    {a.label}
                  </CaseStudyButton>
                ))}
              </div>
            )}
            {/* coming-soon note — dim outlined chip, echoes the CTA shape but
                clearly non-interactive (dashed border, muted fg). */}
            {note && (
              <span className="mt-7 inline-flex items-center gap-2 rounded-md border border-dashed border-fg/30 px-3 py-2 font-mono text-[12px] font-bold uppercase tracking-[0.12em] text-fg/55">
                <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-fg/40" />
                {note}
              </span>
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
    </>
  );

  // A card with CTA buttons can't be a <button> (no nested interactive elements),
  // so it renders a <div> — kept as the root in BOTH states so the flex-grow
  // transition never remounts. Collapsed, the div is still activatable (click /
  // Enter / Space / hover); open, the inner buttons take over.
  if (hasActions) {
    return (
      <div
        onMouseEnter={onActivate}
        onFocus={onActivate}
        onClick={open ? undefined : onActivate}
        onKeyDown={
          open
            ? undefined
            : (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onActivate();
                }
              }
        }
        role={open ? undefined : "button"}
        tabIndex={open ? -1 : 0}
        aria-label={open ? undefined : `Expand ${title}`}
        className={rootClass}
        style={rootStyle}
      >
        {inner}
      </div>
    );
  }

  return (
    <button
      type="button"
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onClick}
      aria-label={
        open && href
          ? isExternal
            ? `Read about ${title} (opens in a new tab)`
            : `Open ${title} case study`
          : undefined
      }
      className={rootClass}
      style={rootStyle}
    >
      {inner}
    </button>
  );
}
