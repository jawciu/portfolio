// Vertex shader — fullscreen plane, passes UV through
export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader — "hero option 2": living holographic light-leaks on near-black.
// A morphing metaball flame (top-left), a prism of rainbow arcs pulsing outward
// from the right, and iridescent capsule "pins" + a chrome sphere whose colours
// scroll and breathe. Everything drifts/pulses on uTime; mouse adds parallax.
//
// Coordinate space: P = (uv.x * aspect, 1.0 - uv.y) — origin top-left, y down,
// 1 unit == full viewport height, so circles stay round and numbers read like
// the Figma comp (x runs 0..aspect, y runs 0..1).
export const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uMouse;     // 0..1, smoothed
  uniform vec3  uBg;        // background base (near black)

  varying vec2 vUv;

  // ---- hash / value noise / fbm ----
  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 345.45));
    p += dot(p, p + 34.345);
    return fract(p.x * p.y);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  float fbm(vec2 p) {
    float s = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { s += a * vnoise(p); p *= 2.02; a *= 0.5; }
    return s;
  }

  // IQ cosine palette — rainbow iridescence. t wraps; tweak d for the colour story.
  vec3 pal(float t) {
    vec3 a = vec3(0.5);
    vec3 b = vec3(0.5);
    vec3 c = vec3(1.0);
    vec3 d = vec3(0.00, 0.33, 0.67);
    return a + b * cos(6.28318 * (c * t + d));
  }

  // Vertical capsule SDF (pill): segment a->b with radius r
  float sdCapsule(vec2 p, vec2 a, vec2 b, float r) {
    vec2 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - ba * h) - r;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;

    // top-left origin, y down; gentle mouse parallax
    vec2 par = (uMouse - 0.5) * 0.025;
    vec2 P = vec2(uv.x * aspect, 1.0 - uv.y) + vec2(par.x, -par.y);

    vec3 col = uBg;

    // =====================================================================
    // (1) MORPHING METABALL FLAME — top-left. Chain of gaussian blobs that
    //     shrink left->right; summed field + threshold makes them merge and
    //     wobble. Hue runs warm (left, big) to blue (right, tip).
    // =====================================================================
    {
      float field = 0.0;
      float hueAccum = 0.0;
      float wsum = 0.0;
      vec2 base = vec2(0.16, 0.18);            // big end, near top-left
      for (int i = 0; i < 7; i++) {
        float fi = float(i);
        float t = fi / 6.0;                    // 0..1 along the chain
        float wob = sin(uTime * 0.7 + fi * 1.3) * 0.5 + sin(uTime * 1.9 + fi) * 0.5;
        vec2 c = base + vec2(t * 0.56, 0.0);
        c.y += 0.018 * wob + 0.01 * fbm(vec2(fi, uTime * 0.25));
        c.x += 0.012 * sin(uTime * 0.9 + fi * 2.1);
        float r = mix(0.090, 0.016, t) * (1.0 + 0.16 * sin(uTime * 1.4 + fi * 1.7));
        float dd = length(P - c) / r;
        float g = exp(-dd * dd * 2.2);
        field += g;
        hueAccum += g * t;                     // weight hue by position
        wsum += g;
      }
      float flame = smoothstep(0.55, 1.5, field);
      float tHue = (wsum > 0.0) ? hueAccum / wsum : 0.0;
      // warm magenta/orange (left) -> violet -> blue (tip)
      float hue = mix(0.94, 0.60, tHue) + 0.04 * sin(uTime * 0.3);
      vec3 fcol = pal(hue);
      // hotter, lighter core where the field is densest
      fcol = mix(fcol, vec3(1.0, 0.92, 0.95), smoothstep(1.6, 3.2, field) * 0.6);
      col += fcol * flame * 1.25;
    }

    // =====================================================================
    // (2) PRISM — concentric rainbow arcs emanating from a centre off the
    //     right edge, drifting outward (the "pulse"), brightest pale-cyan
    //     core on the right. Reads as light refracting through curved glass.
    // =====================================================================
    {
      vec2 pc = vec2(aspect * 0.92, 0.56);
      pc.y += 0.02 * sin(uTime * 0.4);
      vec2 q = P - pc;
      q.y *= 0.82;                             // taller-than-wide lens
      float rad = length(q);
      // warp the rings a touch so they morph rather than sit as perfect circles
      float warp = 0.04 * fbm(q * 3.0 + uTime * 0.15);
      float rings = (rad + warp) * 5.4 - uTime * 0.45;
      vec3 rc = pal(fract(rings * 0.11) + 0.05 * sin(uTime * 0.2));
      float arc = 0.5 + 0.5 * sin(rings * 6.28318);
      arc = pow(arc, 1.6);
      float confine = smoothstep(1.05, 0.15, rad);
      col += rc * arc * confine * 0.85;
      // pale core, blooms toward the right
      col += vec3(0.82, 0.96, 1.0) * smoothstep(0.55, 0.0, rad) * 0.9;
    }

    // =====================================================================
    // (3) IRIDESCENT PILLS + SPHERE — capsule SDFs with a vertical rainbow
    //     fill that scrolls; soft halo; gentle breathing scale.
    // =====================================================================
    {
      float breathe = 1.0 + 0.06 * sin(uTime * 1.1);

      // left pill
      float dL = sdCapsule(P, vec2(0.055, 0.62), vec2(0.055, 0.92), 0.020 * breathe);
      vec3 cL = pal(P.y * 1.8 + uTime * 0.12);
      col += cL * (smoothstep(0.006, -0.004, dL) * 1.05 + smoothstep(0.055, 0.0, dL) * 0.30);

      // small chrome sphere just above the left pill
      vec2 sc = vec2(0.055, 0.515);
      float dS = length(P - sc) - 0.026 * (1.0 + 0.05 * sin(uTime * 1.6));
      vec3 cS = pal(P.y * 2.6 - P.x * 1.5 + uTime * 0.18);
      col += cS * (smoothstep(0.005, -0.006, dS) * 1.0 + smoothstep(0.04, 0.0, dS) * 0.25);

      // right pill
      float dR = sdCapsule(P, vec2(aspect - 0.06, 0.50), vec2(aspect - 0.06, 0.90), 0.018 * breathe);
      vec3 cR = pal(P.y * 1.7 - uTime * 0.10 + 0.4);
      col += cR * (smoothstep(0.006, -0.004, dR) * 1.05 + smoothstep(0.05, 0.0, dR) * 0.28);
    }

    // ---- finishing ----
    // soft cursor glow so the field feels responsive
    vec2 mp = vec2(uMouse.x * aspect, 1.0 - uMouse.y);
    float mg = exp(-length(P - mp) * length(P - mp) * 26.0);
    col += pal(uTime * 0.05 + 0.5) * mg * 0.12;

    // vignette + faint flicker + grain (matches the project's grain language)
    float r = length(uv - 0.5);
    col *= 1.0 - r * r * 0.85;
    col *= 0.985 + 0.015 * hash21(vec2(floor(uTime * 30.0)));
    float grain = hash21(uv * uResolution + fract(uTime) * 91.3) - 0.5;
    col += grain * 0.025;

    gl_FragColor = vec4(max(col, 0.0), 1.0);
  }
`;
