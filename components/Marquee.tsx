"use client";

import type { ReactNode } from "react";

// Seamless infinite marquee. The track holds two identical copies of `children`;
// the keyframe slides it by exactly -50% (one copy's width), so the loop point is
// invisible regardless of content width. Direction flips via `reverse`. Animation
// is paused under prefers-reduced-motion (see globals.css).
export function Marquee({
  children,
  durationSec = 30,
  reverse = false,
  pauseOnHover = false,
  className = "",
}: {
  children: ReactNode;
  durationSec?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  className?: string;
}) {
  return (
    <div className={`marquee ${className}`} data-pause={pauseOnHover ? "true" : undefined}>
      <div
        className="marquee__track"
        style={{
          animationDuration: `${durationSec}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <div className="marquee__group">{children}</div>
        <div className="marquee__group" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
