"use client";

// PROTOTYPE host — picks a project-showcase variant from ?variant= and renders
// it on the existing #work route, with a floating switcher to flip between
// them. Throwaway: once a direction wins, fold it into ProjectCarousel's slot
// and delete this whole prototype/ folder + the switcher wiring in page.tsx.
//
// 2026-06-15: Caroline picked bento2 (VariantBentoSoft) as the direction to
// iterate on. The variant switcher + all other variants are COMMENTED OUT (not
// deleted) below so we can focus on bento2; restore by uncommenting.
import { VariantBentoSoft } from "./VariantBentoSoft";

// import { useRouter, useSearchParams } from "next/navigation";
// import { ProjectCarousel } from "@/components/sections/ProjectCarousel";
// import { PrototypeSwitcher, type VariantDef } from "./PrototypeSwitcher";
// import { VariantShell } from "./VariantShell";
// import { VariantShellSoft } from "./VariantShellSoft";
// import { VariantDeck } from "./VariantDeck";
// import { VariantBento } from "./VariantBento";

// const VARIANTS: VariantDef[] = [
//   { key: "current", name: "Center carousel (baseline)" },
//   { key: "shell", name: "~/work terminal listing" },
//   { key: "shell2", name: "Soft shell + pixel sprites" },
//   { key: "deck", name: "Holographic card deck" },
//   { key: "bento", name: "Reflowing spotlight mosaic" },
//   { key: "bento2", name: "Diffused grain mosaic" },
// ];

export function ProjectShowcasePrototype() {
  // Locked to bento2 while we iterate on it.
  return <VariantBentoSoft />;

  // --- Variant switcher (restore to compare directions again) ----------------
  // const router = useRouter();
  // const params = useSearchParams();
  // const raw = params.get("variant") ?? "current";
  // const current = VARIANTS.some((v) => v.key === raw) ? raw : "current";
  //
  // const setVariant = (key: string) => {
  //   const sp = new URLSearchParams(params.toString());
  //   sp.set("variant", key);
  //   router.replace(`?${sp.toString()}#work`, { scroll: false });
  // };
  //
  // return (
  //   <>
  //     {current === "current" && <ProjectCarousel />}
  //     {current === "shell" && <VariantShell />}
  //     {current === "shell2" && <VariantShellSoft />}
  //     {current === "deck" && <VariantDeck />}
  //     {current === "bento" && <VariantBento />}
  //     {current === "bento2" && <VariantBentoSoft />}
  //
  //     <PrototypeSwitcher variants={VARIANTS} current={current} onChange={setVariant} />
  //   </>
  // );
}
