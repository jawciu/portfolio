/** Ambient background blob for the Cog ADHD study — a soft warm peach melting into a
    mint-green (echoes the cog mascot palette: orange + green). Same mechanics as the
    wiki SoftBlob, retinted to the cog palette. Purely decorative: position + size it
    with `className` (absolute). The radial layers fade to transparent and a blur merges
    them into one organic wash, so edges never read as a hard shape. */
export function SoftBlob({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute -z-10 rounded-full opacity-80 blur-[70px] ${className}`}
      style={{
        background:
          "radial-gradient(58% 58% at 34% 30%, rgba(250, 222, 196, 0.85), rgba(250,222,196,0) 70%)," +
          "radial-gradient(56% 56% at 70% 66%, rgba(188, 228, 204, 0.92), rgba(188,228,204,0) 72%)",
      }}
    />
  );
}
