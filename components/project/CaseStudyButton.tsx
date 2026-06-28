"use client";

import Link from "next/link";
import type { ReactNode } from "react";

/** Shared case-study CTA button — squarish thin border, bold mono uppercase label.
    `tone` picks the colour pair:
      • "ink" (default) — border + text are the home background colour (`--color-bg`),
        for light surfaces (the case-study pages); hover fills with that colour and
        flips the text light.
      • "light" — border + text are the foreground (`--color-fg`), for DARK surfaces
        (e.g. the home bento cards); hover fills with fg and flips the text dark.
    Renders a Next.js Link for in-app paths, a plain <a target="_blank"> for external
    http(s) URLs, or a <button> when only `onClick` is given. */
export function CaseStudyButton({
  children,
  href,
  onClick,
  tone = "ink",
  size = "md",
  className = "",
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  tone?: "ink" | "light";
  /** "md" (default, case-study CTA) or "sm" (compact, e.g. a row on a card). */
  size?: "md" | "sm";
  className?: string;
}) {
  const tones = {
    ink: "border-[var(--color-bg)] text-[var(--color-bg)] hover:bg-[var(--color-bg)] hover:text-fg",
    light: "border-fg text-fg hover:bg-fg hover:text-[var(--color-bg)]",
  };
  const sizes = {
    md: "gap-2.5 px-5 py-3 text-xs tracking-[0.2em] md:text-sm",
    sm: "gap-1.5 px-3 py-2 text-[12px] tracking-[0.12em]",
  };
  const cls = `inline-flex items-center rounded-md border font-mono font-bold transition-colors ${sizes[size]} ${tones[tone]} ${className}`;

  if (href) {
    if (/^https?:\/\//.test(href)) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
