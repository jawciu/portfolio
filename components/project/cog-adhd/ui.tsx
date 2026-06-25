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
