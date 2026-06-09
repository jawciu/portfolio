"use client";

// Static fallback shown while Scene chunk loads. Doubles as LCP element.
// Pure CSS gradient — no JS, no image dependency — so it always renders instantly.
export function HeroPoster() {
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse 32% 22% at 22% 18%, rgba(139,92,255,0.18), transparent 60%), radial-gradient(ellipse 40% 55% at 78% 56%, rgba(255,120,60,0.12), transparent 60%), radial-gradient(ellipse 30% 45% at 88% 58%, rgba(120,230,255,0.12), transparent 55%), #070709",
      }}
    />
  );
}
