/** Ambient background blob lifted from the E.ON Next "Tech review" deck — a soft
    peach-pink melting into lilac, heavily diffused over the near-white page. Purely
    decorative: position + size it with `className` (absolute), drop it as the first
    child of a `relative isolate overflow-hidden` section so it sits behind the content
    and is clipped to the section. The radial layers fade to transparent and a blur
    merges them into one organic wash, so edges never read as a hard shape. */
export function SoftBlob({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute -z-10 rounded-full opacity-80 blur-[70px] ${className}`}
      style={{
        background:
          "radial-gradient(58% 58% at 34% 30%, rgba(252, 215, 210, 0.85), rgba(252,215,210,0) 70%)," +
          "radial-gradient(56% 56% at 70% 66%, rgba(228, 215, 247, 0.9), rgba(228,215,247,0) 72%)",
      }}
    />
  );
}
