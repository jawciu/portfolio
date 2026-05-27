"use client";

import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Scanline,
  Noise,
  Vignette,
  Glitch,
} from "@react-three/postprocessing";
import { BlendFunction, GlitchMode } from "postprocessing";
import { useGPUTier } from "@/lib/useGPUTier";

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
      {/* Whisper-low baseline RGB split (the vintage tell when overdone) */}
      <ChromaticAberration
        offset={[0.0009, 0.0006]}
        radialModulation={false}
        modulationOffset={0}
        blendFunction={BlendFunction.NORMAL}
      />
      {/* Faint CRT scanlines */}
      <Scanline density={1.1} opacity={0.06} blendFunction={BlendFunction.OVERLAY} />
      {/* Phosphor grain, sits in the shadows */}
      <Noise opacity={0.045} blendFunction={BlendFunction.OVERLAY} premultiply />
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
