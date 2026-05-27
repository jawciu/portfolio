"use client";

import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useGPUTier } from "@/lib/useGPUTier";

export function Effects() {
  const tier = useGPUTier();
  if (tier < 2) return null;

  return (
    <EffectComposer multisampling={0} disableNormalPass>
      <Bloom
        luminanceThreshold={0.18}
        luminanceSmoothing={0.3}
        intensity={1.4}
        mipmapBlur
      />
      <ChromaticAberration
        offset={[0.0018, 0.0018]}
        radialModulation={true}
        modulationOffset={0.4}
        blendFunction={BlendFunction.NORMAL}
      />
      <Noise opacity={0.07} blendFunction={BlendFunction.OVERLAY} premultiply />
    </EffectComposer>
  );
}
