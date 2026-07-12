// Shared read-only primitives for the Vector case study sections.
// Builders IMPORT from here for consistency — do not edit per-section.
import type { ReactNode } from "react";
import { StreamingQuote } from "./StreamingQuote";
import { Reveal } from "./Reveal";
import { Parallax } from "./Parallax";
import { CountUp } from "./CountUp";

/** asset path helper — all case-study assets live in /public/projects/vector */
export const A = (file: string) => `/projects/vector/${file}`;

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`cog-container ${className}`}>{children}</div>;
}

/** small uppercase mono eyebrow heading, sits above a section heading */
export function Kicker({ children }: { children: ReactNode }) {
  return <p className="case-study-eyebrows-heading">{children}</p>;
}

/** big bold uppercase section title (Iosevka) — accepts multi-line via children */
export function Title({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <h2 className={`case-study-section-heading ${className}`}>{children}</h2>;
}

export function Body({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`case-study-body-md ${className}`}>{children}</p>;
}

/** left-bordered monospace pull-quote */
export function Callout({ children }: { children: ReactNode }) {
  return <p className="cog-callout">{children}</p>;
}

/** TEMPLATE left-ruled statement — Geist Mono 28px / 1.2, soft ink, lilac rule.
    Reusable across case studies (see `.case-study-callout`). Pass `stream` to
    reveal it word-by-word as it scrolls in (only when children is a plain
    string). */
export function CaseStudyCallout({
  children,
  stream = false,
}: {
  children: ReactNode;
  stream?: boolean;
}) {
  if (stream && typeof children === "string") {
    return <StreamingQuote className="case-study-callout">{children}</StreamingQuote>;
  }
  return <p className="case-study-callout">{children}</p>;
}

/** heavy emphasised statement (no border) */
export function Statement({ children }: { children: ReactNode }) {
  return <p className="cog-statement">{children}</p>;
}

/** TEMPLATE insight card — a card on the study's elevated surface with a mono
    ALL-CAPS label, a `.case-study-label` title, a lilac divider, and
    `.case-study-body-md` copy. Pass width/height="auto" to size to content /
    stretch in an `auto-rows-fr` grid. Reusable across case studies. */
export function InsightCard({
  label,
  title,
  children,
  width = 420,
  height = 320,
}: {
  label: string;
  title: ReactNode;
  children: ReactNode;
  /** card dimensions in px (default 420×320); pass "auto" to size to content / stretch */
  width?: number | "auto";
  height?: number | "auto";
}) {
  return (
    <div
      style={{
        width: width === "auto" ? undefined : width,
        height: height === "auto" ? undefined : height,
      }}
      className="flex h-full w-full max-w-full flex-col rounded-2xl border border-[var(--cog-line)] bg-[var(--cog-card)] px-9 py-8"
    >
      <p className="font-[family-name:var(--font-mono)] text-[15px] font-bold uppercase tracking-[0.02em] text-[var(--cog-ink)]">
        {label}
      </p>
      <h3 className="case-study-label mt-3 leading-[1.25]">{title}</h3>
      <div className="mt-5 h-px w-full bg-[var(--green)]" />
      <Body className="mt-5">{children}</Body>
    </div>
  );
}

/** TEMPLATE stat row — centred big numbers (Geist Bold, lilac) with a caption
    beneath. Fixed-width, content-centred blocks with a consistent real gutter, so
    the spacing reads the same whether there are 3 or 4. Wraps to a grid on small
    screens. 44px top/bottom breathing room. Children stagger + count up on scroll-in.
    Reusable across case studies. */
export function Stats({
  items,
  className = "",
}: {
  items: { n: string; caption: ReactNode }[];
  className?: string;
}) {
  return (
    <Reveal
      stagger={0.1}
      className={`mx-auto flex max-w-full flex-wrap justify-center gap-x-12 gap-y-12 py-11 lg:gap-x-[88px] ${className}`}
    >
      {items.map((s, i) => (
        <div
          key={`${s.n}-${i}`}
          className="flex w-[150px] flex-col items-center text-center md:w-[190px]"
        >
          <p className="font-[family-name:var(--font-body)] text-[44px] font-bold leading-none tabular-nums text-[#c098ff] md:text-[66px]">
            <CountUp value={s.n} />
          </p>
          <p className="case-study-body-md mt-3">{s.caption}</p>
        </div>
      ))}
    </Reveal>
  );
}

/** Vector AI sparkle — the gradient 4-point star from Vector's own DS (lilac tip →
    peach tip). Every surface where Vector "speaks" carries it. Gradient inlined
    (SVG <stop> doesn't reliably resolve CSS vars across browsers), matching the
    real component in the vector repo. */
export function Sparkle({
  size = 16,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient
          id="vector-sparkle-gradient"
          x1="7"
          y1="-3"
          x2="7"
          y2="15"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#C098FF" />
          <stop offset="1" stopColor="#FF9C7D" />
        </linearGradient>
      </defs>
      <path
        d="M7 1L8.5 5.5L13 7L8.5 8.5L7 13L5.5 8.5L1 7L5.5 5.5L7 1Z"
        fill="url(#vector-sparkle-gradient)"
      />
    </svg>
  );
}

/** Intrinsic pixel sizes of every product shot, so <Shot> can reserve the right
    box at first paint. Without this the <img> is zero-height until it decodes and
    the page grows underneath the Reveal ScrollTriggers, whose start positions are
    cached on mount — the same layout shift that made the wiki study's reveals fire
    off-screen on a client-side nav. If you swap an asset for one with a DIFFERENT
    aspect ratio, update its entry here. */
const SHOT_DIMS: Record<string, { w: number; h: number }> = {
  "hero-insights.png": { w: 4291, h: 3105 },
  "insights.png": { w: 3284, h: 1784 },
  "ai-drafts.png": { w: 3290, h: 1696 },
  "board.png": { w: 3284, h: 1610 },
  "portal.png": { w: 3284, h: 1840 },
  "admin-usage.png": { w: 2804, h: 1840 },
  "followup.png": { w: 2804, h: 1840 },
  "notifications.png": { w: 2804, h: 1840 },
  "workspace.png": { w: 2804, h: 1840 },
};

/** Product-visual frame — the ONE treatment every Vector screenshot uses: the
    study's elevated surface, a hairline border and a soft shadow, matching the
    app's own card language. `caption` is an optional mono label under the frame;
    `captionAlign` left-aligns it (used for the hero's fictional-data disclaimer). */
export function Shot({
  src,
  alt,
  caption,
  captionAlign = "center",
  className = "",
}: {
  src: string;
  alt: string;
  caption?: string;
  captionAlign?: "center" | "left";
  className?: string;
}) {
  const dims = SHOT_DIMS[src.split("/").pop() ?? ""];

  return (
    <figure className={className}>
      <div className="overflow-hidden rounded-[14px] border border-[var(--cog-line)] bg-[var(--cog-card)] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.65)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          width={dims?.w}
          height={dims?.h}
          className="block h-auto w-full"
        />
      </div>
      {caption && (
        <figcaption
          className={`mt-3 font-[family-name:var(--font-mono)] text-[13px] text-[var(--cog-muted)] ${
            captionAlign === "left" ? "text-left" : "text-center"
          }`}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/** Full-width product-shot row — Reveal on the outer block, Parallax on the
    inner figure (never the same element), the shared Shot frame inside. */
export function ShotRow({
  src,
  alt,
  caption,
  speed = 24,
  className = "",
}: {
  src: string;
  alt: string;
  caption: string;
  speed?: number;
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <Parallax speed={speed}>
        <Shot src={src} alt={alt} caption={caption} />
      </Parallax>
    </Reveal>
  );
}

/** CodeCard — the signature "show the real engineering" surface. Renders a mono
    source block on the recessed dark surface with a windowed header (the Vector
    sparkle + a filename) and the AI-gradient hairline on top. Pass pre-tokenised
    JSX as children (wrap spans in .tok-key / .tok-str / .tok-com / .tok-fn). */
export function CodeCard({
  file,
  children,
  className = "",
}: {
  file: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative isolate overflow-hidden rounded-2xl border border-[var(--cog-line)] bg-[#14141a] ${className}`}
    >
      {/* AI-gradient rim glint */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, var(--ai-from), var(--ai-to))" }}
      />
      <div className="flex items-center gap-2 border-b border-[var(--cog-line)] px-5 py-3">
        <Sparkle size={14} />
        <span className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--cog-muted)]">
          {file}
        </span>
      </div>
      <div className="overflow-x-auto px-5 py-5">
        <pre className="vec-code">{children}</pre>
      </div>
    </div>
  );
}
