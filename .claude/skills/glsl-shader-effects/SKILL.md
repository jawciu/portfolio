---
name: glsl-shader-effects
description: Write GLSL shaders for the portfolio's moody/holographic/glitchy aesthetic — circuit-board running lights, iridescent surfaces, chromatic aberration, FBM noise fields, particle meshes, SDF organic shapes. Use whenever authoring a fragment/vertex shader, integrating LYGIA snippets, building a custom shaderMaterial, or designing a procedural visual for the hero or case-study backgrounds.
license: Proprietary
metadata:
  project: portfolio
  shader-stack: glsl + glslify + lygia
---

# GLSL Shader Effects — recipes for the portfolio aesthetic

The aesthetic vocabulary: chromatic aberration, holographic iridescence, FBM noise, circuit-board running lights, glitchy displacement, gritty grain. Dark background, light subject. Reference moodboard in `~/.claude/projects/-Users-caro-Code-portfolio/memory/aesthetic_direction.md`.

## Setup

Use LYGIA for noise/SDF/lighting primitives. Don't reinvent them.

```bash
pnpm add glslify glslify-loader
# vendor LYGIA into /shaders/lib/lygia/ (don't pull the whole tree, just folders you use)
```

Webpack/Next.js config to inline `.glsl` imports:
```js
// next.config.js
config.module.rules.push({
  test: /\.(glsl|vs|fs|vert|frag)$/,
  use: ['raw-loader', 'glslify-loader'],
})
```

Then in a shader:
```glsl
#pragma glslify: fbm = require(lygia/generative/fbm)
#pragma glslify: snoise = require(lygia/generative/snoise)
```

## Drei `shaderMaterial` helper

```tsx
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'

const CircuitMaterial = shaderMaterial(
  { uTime: 0, uProgress: 0, uResolution: new Vector2(), uColorA: new Color('#00d4ff'), uColorB: new Color('#ff006e') },
  vertexShader,
  fragmentShader,
)
extend({ CircuitMaterial })

// JSX:
<mesh>
  <planeGeometry args={[2, 2]} />
  <circuitMaterial ref={matRef} uColorA="#00d4ff" />
</mesh>
```

Drei generates typed JSX bindings + supports HMR for the shader strings.

## Recipe 1 — Circuit-board running light

The "CPU with lights running on traces" hero. Two layers:

**Trace mask** — procedural Voronoi or grid pattern thresholded into lines:
```glsl
#pragma glslify: voronoi = require(lygia/generative/voronoi)

float traces(vec2 uv) {
  vec3 v = voronoi(vec3(uv * 8.0, 0.0));
  float d = v.x;                                // distance to nearest cell center
  float lines = smoothstep(0.02, 0.0, abs(d - 0.5));  // ridge along cell boundaries
  return lines;
}
```

**Running light** — scrolling 1D gradient along the trace's parametric direction:
```glsl
float light(float traceMask, vec2 uv, float t) {
  // assume each trace has a UV.x that runs along its length
  float pulse = fract(uv.x * 2.0 - t * 0.5);
  float glow = exp(-pulse * pulse * 40.0);     // narrow gaussian head
  return traceMask * glow;
}

void main() {
  vec2 uv = vUv;
  float m = traces(uv);
  float L = light(m, uv, uTime);
  vec3 col = mix(uColorA, uColorB, L) * (0.1 + L * 4.0);   // base glow + hot head
  gl_FragColor = vec4(col, m);                  // alpha follows trace mask
}
```

Pair with `<Bloom intensity={0.9}/>` in postprocessing for the bleed.

## Recipe 2 — Holographic / iridescent surface

Three approaches, pick by need:

**A. Built-in PBR iridescence** (Three.js MeshPhysicalMaterial, easiest):
```tsx
<meshPhysicalMaterial
  iridescence={1}
  iridescenceIOR={1.3}
  iridescenceThicknessRange={[100, 800]}
  metalness={1}
  roughness={0.2}
/>
```

**B. View-angle gradient in custom shader** (cheap, very controllable):
```glsl
varying vec3 vNormalW;
varying vec3 vViewW;

void main() {
  float fres = pow(1.0 - dot(normalize(vNormalW), normalize(vViewW)), 2.5);
  // sample a 1D gradient texture (rainbow) by fresnel
  vec3 holo = texture2D(uGradient, vec2(fres, 0.5)).rgb;
  gl_FragColor = vec4(holo, 1.0);
}
```

The gradient texture controls the iridescence palette — author it in Figma if you want pinpoint control over the color story.

**C. LYGIA PBR-correct iridescence:**
```glsl
#pragma glslify: pbrIridescence = require(lygia/lighting/pbrIridescence)
```

## Recipe 3 — Chromatic aberration (in-shader)

Usually do this as a postprocessing pass (`<ChromaticAberration/>`). But if you want per-pixel control (e.g. only on the subject, not background), do it in the fragment shader:

```glsl
vec2 dir = normalize(vUv - 0.5);
float amount = uAberration * length(vUv - 0.5);
float r = texture2D(uScene, vUv - dir * amount).r;
float g = texture2D(uScene, vUv).g;
float b = texture2D(uScene, vUv + dir * amount).b;
gl_FragColor = vec4(r, g, b, 1.0);
```

## Recipe 4 — FBM noise field (clouds, plasma, fog)

```glsl
#pragma glslify: fbm = require(lygia/generative/fbm)

float n = fbm(vec3(uv * 3.0, uTime * 0.1));   // 0..1, slowly evolving
n = smoothstep(0.3, 0.8, n);                   // contrast
vec3 col = mix(vec3(0.02, 0.02, 0.05), uColorA, n);
```

For fluid-feeling motion (the "iridescent oil" reference), use curl noise to advect a base pattern:
```glsl
#pragma glslify: curl = require(lygia/generative/curl)

vec2 flow = curl(vec3(uv * 2.0, uTime * 0.2)).xy * 0.05;
vec3 col = fbm(vec3((uv + flow) * 4.0, uTime * 0.1));
```

## Recipe 5 — Glitch / digital displacement

Block-based UV displacement:
```glsl
float block(vec2 uv, float t) {
  vec2 b = floor(uv * vec2(20.0, 8.0));         // big blocks
  return step(0.9, fract(sin(dot(b, vec2(12.9898, 78.233)) + t) * 43758.5453));
}

vec2 uv = vUv;
float g = block(uv, floor(uTime * 8.0));
uv.x += g * (sin(uTime * 50.0) * 0.05);
vec4 col = texture2D(uScene, uv);
// optional RGB split on glitched pixels
col.r = texture2D(uScene, uv + vec2(g * 0.02, 0)).r;
col.b = texture2D(uScene, uv - vec2(g * 0.02, 0)).b;
```

Trigger via a uniform that GSAP pulses on scroll milestones / section transitions.

## Recipe 6 — Particle mesh / network constellation

The moodboard image with star-points connected by thin lines.

Two strategies:

**A. THREE.Points** for the points + a custom LineSegments geometry built per-frame for connections under a distance threshold. Works up to ~2000 points before connection-search dominates.

**B. GPU-only** using `THREE.InstancedMesh` of tiny billboards + a precomputed connection graph. For >5000 points use GPGPU via `GPUComputationRenderer`.

Point shader (gives the soft halo):
```glsl
// fragment
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c);
  float a = smoothstep(0.5, 0.0, r);
  gl_FragColor = vec4(uColor, a * a);
}
```

Enable additive blending on the material: `blending: AdditiveBlending`, `depthWrite: false`.

## Recipe 7 — SDF organic shapes

Ray-march in a fullscreen-quad fragment shader. Keep step count <64 for mobile. LYGIA has `sdf/*` primitives + boolean ops + smooth-min.

```glsl
#pragma glslify: sdSphere = require(lygia/sdf/sphereSDF)
#pragma glslify: opSmoothUnion = require(lygia/sdf/opSmoothUnion)

float map(vec3 p) {
  float a = sdSphere(p - vec3(sin(uTime), 0, 0), 0.6);
  float b = sdSphere(p - vec3(-sin(uTime), cos(uTime) * 0.5, 0), 0.5);
  return opSmoothUnion(a, b, 0.4);
}
```

Standard sphere-tracing loop, normal via gradient, lambert + fresnel for shading.

## Gotchas

- **Always declare `precision highp float;`** at the top of fragment shaders — some Android GPUs default to mediump and you'll see banding on noise/gradients.
- **WebGL2 features:** `texelFetch`, integer ops, multiple render targets. Three.js detects automatically but check `gl.capabilities.isWebGL2` before relying on `#version 300 es` syntax. R3F + drei materials default to WebGL1-compatible.
- **Texture sampling in vertex shaders** works but is slow; prefer fragment-side sampling for noise lookups.
- **Color management:** When outputting in custom shaders, Three.js applies tonemapping + output color conversion automatically. If your final colors look washed out, you're double-converting — check `material.toneMapped` (set to `false` for emissive/glowy shaders).

## Don't

- Don't write Perlin noise from scratch; LYGIA's is faster and tested.
- Don't use `mod()` for tiling — use `fract()`, it's more predictable on edge cases.
- Don't put `if` branches in inner loops; use `mix()` or `step()` for GPU-friendly conditionals.
- Don't ship raw GLSL strings concatenated in TS files — author them as `.glsl` files with `glslify-loader` so syntax highlighting + linting works.
