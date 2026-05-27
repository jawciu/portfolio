"use client";

import dynamic from "next/dynamic";
import { HeroPoster } from "./hero/HeroPoster";

// Scene contains <Canvas> — touches window at import time.
// Loaded only on the client, with a CSS poster as the LCP placeholder.
const Scene = dynamic(
  () => import("./hero/Scene").then((m) => ({ default: m.Scene })),
  {
    ssr: false,
    loading: () => <HeroPoster />,
  },
);

export default function Hero() {
  return (
    <div className="fixed inset-0 z-0">
      <Scene />
    </div>
  );
}
