// Vertex shader — fullscreen plane, passes UV through
export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader — dark, moody connected circuit board.
// Traces are barely-there metal; the LIGHT is the subject. Energy radiates
// outward along the wires from the mouse position (current injection), with a
// faint ambient flow when idle.
export const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform vec3 uColorA;     // energy cyan
  uniform vec3 uColorB;     // energy magenta / pink
  uniform vec3 uColorC;     // energy warm amber spark
  uniform vec3 uMetalWarm;  // dark copper base
  uniform vec3 uMetalCool;  // faint steel sheen
  uniform vec3 uPcb;        // deep board tint

  varying vec2 vUv;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float edgeOpen(vec2 mid, float thr) {
    return step(thr, hash21(mid + 7.3));
  }

  vec3 segDist(vec2 p, vec2 a, vec2 b) {
    vec2 pa = p - a;
    vec2 ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    vec2 cp = a + ba * h;
    return vec3(length(p - cp), cp);
  }

  // Narrow travelling pulse, wrap-safe
  float band(float x) {
    float f = fract(x);
    float d = min(f, 1.0 - f);
    return exp(-d * d * 80.0);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;

    // Gentle parallax; cancels out of mouse-distance so the lit spot stays
    // glued to the cursor.
    vec2 par = (uMouse - 0.5) * 0.025;
    vec2 P = vec2((uv.x + par.x) * aspect, uv.y + par.y);

    float gridSize = 20.0;          // denser routing
    vec2 g = P * gridSize;
    vec2 cellId = floor(g);
    vec2 cl = fract(g) - 0.5;

    // Shared-edge connectivity → continuous wires
    float thr = 0.50;
    float openR = edgeOpen(cellId + vec2(0.5, 0.0), thr);
    float openL = edgeOpen(cellId + vec2(-0.5, 0.0), thr);
    float openU = edgeOpen(cellId + vec2(0.0, 0.5), thr);
    float openD = edgeOpen(cellId + vec2(0.0, -0.5), thr);
    float conn = openR + openL + openU + openD;

    // Route traces, track nearest point for continuous flow coordinate
    float best = 1e9;
    vec2 bestCp = vec2(0.0);
    vec2 c0 = vec2(0.0);
    if (openR > 0.5) { vec3 s = segDist(cl, c0, vec2(0.5, 0.0));  if (s.x < best) { best = s.x; bestCp = s.yz; } }
    if (openL > 0.5) { vec3 s = segDist(cl, c0, vec2(-0.5, 0.0)); if (s.x < best) { best = s.x; bestCp = s.yz; } }
    if (openU > 0.5) { vec3 s = segDist(cl, c0, vec2(0.0, 0.5));  if (s.x < best) { best = s.x; bestCp = s.yz; } }
    if (openD > 0.5) { vec3 s = segDist(cl, c0, vec2(0.0, -0.5)); if (s.x < best) { best = s.x; bestCp = s.yz; } }

    float dTrace = best;
    float aa = fwidth(dTrace) * 1.5;
    float width = 0.038;            // finer traces
    float traceMask = smoothstep(width + aa, width - aa, dTrace);

    // Vias / pads at nodes
    float padR = 0.06 + 0.045 * step(2.5, conn);
    float dPad = length(cl);
    float pad = (conn > 0.5) ? smoothstep(padR + aa, padR - aa, dPad) : 0.0;
    float ring = (conn > 2.5) ? smoothstep(0.022, 0.0, abs(dPad - padR * 0.62)) : 0.0;
    float solid = max(traceMask, pad);

    // Faint metallic read (dark, so the circuit is just legible unlit)
    float tube = 1.0 - clamp(dTrace / width, 0.0, 1.0);
    float metalShade = pow(tube, 0.5);
    vec3 metal = mix(uMetalWarm * 0.35, uMetalWarm, metalShade);
    metal += uMetalCool * pow(tube, 6.0) * 0.25;
    metal -= uMetalCool * ring * 0.1;
    metal *= solid;

    // ---- Mouse distance (in grid units; parallax cancels) ----
    vec2 mP = vec2((uMouse.x + par.x) * aspect, uMouse.y + par.y);
    vec2 mouseG = mP * gridSize;
    float dM = length(g - mouseG);

    // Energy injected at the cursor, rippling outward along the wires
    float pool  = exp(-dM * dM * 0.020);             // soft light pool at cursor
    float rings = band(dM * 0.5 - uTime * 2.4);      // expanding pulses from cursor
    float reach = exp(-dM * 0.10);                   // pulses fade with distance
    float mouseE = pool * 0.9 + rings * reach * 1.6;

    // Subtle ambient flow so it breathes when the mouse is still
    vec2 worldCp = cellId + bestCp + 0.5;
    float flow = dot(worldCp, normalize(vec2(1.0, 0.6)));
    float ambient = band(flow * 0.3 - uTime * 0.7) * 0.18;

    float energy = (ambient + mouseE) * traceMask;

    // Pads flare as energy reaches them
    float padFlow = band(dot(cellId + 0.5, normalize(vec2(1.0, 0.6))) * 0.3 - uTime * 0.7);
    float padNear = exp(-length((cellId + 0.5) - mouseG) * 0.12);
    energy += pad * (padFlow * 0.25 + padNear * (0.6 + 0.4 * sin(uTime * 3.0)));

    // Energy colour — cool dominant, occasional warm/pink sparks (cosmic-web feel)
    vec2 region = floor(g * 0.18);
    float rmix = hash21(region);
    vec3 eCol = mix(uColorA, uColorB, smoothstep(0.6, 1.0, rmix));
    eCol = mix(eCol, uColorC, step(0.9, hash21(region + 3.0)) * 0.8);
    eCol = mix(eCol, vec3(1.0), clamp(energy * 0.4, 0.0, 0.6));   // white-hot cores

    // Bright star-nodes at select vias (like glowing web nodes)
    float starPick = step(0.86, hash21(cellId + 12.0));
    float star = starPick * pad * (0.25 + (padNear) * 2.5);

    // ---- Composite (moody: dark board, light is the subject) ----
    vec3 col = vec3(0.0);
    col += uPcb * (1.0 - solid) * 0.6;          // deep board tint in the gaps
    col += metal * 0.5;                          // faint legible circuit
    col += eCol * energy * 4.5;                  // glowing energy through wires
    col += eCol * star;                          // node sparkles

    // Strong vignette for mood
    vec2 centered = uv - 0.5;
    float vignette = 1.0 - dot(centered, centered) * 1.4;
    col *= max(vignette, 0.0);

    gl_FragColor = vec4(col, 1.0);
  }
`;
