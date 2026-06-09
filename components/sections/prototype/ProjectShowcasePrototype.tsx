"use client";

// PROTOTYPE host — picks a project-showcase variant from ?variant= and renders
// it on the existing #work route, with a floating switcher to flip between
// them. Throwaway: once a direction wins, fold it into ProjectCarousel's slot
// and delete this whole prototype/ folder + the switcher wiring in page.tsx.
import { useRouter, useSearchParams } from "next/navigation";
import { ProjectCarousel } from "@/components/sections/ProjectCarousel";
import { PrototypeSwitcher, type VariantDef } from "./PrototypeSwitcher";
import { VariantShell } from "./VariantShell";
import { VariantDeck } from "./VariantDeck";
import { VariantBento } from "./VariantBento";

const VARIANTS: VariantDef[] = [
  { key: "current", name: "Center carousel (baseline)" },
  { key: "shell", name: "~/work terminal listing" },
  { key: "deck", name: "Holographic card deck" },
  { key: "bento", name: "Reflowing spotlight mosaic" },
];

export function ProjectShowcasePrototype() {
  const router = useRouter();
  const params = useSearchParams();
  const raw = params.get("variant") ?? "current";
  const current = VARIANTS.some((v) => v.key === raw) ? raw : "current";

  const setVariant = (key: string) => {
    const sp = new URLSearchParams(params.toString());
    sp.set("variant", key);
    router.replace(`?${sp.toString()}#work`, { scroll: false });
  };

  return (
    <>
      {current === "current" && <ProjectCarousel />}
      {current === "shell" && <VariantShell />}
      {current === "deck" && <VariantDeck />}
      {current === "bento" && <VariantBento />}

      <PrototypeSwitcher variants={VARIANTS} current={current} onChange={setVariant} />
    </>
  );
}
