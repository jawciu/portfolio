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

/** small uppercase mono section label */
export function Kicker({ children }: { children: ReactNode }) {
  return <p className="cog-kicker">{children}</p>;
}

/** big bold uppercase section title (Iosevka) — accepts multi-line via children */
export function Title({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <h2 className={`case-study-section-header ${className}`}>{children}</h2>;
}

export function Body({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={`cog-body ${className}`}>{children}</p>;
}

/** left-bordered monospace pull-quote */
export function Callout({ children }: { children: ReactNode }) {
  return <p className="cog-callout">{children}</p>;
}

/** heavy emphasised statement (no border) */
export function Statement({ children }: { children: ReactNode }) {
  return <p className="cog-statement">{children}</p>;
}
