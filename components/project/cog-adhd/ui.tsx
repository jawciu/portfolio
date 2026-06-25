// Shared read-only primitives for the Cog ADHD case study sections.
// Builders IMPORT from here for consistency — do not edit per-section.
import type { ReactNode } from "react";

/** asset path helper — all case-study assets live in /public/projects/cog-adhd */
export const A = (file: string) => `/projects/cog-adhd/${file}`;

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
    Reusable across case studies (see `.case-study-callout`). */
export function CaseStudyCallout({ children }: { children: ReactNode }) {
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
}: {
  label: string;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex h-[320px] w-[420px] max-w-full flex-col rounded-2xl border border-[#f1f0ea] bg-[#fafafa] px-9 py-8">
      <p className="font-[family-name:var(--font-mono)] text-[15px] font-bold uppercase tracking-[0.02em] text-[var(--cog-ink)]">
        {label}
      </p>
      <h3 className="case-study-label mt-3 leading-[1.25]">{title}</h3>
      <div className="mt-5 h-px w-full bg-[var(--green)]" />
      <Body className="mt-5 text-[var(--cog-ink-soft)]">{children}</Body>
    </div>
  );
}
