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
    vec2 par = (uMouse - 0.5) * 0.6;   // parallax in q-space; cancels in mouse dist
    vec2 q = vec2(uv.x * aspect, uv.y) * SCALE + par;

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
    // Soft coverage fields: brightest along the centreline, dissolving outward
    float fH = hPresent * smoothstep(width * 2.0, 0.0, dH);
    float fV = vPresent * smoothstep(width * 2.0, 0.0, dV);
    float field = max(fH, fV);

    // Irregular stipple — jittered round dots, lit when the coverage field
    // beats a per-dot random threshold. Dense/bright at the centre, sparse and
    // dark toward the edges, then black. This is what makes the circuit grainy.
    vec2 px = uv * uResolution;
    float DOT = 3.2;
    vec2 dcell = floor(px / DOT);
    vec2 inCell = fract(px / DOT) - 0.5;
    vec2 jit = vec2(h21(dcell + 1.3), h21(dcell + 2.7)) - 0.5;
    float dotR = length(inCell - jit * 0.7);
    float dotShape = smoothstep(0.55, 0.12, dotR);
    float thresh = h21(dcell + 5.1);
    float stipple = step(thresh, field) * dotShape;

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
    float via = viaHere * smoothstep(0.20, 0.11, dVia) * (0.6 + 0.4 * stipple);

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

    // Mouse current injection (parallax cancels → glued to cursor)
    vec2 mq = vec2(uMouse.x * aspect, uMouse.y) * SCALE + par;
    float dM = length(q - mq);
    float pool = exp(-dM * dM * 0.375);
    float ripple = band(dM * 1.65 - uTime * 2.0) * exp(-dM * 0.45);
    float mouseE = (pool * 0.8 + ripple * 1.5) * trace;

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
    float r = length(uv - vec2(0.5));
    vec3 outCol = mix(uBgFloor, uBg, smoothstep(0.0, 0.95, r));

    // Engraved pipe: dark floor + faint edge sheen
    vec3 pipe = uPipe;
    pipe += uPipeEdge * smoothstep(width * 0.55, width, dTrace) * 0.7;
    outCol = mix(outCol, pipe, trace);

    // Quiet ground-fill regions in the negative space
    float fillR = step(0.62, h21(floor(q * 0.22) + 3.0));
    outCol += uGround * fillR * (1.0 - trace) * 0.6;

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
