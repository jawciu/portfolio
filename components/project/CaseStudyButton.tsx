"use client";

import Link from "next/link";
import type { ReactNode } from "react";

/** Shared case-study CTA button — squarish thin border, bold mono uppercase label.
    One fixed colour in every instance: border + text are the home background colour
    (`--color-bg`); on hover it reverses, filling with that colour and flipping the
    text light. Renders a Next.js Link when `href` is set, otherwise a <button>
    (pass `onClick`). */
export function CaseStudyButton({
  children,
  href,
  onClick,
  className = "",
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}) {
  const cls =
    "inline-flex items-center gap-2.5 rounded-md border border-[var(--color-bg)] px-5 py-3 font-mono text-xs font-bold tracking-[0.2em] text-[var(--color-bg)] transition-colors hover:bg-[var(--color-bg)] hover:text-fg md:text-sm";

  if (href) {
    return (
      <Link href={href} className={`${cls} ${className}`}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={`${cls} ${className}`}>
      {children}
    </button>
  );
}
