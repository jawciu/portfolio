// Shared read-only primitives for the Cog ADHD case study sections.
// Builders IMPORT from here for consistency — do not edit per-section.
import type { ReactNode } from "react";
import { StreamingQuote } from "./StreamingQuote";
import { Reveal } from "./Reveal";

/** asset path helper — all case-study assets live in /public/projects/cog-adhd */
export const A = (file: string) => `/projects/wiki-whisperer/${file}`;

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

/** TEMPLATE left-ruled statement — Geist Mono 32px / 1.2, light ink, green rule.
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

/** TEMPLATE insight card — a fixed 420×320 light card (#FAFAFA, #F1F0EA hairline)
    with a mono ALL-CAPS label, a `.case-study-label` title, a green (#19a072)
    divider, and `.case-study-body-md` copy. Reusable across case studies. */
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
      <Body className="mt-5 text-[var(--cog-ink-soft)]">{children}</Body>
    </div>
  );
}

/** TEMPLATE stat row — centred big numbers (Geist Bold, accent) with a caption
    beneath. Each stat is a fixed-width, content-centred block with a consistent
    real gutter between them (48px → 88px on large screens), so the spacing reads
    the same whether there are 3 or 4 of them (rather than stretching to fill the
    width). Wraps to a grid on smaller screens. The block carries 44px of
    top/bottom breathing room. Caption accepts a string or `<br/>`-split nodes.
    Children stagger in as the row scrolls into view. Reusable across case
    studies. */
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
          <p className="font-[family-name:var(--font-body)] text-[44px] font-bold leading-none text-[#b52fa5] md:text-[66px]">
            {s.n}
          </p>
          <p className="case-study-body-md mt-3">{s.caption}</p>
        </div>
      ))}
    </Reveal>
  );
}

/** TEMPLATE testimonial speech bubble — a cloud asset with an italic quote and a
    muted, right-aligned attribution centred in the bubble body (above the tail).
    `width` is explicit (px; the art's aspect ratio is preserved) and `flip`
    mirrors the art so the tail sits on the opposite side (the text is never
    mirrored). Scatter several into a staggered zigzag. Reusable across case
    studies. */
export function TestimonialBubble({
  asset,
  quote,
  who,
  width,
  flip = false,
}: {
  /** bubble art filename in /public/projects/<case-study>/ */
  asset: string;
  quote: string;
  who: string;
  /** explicit bubble width in px (aspect ratio preserved) */
  width: number;
  /** mirror the art horizontally so the tail sits on the opposite side */
  flip?: boolean;
}) {
  return (
    <figure className="relative max-w-full" style={{ width }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={A(asset)}
        alt=""
        aria-hidden="true"
        className={`block h-auto w-full select-none pointer-events-none ${
          flip ? "-scale-x-100" : ""
        }`}
      />
      {/* text sits in the bubble body (above the tail) — never mirrored */}
      <figcaption className="absolute inset-0 flex flex-col justify-center px-[10%] pt-[2%] pb-[10%]">
        <StreamingQuote className="text-[15px] italic leading-relaxed text-[var(--cog-ink)]">
          {`“${quote}”`}
        </StreamingQuote>
        <span className="mt-2 text-right text-[14px] text-[var(--cog-muted)]">
          {who}
        </span>
      </figcaption>
    </figure>
  );
}
