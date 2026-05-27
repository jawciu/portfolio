// Vertex shader — fullscreen plane, passes UV through
export const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader — "a dead circuit board in a dark room, and you can see the
// electricity find its way home."
// Dark engraved Manhattan routing (long bundled runs + vias), nearly invisible
// unlit. Cyan-phosphor energy packets travel through the pipes; magenta is the
// rare high-voltage front. Mouse injects current that ripples out along wires.
export const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uMouse;
  uniform float uScroll;   // page scroll in viewport-heights

  uniform vec3 uBg;        // background base
  uniform vec3 uBgFloor;   // center lift
  uniform vec3 uPipe;      // unlit pipe floor (very dark)
  uniform vec3 uPipeEdge;  // engraved edge sheen
  uniform vec3 uGround;    // ground-fill regions
  uniform vec3 uCyan;      // energy core
  uniform vec3 uHot;       // white-hot peak
  uniform vec3 uMagenta;   // high-voltage front
  uniform vec3 uViolet;    // tone
  uniform vec3 uPink;      // tone

  varying vec2 vUv;

  float h11(float n) { return fract(sin(n * 127.1) * 43758.5453); }
  float h21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // Smooth value noise for uneven "ink" coverage
  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = h21(i), b = h21(i + vec2(1.0, 0.0));
    float c = h21(i + vec2(0.0, 1.0)), d = h21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // Travelling data packet along a 1D wire coordinate: sharp front, long
  // phosphor tail, irregular spacing/brightness, subtle AC flicker.
  float packet(float x, float t) {
    float SPACING = 2.3;
    float m = x - t * 2.2;
    float slot = floor(m / SPACING);
    float local = m / SPACING - slot;
    float present = step(0.55, h11(slot * 1.7));        // ~45% of slots carry a packet
    float center = 0.25 + 0.5 * h11(slot * 2.3 + 1.0);  // jittered position
    float d = local - center;
    float head = exp(-max(d, 0.0) * 16.0);              // sharp leading edge
    float tail = exp(-max(-d, 0.0) * 4.0);              // long trailing afterglow
    float pk = present * max(head, tail * 0.85);
    pk *= 0.85 + 0.15 * sin(t * 40.0 + slot);           // vintage AC buzz
    return pk;
  }

  // Wrap-safe ripple band for mouse-driven outward pulses
  float band(float x) {
    float f = fract(x);
    float d = min(f, 1.0 - f);
    return exp(-d * d * 60.0);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;

    float SCALE = 44.0;
    vec2 par = (uMouse - 0.5) * 1.5;   // circuit (near layer) mouse parallax, q-space
    float so = uScroll * 0.3;          // scroll parallax: circuit drifts at 30% of page
    vec2 q = vec2(uv.x * aspect, uv.y - so) * SCALE + par;

    // Nearest horizontal lane (row) and vertical lane (col)
    float row = floor(q.y + 0.5);
    float col = floor(q.x + 0.5);
    float dH = abs(q.y - row);
    float dV = abs(q.x - col);
    float cx = floor(q.x);
    float cy = floor(q.y);

    // Two-level presence → some rows/cols are wired (long bundled runs), with
    // gaps along them; the rest is quiet negative space.
    float rowWired = step(0.32, h21(vec2(row * 0.123, 7.7)));
    float colWired = step(0.32, h21(vec2(13.3, col * 0.123)));
    // Radial cluster: dense knot at the cluster centre (right side), with traces
    // finishing and fewer continuing the further out from the centre you go.
    vec2 cc = vec2(0.70, 0.46);
    vec2 dc = (uv - cc);
    dc.x *= aspect;
    float distC = length(dc);
    float dens = mix(0.05, 1.05, smoothstep(0.04, 0.60, distC));
    // A fraction of lanes are "runners" that persist all the way to the edges
    float runnerH = step(0.80, h21(vec2(row * 0.07, 3.3)));
    float runnerV = step(0.80, h21(vec2(7.1, col * 0.07)));
    float densH = mix(dens, min(dens, 0.5), runnerH);
    float densV = mix(dens, min(dens, 0.5), runnerV);
    float hPresent = rowWired * step(densH, h21(vec2(cx, row) + 11.0));
    float vPresent = colWired * step(densV, h21(vec2(col, cy) + 23.0));

    float width = 0.095;

    // Per-lane character: some lines thicker, some thinner, some bleed wider
    float wH = width * (0.55 + 1.1 * h21(vec2(row, 4.4)));
    float wV = width * (0.55 + 1.1 * h21(vec2(col, 5.5)));
    float bleedH = h21(vec2(row, 9.1));
    float bleedV = h21(vec2(col, 9.7));
    // Gentle thickness wobble along the length
    wH *= 0.85 + 0.30 * sin(q.x * 0.6 + row * 1.7);
    wV *= 0.85 + 0.30 * sin(q.y * 0.6 + col * 1.7);

    // Core coverage + a wider soft halo for bleedy lines (dots scatter outward)
    float coreH = hPresent * smoothstep(wH * 2.0, 0.0, dH);
    float coreV = vPresent * smoothstep(wV * 2.0, 0.0, dV);
    float haloH = hPresent * smoothstep(wH * 10.0, 0.0, dH) * bleedH * 0.9;
    float haloV = vPresent * smoothstep(wV * 10.0, 0.0, dV) * bleedV * 0.9;
    float fH = max(coreH, haloH);
    float fV = max(coreV, haloV);
    float field = max(fH, fV);

    // Uneven ink coverage (two scales) — screen-print mottle
    float ink = 0.45 + 0.55 * vnoise(uv * vec2(7.0, 6.0) + 3.0);
    ink *= 0.7 + 0.3 * vnoise(uv * vec2(23.0, 21.0));
    field *= 0.55 + 0.7 * ink;

    // Chunky, feathered stipple → soft riso dots that bleed in and out.
    vec2 px = uv * uResolution;
    float DOT = 2.6;
    vec2 dcell = floor(px / DOT);
    vec2 inCell = fract(px / DOT) - 0.5;
    vec2 jit = vec2(h21(dcell + 1.3), h21(dcell + 2.7)) - 0.5;
    float dotR = length(inCell - jit * 1.0);
    float dotShape = smoothstep(0.72, 0.0, dotR);
    float thresh = h21(dcell + 5.1);
    float stipple = smoothstep(thresh - 0.28, thresh + 0.28, field) * dotShape;

    // Dotted, brightness-graded masks used everywhere downstream
    float hMask = stipple * fH;
    float vMask = stipple * fV;
    float trace = stipple * field;

    // Via where an active horizontal and active vertical cross
    float rowWiredAtCross = step(0.32, h21(vec2(row * 0.123, 7.7)));
    float colWiredAtCross = step(0.32, h21(vec2(13.3, col * 0.123)));
    float hAtCross = rowWiredAtCross * step(dens, h21(vec2(col, row) + 11.0));
    float vAtCross = colWiredAtCross * step(dens, h21(vec2(col, row) + 23.0));
    float viaHere = hAtCross * vAtCross;
    float dVia = length(q - vec2(col, row));
    float via = viaHere * smoothstep(0.20, 0.11, dVia) * (0.15 + 0.85 * stipple);

    // Nearest trace distance (for engraved edge sheen)
    float dTrace = 1e9;
    if (hPresent > 0.5) dTrace = min(dTrace, dH);
    if (vPresent > 0.5) dTrace = min(dTrace, dV);

    // ---- Energy ----
    // Faint constant hum so the routing stays just-alive
    float base = trace * 0.03;

    // ONE circuit at a time: each PERIOD, pick a single row OR column and send
    // a single pulse sweeping its full length, then jump to another wire.
    float PERIOD = 2.2;
    float tick = floor(uTime / PERIOD);
    float prog = fract(uTime / PERIOD);
    float axisIsH = step(0.5, h21(vec2(tick, 2.3)));
    float activeRow = floor(h21(vec2(tick, 3.1)) * (SCALE + 1.0));
    float activeCol = floor(h21(vec2(tick, 4.7)) * (SCALE * aspect + 1.0));
    float dirSign = step(0.5, h21(vec2(tick, 5.5))) * 2.0 - 1.0;

    float along = (axisIsH > 0.5) ? uv.x : uv.y;
    float headPos = (dirSign > 0.0) ? prog : 1.0 - prog;
    float d = along - headPos;
    float headLight = exp(-max(d * dirSign, 0.0) * 40.0);   // sharp leading edge
    float tailLight = exp(-max(-d * dirSign, 0.0) * 8.0);   // long phosphor tail
    float pulse = max(headLight, tailLight * 0.8);
    float onLane = (axisIsH > 0.5)
      ? (step(abs(row - activeRow), 0.5) * hMask)
      : (step(abs(col - activeCol), 0.5) * vMask);
    float sweep = pulse * onLane;

    // Mouse: random little sparkles on the trace dots near the cursor (no rings)
    vec2 mq = vec2(uMouse.x * aspect, uMouse.y - so) * SCALE + par;
    float dM = length(q - mq);
    float mReach = exp(-dM * dM * 0.12);
    float mSpark = step(0.62, h21(dcell + floor(uTime * 7.0)));
    float mouseE = mReach * (0.25 + 1.2 * mSpark) * trace;

    float lineEnergy = base + sweep + mouseE * 1.3;

    // Sparkle: vias flash only when current passes, ~50% of the time
    float twinkle = step(0.5, h21(vec2(col, row) + floor(uTime * 2.0)));
    float viaEnergy = via * (0.25 + (sweep + mouseE) * 2.6) * (0.5 + 0.5 * twinkle);

    // ---- Colour ----
    // Lines lean turquoise, circles lean pink; both drift and cross-blend
    // slowly over time and across space — never an abrupt switch.
    float ph = uTime * 0.10;
    float wLine = 0.5 + 0.5 * sin(ph + uv.x * 2.2 + uv.y * 1.3);
    float wCirc = 0.5 + 0.5 * sin(ph + 3.14159 + uv.x * 1.7 - uv.y * 0.9);
    vec3 lineCol = mix(uCyan, uPink, wLine * 0.55);
    vec3 circCol = mix(uPink, uCyan, wCirc * 0.55);

    vec3 light = lineCol * lineEnergy + circCol * viaEnergy;
    light = mix(light, uHot, clamp((lineEnergy + viaEnergy) * 0.4, 0.0, 0.6)); // white-hot peaks

    // ---- Substrate ----
    // Background (far layer) drifts with the mouse at its own slower rate, so it
    // parallaxes against the circuit instead of sitting still.
    vec2 bgPar = (uMouse - 0.5) * 0.012;
    float r = length((uv - vec2(0.5)) + bgPar);
    vec3 outCol = mix(uBgFloor, uBg, smoothstep(0.0, 0.95, r));

    // Engraved pipe: dark floor + faint edge sheen
    vec3 pipe = uPipe;
    pipe += uPipeEdge * smoothstep(width * 0.55, width, dTrace) * 0.7;
    outCol = mix(outCol, pipe, trace);

    // Quiet ground-fill regions in the negative space
    float fillR = step(0.62, h21(floor(q * 0.22) + 3.0));
    outCol += uGround * fillR * (1.0 - trace) * 0.6;

    // ---- Data-stream layer (vintage code-printout) ----
    // Rows of "character" dots that cluster into dense blocks and empty areas
    // (slowly contracting), with occasional horizontal smear — like melted
    // printed numbers transforming into stripes. Lives in the negative space.
    float region = vnoise(uv * vec2(2.5, 3.5) - uTime * 0.04);     // breathing full/empty
    float regionMask = smoothstep(0.5, 0.8, region);
    float smearBand = step(0.7, vnoise(vec2(uv.y * 9.0, uTime * 0.12)));
    float smear = mix(1.0, 6.0, smearBand);                        // stretch some rows sideways
    vec2 cpx = px / vec2(5.5 * smear, 9.0);                        // character grid (bigger than grain)
    vec2 ccell = floor(cpx);
    vec2 cin = fract(cpx) - 0.5;
    float rowDens = 0.35 + 0.45 * h21(vec2(ccell.y * 0.13, 5.0));  // some rows fuller than others
    float charOn = step(1.0 - rowDens, h21(ccell + 41.0));
    float cdot = smoothstep(0.5, 0.12, length(cin));
    float data = charOn * cdot * regionMask * (1.0 - trace) * 0.55;
    vec3 dataCol = mix(uPink, uCyan, step(0.8, h21(vec2(ccell.y, 9.0))));
    outCol += dataCol * data;

    // Living light on top
    outCol += light * 4.0;

    // Vignette + subtle phosphor flicker
    outCol *= 1.0 - r * r * 0.7;
    outCol *= 0.97 + 0.03 * h11(floor(uTime * 30.0));

    // Light film grain on top (the stipple already carries most of the texture)
    float grain = h21(uv * uResolution + fract(uTime) * 97.1) - 0.5;
    outCol += grain * 0.03;

    gl_FragColor = vec4(outCol, 1.0);
  }
`;
