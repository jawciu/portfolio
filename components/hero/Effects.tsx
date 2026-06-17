"use client";

import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useGPUTier } from "@/lib/useGPUTier";

// Clean & dreamy finish (agreed): tuned Bloom for rim/energy glow, whisper-low
// chromatic aberration for holographic edge shimmer, filmic grain + vignette.
// Scanlines + glitch intentionally dropped to match the mockup's photographic mood.
export function Effects() {
  const tier = useGPUTier();
  if (tier < 2) return null;

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        luminanceThreshold={0.55}
        luminanceSmoothing={0.3}
        intensity={1.0}
        radius={0.85}
        mipmapBlur
      />
      <ChromaticAberration
        offset={[0.0011, 0.0008]}
        radialModulation={false}
        modulationOffset={0}
        blendFunction={BlendFunction.NORMAL}
      />
      <Noise opacity={0.045} blendFunction={BlendFunction.OVERLAY} premultiply />
      <Vignette offset={0.28} darkness={0.82} eskil={false} />
    </EffectComposer>
  );
}
