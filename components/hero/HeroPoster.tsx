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
          "radial-gradient(ellipse at 30% 30%, rgba(0,212,255,0.10), transparent 55%), radial-gradient(ellipse at 70% 70%, rgba(255,0,110,0.08), transparent 55%), #050507",
      }}
    />
  );
}
