"use client";

import { Effect } from "postprocessing";
import * as THREE from "three";
import { forwardRef, useMemo } from "react";

// Chromatic aberration that biases the displaced red channel toward magenta —
// the offset fringe reads as pink instead of pure red.
const fragmentShader = /* glsl */ `
  uniform vec2 uOffset;
  uniform float uPinkBias;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec4 cR = texture2D(inputBuffer, uv - uOffset);
    vec4 cG = texture2D(inputBuffer, uv);
    vec4 cB = texture2D(inputBuffer, uv + uOffset);

    float r = cR.r;
    float g = cG.g;
    // Pull some blue from the red-sample position so the red fringe becomes pink
    float b = max(cB.b, cR.b * uPinkBias);

    outputColor = vec4(r, g, b, inputColor.a);
  }
`;

class PinkAberrationEffect extends Effect {
  constructor({
    offset = new THREE.Vector2(0.0024, 0.0016),
    pinkBias = 0.85,
  }: { offset?: THREE.Vector2; pinkBias?: number } = {}) {
    super("PinkAberrationEffect", fragmentShader, {
      uniforms: new Map<string, THREE.Uniform>([
        ["uOffset", new THREE.Uniform(offset)],
        ["uPinkBias", new THREE.Uniform(pinkBias)],
      ]),
    });
  }
}

type Props = {
  offset?: [number, number];
  pinkBias?: number;
};

export const PinkAberration = forwardRef<PinkAberrationEffect, Props>(
  function PinkAberration({ offset = [0.0024, 0.0016], pinkBias = 0.85 }, ref) {
    const effect = useMemo(
      () =>
        new PinkAberrationEffect({
          offset: new THREE.Vector2(offset[0], offset[1]),
          pinkBias,
        }),
      [offset, pinkBias],
    );
    return <primitive ref={ref} object={effect} dispose={null} />;
  },
);
