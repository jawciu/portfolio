/** Ambient background blob — Vector's AI gradient (lilac melting into peach) as a
    soft luminous wash over the near-black page. Purely decorative: position + size
    it with `className` (absolute). Because the page is dark, the radial layers read
    as an additive glow rather than a tint; they fade to transparent and a heavy blur
    merges them so edges never read as a hard shape. Override opacity/blur per use. */
export function SoftBlob({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute -z-10 rounded-full opacity-60 blur-[80px] ${className}`}
      style={{
        background:
          "radial-gradient(56% 56% at 32% 30%, rgba(192, 152, 255, 0.55), rgba(192,152,255,0) 70%)," +
          "radial-gradient(54% 54% at 70% 68%, rgba(255, 156, 125, 0.42), rgba(255,156,125,0) 72%)",
      }}
    />
  );
}
