# Visual element → code mapping

A quick index of where each visible piece of the hero lives, so you can find and tweak things without hunting.

---

## Circuit field (the dark routed background)

The full circuit board — wire traces, ground fills, energy pulses, vias, data dots, grain.

- **React component**: [components/hero/CircuitField.tsx](components/hero/CircuitField.tsx)
  - Defines the colour palette (uniforms) and feeds the shader.
  - Handles mouse + scroll inputs.
- **Shader (all the visuals)**: [components/hero/shaders.ts](components/hero/shaders.ts)
- **Post-processing (bloom, chromatic aberration, glitch)**: [components/hero/Effects.tsx](components/hero/Effects.tsx)
- **Scene wrapper**: [components/hero/Scene.tsx](components/hero/Scene.tsx)
- **Static fallback**: [components/hero/HeroPoster.tsx](components/hero/HeroPoster.tsx)

### Colour palette (edit hex values here)

[components/hero/CircuitField.tsx:20-29](components/hero/CircuitField.tsx#L20-L29)

| Uniform     | Default     | Used for                                    |
|-------------|-------------|---------------------------------------------|
| `uBg`       | `#05070a`   | Background base                             |
| `uBgFloor`  | `#0a0e14`   | Centre lift                                 |
| `uPipe`     | `#11161d`   | Unlit pipe floor                            |
| `uPipeEdge` | `#1c2530`   | Engraved edge sheen                         |
| `uGround`   | `#0c1118`   | Ground-fill regions in negative space       |
| `uCyan`     | `#3fe0d0`   | Energy core (lines + cool side of dots)     |
| `uHot`      | `#eafffb`   | White-hot peaks                             |
| `uMagenta`  | `#ff3da6`   | Data-stream character dots (warm side)      |
| `uViolet`   | `#8b5cff`   | Reserved tone                               |
| `uPink`     | `#ff66d9`   | Vias (crossing dots) + line tone blend      |

---

## Vias (the round dots at wire crossings)

Those bright sparkles where a horizontal and vertical wire intersect.

- **Where computed**: [components/hero/shaders.ts:153-160](components/hero/shaders.ts#L153-L160)
- **Energy/twinkle**: [components/hero/shaders.ts:201-203](components/hero/shaders.ts#L201-L203)
- **Colour**: [components/hero/shaders.ts:212](components/hero/shaders.ts#L212)
  ```glsl
  vec3 circCol = mix(uPink, uCyan, wCirc * 0.55);
  ```
  → To shift via hue, change `uPink` hex in `CircuitField.tsx`, or swap `uPink` for `uViolet`/`uMagenta` here.

---

## Lines (the wire traces themselves)

- **Routing presence (which rows/cols are wired)**: [components/hero/shaders.ts:93-110](components/hero/shaders.ts#L93-L110)
- **Width + per-lane character**: [components/hero/shaders.ts:112-130](components/hero/shaders.ts#L112-L130)
- **Stipple/riso dot texture**: [components/hero/shaders.ts:137-151](components/hero/shaders.ts#L137-L151)
- **Travelling pulse (the single sweeping packet)**: [components/hero/shaders.ts:171-190](components/hero/shaders.ts#L171-L190)
- **Mouse sparkles on traces**: [components/hero/shaders.ts:192-197](components/hero/shaders.ts#L192-L197)
- **Line colour**: [components/hero/shaders.ts:211](components/hero/shaders.ts#L211)

---

## Data-stream layer ("data dots" — the magenta dots in the dark gaps)

The vintage code-printout grain — small magenta/cyan dots clustered in the *negative space* between the wires. They breathe in and out and occasionally smear sideways. Now also pick up a soft glow when the travelling pulse sweeps a nearby lane.

- **Region mask + smear bands**: [components/hero/shaders.ts:237-240](components/hero/shaders.ts#L237-L240)
- **Character grid + dot shape**: [components/hero/shaders.ts:241-247](components/hero/shaders.ts#L241-L247)
- **Colour**: [components/hero/shaders.ts:248](components/hero/shaders.ts#L248)
  ```glsl
  vec3 dataCol = mix(uMagenta, uCyan, step(0.8, h21(vec2(ccell.y, 9.0))));
  ```

---

## Substrate (the dark "stage" — everything non-glowing)

The radial background gradient, the engraved pipe floor under the wires, ground-fill patches in negative space, the corner vignette, and the film grain. Basically all the non-emissive dark scenery that makes it feel like a board lit from below.

- **Background gradient with mouse parallax**: [components/hero/shaders.ts:219-222](components/hero/shaders.ts#L219-L222)
- **Engraved pipe floor + edge sheen**: [components/hero/shaders.ts:224-227](components/hero/shaders.ts#L224-L227)
- **Ground fills in negative space**: [components/hero/shaders.ts:230-231](components/hero/shaders.ts#L230-L231)
- **Vignette + phosphor flicker**: [components/hero/shaders.ts:254-256](components/hero/shaders.ts#L254-L256)
- **Film grain**: [components/hero/shaders.ts:258-260](components/hero/shaders.ts#L258-L260)

---

## Foreground UI (title, telemetry, barcode, footer)

All in [app/page.tsx](app/page.tsx):

- **Top status bar / nav**: [app/page.tsx:31-38](app/page.tsx#L31-L38)
- **Left telemetry column**: [app/page.tsx:41-45](app/page.tsx#L41-L45)
- **Rotated right-edge label**: [app/page.tsx:48-50](app/page.tsx#L48-L50)
- **Main title (Caroline Jaworsky + tagline)**: [app/page.tsx:53-72](app/page.tsx#L53-L72)
- **Bottom-left barcode**: [app/page.tsx:75-86](app/page.tsx#L75-L86)
- **Bottom-right terminal prompt**: [app/page.tsx:89-92](app/page.tsx#L89-L92)
- **Darkening gradient overlay (legibility)**: [app/page.tsx:20-27](app/page.tsx#L20-L27)

---

## Post-processing / "post-fx" (filters applied after the shader renders)

[components/hero/Effects.tsx](components/hero/Effects.tsx) — three image filters layered on top of the rendered scene. Nothing visual is *generated* here; it just processes the final image.

- **Bloom** — bright spots bleed outward, gives the glow halo.
- **Chromatic Aberration** — splits the red/blue channels on bright pixels. Now uses a custom `PinkAberration` ([components/hero/PinkAberration.tsx](components/hero/PinkAberration.tsx)) that biases the displaced red sample toward magenta, so the fringe reads as pink instead of pure red.
- **Glitch** — occasional jitter/tearing for the digital feel.

Tuning knobs in [components/hero/Effects.tsx](components/hero/Effects.tsx):
- `offset={[x, y]}` — smaller = subtler fringe.
- `pinkBias={0..1}` — 0 = standard CA (red fringe), 1 = max pink. Currently `0.7`.
