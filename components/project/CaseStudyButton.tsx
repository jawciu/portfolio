"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

/** Shared case-study CTA button — squarish thin border, bold mono uppercase label,
    fills with the accent colour on hover. Pass `color` (any CSS colour) per case
    study so each page keeps its own accent. Renders a Next.js Link when `href` is
    set, otherwise a <button> (pass `onClick`). */
export function CaseStudyButton({
  children,
  color,
  href,
  onClick,
  className = "",
}: {
  children: ReactNode;
  /** accent colour (hex or CSS var) for border + text, and the hover fill */
  color: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}) {
  const cls =
    "inline-flex items-center gap-2.5 rounded-md border border-[var(--csb)] px-5 py-3 font-mono text-xs font-bold tracking-[0.2em] text-[var(--csb)] transition-colors hover:bg-[var(--csb)] hover:text-white md:text-sm";
  const style = { "--csb": color } as CSSProperties;

  if (href) {
    return (
      <Link href={href} className={`${cls} ${className}`} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={`${cls} ${className}`} style={style}>
      {children}
    </button>
  );
}
