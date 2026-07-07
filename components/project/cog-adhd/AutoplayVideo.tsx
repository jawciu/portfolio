"use client";

import { useEffect, useRef } from "react";

/**
 * AutoplayVideo — a muted looping clip that plays itself as reliably as iOS
 * allows. The bare `autoPlay` attribute can silently fail on Safari (deferred
 * loading on heavy pages), so an IntersectionObserver also calls .play() when
 * the clip scrolls into view (and pauses off-screen, saving battery).
 *
 * KNOWN LIMIT: iOS **Low Power Mode** blocks ALL programmatic playback — the
 * user sees a play button and must tap. No web API can override that.
 */
export function AutoplayVideo({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {
            /* Low Power Mode / autoplay blocked — the native play button shows */
          });
        } else {
          el.pause();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      className={className}
    />
  );
}
