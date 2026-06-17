"use client";

// PROTOTYPE — floating variant switcher. Throwaway: delete with the variants
// once a showcase direction is chosen. Hidden in production builds so a stray
// merge can never ship the bar to visitors.
import { useEffect } from "react";

export type VariantDef = { key: string; name: string };

export function PrototypeSwitcher({
  variants,
  current,
  onChange,
}: {
  variants: VariantDef[];
  current: string;
  onChange: (key: string) => void;
}) {
  const idx = Math.max(0, variants.findIndex((v) => v.key === current));
  const go = (dir: number) =>
    onChange(variants[(idx + dir + variants.length) % variants.length].key);

  // ← / → cycle variants. Don't hijack arrows while typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable)
      )
        return;
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex justify-center">
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-fg/15 bg-bg-elev/90 px-2 py-2 font-mono text-xs text-fg shadow-2xl backdrop-blur-md">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous variant"
          className="grid h-8 w-8 place-items-center rounded-full hover:bg-fg/10"
        >
          ←
        </button>
        <div className="flex items-center gap-2 px-3">
          <span className="text-accent-cyan">PROTO</span>
          <span className="text-fg/40">·</span>
          <span className="uppercase tracking-[0.18em]">{current}</span>
          <span className="text-fg/40">—</span>
          <span className="text-fg-muted">{variants[idx]?.name}</span>
          <span className="ml-2 text-fg/30">{idx + 1}/{variants.length}</span>
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next variant"
          className="grid h-8 w-8 place-items-center rounded-full hover:bg-fg/10"
        >
          →
        </button>
      </div>
    </div>
  );
}
