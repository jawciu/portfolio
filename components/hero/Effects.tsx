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
      <Bloom
        luminanceThreshold={0.55}
        luminanceSmoothing={0.3}
        intensity={0.9}
        radius={0.7}
        mipmapBlur
      />
      <ChromaticAberration
        offset={[0.0018, 0.0012]}
        radialModulation={false}
        modulationOffset={0}
        blendFunction={BlendFunction.NORMAL}
      />
      <Scanline density={1.25} opacity={0.085} blendFunction={BlendFunction.OVERLAY} />
      <Noise opacity={0.07} blendFunction={BlendFunction.OVERLAY} premultiply />
      <Vignette offset={0.3} darkness={0.85} eskil={false} />
      {/* Rare, slow block-tear punctuation; the eased glitch surge lives in the shader */}
      {tier >= 3 && (
        <Glitch
          delay={[7, 13]}
          duration={[0.3, 0.6]}
          strength={[0.04, 0.18]}
          mode={GlitchMode.SPORADIC}
          ratio={0.85}
          columns={0.05}
          active
        />
      )}
    </EffectComposer>
  );
}
