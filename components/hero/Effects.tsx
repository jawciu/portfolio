"use client";

import {
  EffectComposer,
  Bloom,
  Scanline,
  Noise,
  Vignette,
  Glitch,
} from "@react-three/postprocessing";
import { BlendFunction, GlitchMode } from "postprocessing";
import { useGPUTier } from "@/lib/useGPUTier";
import { PinkAberration } from "./PinkAberration";

export function Effects() {
  const tier = useGPUTier();
  if (tier < 2) return null;

  return (
    <EffectComposer multisampling={0} disableNormalPass>
      {/* Phosphor glow — high threshold so only the energy/sparkle blooms,
          never the dark substrate */}
      <Bloom
        luminanceThreshold={0.55}
        luminanceSmoothing={0.3}
        intensity={0.9}
        radius={0.7}
        mipmapBlur
      />
      {/* Pink-tinted RGB split — fringe reads as magenta, not red */}
      <PinkAberration offset={[0.0024, 0.0016]} pinkBias={0.5} />
      {/* Faint CRT scanlines */}
      <Scanline density={1.25} opacity={0.085} blendFunction={BlendFunction.OVERLAY} />
      {/* Phosphor grain, sits in the shadows */}
      <Noise opacity={0.07} blendFunction={BlendFunction.OVERLAY} premultiply />
      {/* Soft vignette to protect edges + focus center-mass */}
      <Vignette offset={0.3} darkness={0.85} eskil={false} />
      {/* Rare, short datamosh glitch — punctuation, not constant */}
      {tier >= 3 && (
        <Glitch
          delay={[8, 16]}
          duration={[0.06, 0.14]}
          strength={[0.02, 0.12]}
          mode={GlitchMode.SPORADIC}
          ratio={0.9}
          active
        />
      )}
    </EffectComposer>
  );
}
