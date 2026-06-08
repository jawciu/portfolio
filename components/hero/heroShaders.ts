// Backdrop shader — near-black substrate + the FIREBALL (procedural 2D
// metaballs). Lives on a camera-facing plane behind the 3D orb/glass.
//
// Fireball = sibling of the orbs: ONE continuous, tightly-merged metaball comet
// rendered with the same soft watercolour melt. A warm ORANGE head (top-left)
// fades fast into a DEEP BLUE-PURPLE body of scalloped lobes that taper to a
// fine tip. Smaller than the orb row so it complements rather than competes.
// Gentle breathe + noise wobble keep it alive; no travelling-dot energy.
//
// Coordinate space: P = (uv.x * aspect, 1 - uv.y) -> origin top-left, y down,
// 1 unit == viewport height. Fireball head sits ~ (0.15, 0.20).

export const backdropVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const backdropFragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uMouse;     // 0..1 smoothed
  uniform vec3  uBg;
  uniform float uFade;      // 1 at top -> 0 as hero leaves

  varying vec2 vUv;

  float hash21(vec2 p){ p = fract(p*vec2(123.34,345.45)); p += dot(p,p+34.345); return fract(p.x*p.y); }
  float vnoise(vec2 p){
    vec2 i=floor(p), f=fract(p);
    float a=hash21(i), b=hash21(i+vec2(1,0)), c=hash21(i+vec2(0,1)), d=hash21(i+vec2(1,1));
    vec2 u=f*f*(3.0-2.0*f);
    return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
  }
  float fbm(vec2 p){ float s=0.0,a=0.5; for(int i=0;i<4;i++){ s+=a*vnoise(p); p*=2.02; a*=0.5; } return s; }

  // IQ cosine palette — warm->cool iridescence
  vec3 pal(float t){
    return vec3(0.5) + vec3(0.5)*cos(6.28318*(vec3(1.0)*t + vec3(0.00,0.33,0.67)));
  }

  // polynomial smooth-min — fuses two fields into one with a smooth neck (metaball)
  float smin(float a, float b, float k){
    float h = clamp(0.5 + 0.5*(b-a)/k, 0.0, 1.0);
    return mix(b, a, h) - k*h*(1.0-h);
  }

  // Firewall colour ramp (5 reference stops): orange -> coral -> pink -> purple ->
  // blue. Values are LINEAR (sRGB hex pre-converted) so the renderer's sRGB output
  // encoding lands exactly on the source hex instead of washing it out pale.
  vec3 flameRamp(float t){
    vec3 c0 = vec3(1.000, 0.246, 0.098); // #FF8858 orange
    vec3 c1 = vec3(0.913, 0.122, 0.136); // #F56267 coral
    vec3 c2 = vec3(0.784, 0.117, 0.956); // #E560FA pink
    vec3 c3 = vec3(0.191, 0.045, 0.823); // #793CEA purple
    vec3 c4 = vec3(0.021, 0.036, 0.392); // #2835A8 blue
    if (t < 0.25) return mix(c0, c1, smoothstep(0.00, 0.25, t));
    if (t < 0.50) return mix(c1, c2, smoothstep(0.25, 0.50, t));
    if (t < 0.75) return mix(c2, c3, smoothstep(0.50, 0.75, t));
    return mix(c3, c4, smoothstep(0.75, 1.00, t));
  }

  void main(){
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 par = (uMouse - 0.5) * 0.03;
    vec2 P = vec2(uv.x*aspect, 1.0 - uv.y) + vec2(par.x, -par.y);

    vec3 col = uBg;
    // faint warm bloom hugging the fireball head + cool fill bottom-right (mood)
    col += vec3(0.09,0.035,0.045) * smoothstep(0.7,0.0,length(P-vec2(0.20,0.20)));
    col += vec3(0.02,0.025,0.06) * smoothstep(1.1,0.0,length(P-vec2(1.4,0.85)));

    // ---- FIREWALL -------------------------------------------------------
    // Two parts driven by ONE reveal curve. (1) The HEAD: discs 0-2 as overlapping
    // MASKED circles — disc0 a full circle (the round nose), disc1 ~3/4, disc2 ~half —
    // drawn back-to-front so the nose sits on top; they overlap into one warm bulb.
    // (2) The CHAIN: discs 3-6 as masked caps (less than half), drawn left->right so the
    // right cap sits on top. A dark CREASE is then drawn at every section boundary (the
    // notches in the reference). Radii grow left->right; colour orange->...->blue.
    {
      const int N = 7;
      vec2  head  = vec2(0.150, 0.195);
      float breathe = 1.0 + 0.030 * sin(uTime * 0.6);
      float wob = (fbm(P * 7.0 + uTime * 0.05) - 0.5);   // shared lumpy-edge wobble

      // radii: stepped head (small nose -> medium -> big), then growing caps.
      float cx[N]; float cr[N];
      cr[0] = 0.056 * breathe;
      cr[1] = 0.080 * breathe;
      cr[2] = 0.104 * breathe;
      for (int i = 3; i < N; i++) cr[i] = mix(0.102, 0.140, float(i-3)/3.0) * breathe;
      // HEAD positions: overlap tuned so disc0 covers disc1's left ~1/4 (disc1 shows ~3/4)
      // and disc1 covers disc2's left ~1/2 (disc2 shows ~half). They then MERGE via smin.
      cx[0] = head.x;
      cx[1] = cx[0] + 0.70 * cr[0] + 0.50 * cr[1];       // nose overlaps disc1's 3/4 cut -> they touch
      cx[2] = cx[1] + 0.70 * cr[1];                      // disc1 overlaps disc2's half cut -> they touch
      // caps continue, opening out toward the tail.
      cx[3] = cx[2] + (cr[2] + cr[3]) * 0.52;
      cx[4] = cx[3] + (cr[3] + cr[4]) * 0.58;
      cx[5] = cx[4] + (cr[4] + cr[5]) * 0.66;
      cx[6] = cx[5] + (cr[5] + cr[6]) * 0.74;

      // (1) HEAD — each circle is a FULL circle MASKED to a partial with a STRAIGHT LEFT
      // edge (disc0 full, disc1 ~3/4, disc2 ~half), and they MERGE only where they TOUCH.
      // Implemented as signed-distance circles intersected with a left half-plane (the
      // straight cut), unioned with smin: away from the contact the left edge stays a
      // straight line; right at the contact with the smaller circle the smin fillets them
      // together (the merge). disc0 has no cut.
      {
        float HK = 0.046;                                  // merge fillet size at the contacts
        vec2  c0 = vec2(cx[0], head.y + 0.006*sin(uTime*0.7      ));
        vec2  c1 = vec2(cx[1], head.y + 0.006*sin(uTime*0.7 + 1.7));
        vec2  c2 = vec2(cx[2], head.y + 0.006*sin(uTime*0.7 + 3.4));
        float cut1 = c1.x - 0.50 * cr[1];                  // 3/4 visible (straight left edge)
        float cut2 = c2.x - 0.00 * cr[2];                  // half visible (straight left edge)
        float d0 = length(P - c0) - cr[0];                 // full circle
        float d1 = max(length(P - c1) - cr[1], cut1 - P.x);
        float d2 = max(length(P - c2) - cr[2], cut2 - P.x);
        float D  = smin(smin(d0, d1, HK), d2, HK);
        D += wob * 0.008;                                  // lumpy cloud edge

        // warm colour: orange core (deep inside) -> coral toward the rim.
        float hx    = clamp((P.x - head.x) / max(cx[2]-head.x, 0.001), 0.0, 1.0);
        float headT = hx * 0.24;
        vec3  hcore = flameRamp(headT);
        vec3  hedge = flameRamp(min(headT + 0.22, 1.0));
        float depth = clamp(-D / 0.09, 0.0, 1.0);
        vec3  base  = mix(hedge, hcore, smoothstep(0.0, 0.6, depth));

        float body = smoothstep(0.009, -0.014, D);         // soft melty edge
        float glow = exp(-pow(max(D, 0.0) / 0.050, 2.0));  // wide diffuse outer glow
        col = mix(col, base * 1.12, clamp(body, 0.0, 1.0));
        col += base * 1.12 * 0.46 * glow * (1.0 - body);
        float rim = exp(-pow((D + 0.010) / 0.012, 2.0));   // faint blue rim
        col += vec3(0.04, 0.12, 1.10) * rim * 0.24;
      }

      // (2) CAP CHAIN — discs 3..6 drawn LEFT->RIGHT so the RIGHT one is on top.
      for (int i = 3; i < N; i++){
        float t  = float(i) / float(N-1);                 // 0.5 .. 1.0
        float ct = (t - 0.5) / 0.5;                        // 0 at disc3 .. 1 at disc6
        vec2  c  = vec2(cx[i], head.y + 0.006*sin(uTime*0.7 + float(i)*1.7));
        float r  = cr[i];
        float d  = length(P - c) / r;
        d += wob * 0.04;

        // same reveal curve -> clearly less than half, thinning to a sliver.
        float cut = c.x + r * (-1.20 + 2.15 * pow(t, 0.62));
        float vis = smoothstep(cut, cut + 0.016, P.x);

        // colour: stretch the PURPLE band (pow ease) so the mid-chain stays magenta/
        // purple and blue only arrives at the very last sliver, instead of jumping early.
        float capColorT = 0.5 + 0.5 * pow(ct, 1.5);
        vec3  coreCol = flameRamp(capColorT);
        vec3  edgeCol = flameRamp(min(capColorT + 0.20, 1.0));
        vec3  base    = mix(coreCol, edgeCol, smoothstep(0.32, 1.08, d));

        // gentle lift on the purple stop, then a strong progressive DIM down the chain so
        // each cap is darker than the last and the final slivers fade into near-black.
        float bright = mix(1.34, 1.10, ct) + 0.22 * exp(-pow((capColorT - 0.75) / 0.14, 2.0));
        float tail   = mix(1.0, 0.18, smoothstep(0.18, 1.0, ct));
        float body   = 1.0 - smoothstep(0.52, 1.22, d);   // very soft, diffuse edge
        float glow   = exp(-d*d*0.95);

        col = mix(col, base * bright, clamp(body * vis * tail, 0.0, 1.0));
        col += base * bright * mix(0.60, 0.85, ct) * glow * (1.0 - body) * vis * tail;
        // blue leading rim on the convex right edge — dims down the chain with the body
        float rim = smoothstep(0.70, 1.02, d) * (1.0 - smoothstep(1.02, 1.26, d));
        col += vec3(0.04, 0.12, 1.10) * rim * vis * mix(0.85, 1.05, ct) * tail;
      }

      // (3) DARK CREASES — a soft notch at each CAP boundary (the notches in the
      // reference). The head lobes are left to MERGE smoothly (no crease there).
      for (int i = 3; i < N; i++){
        float t    = float(i) / float(N-1);
        float cut  = cx[i] + cr[i] * (-1.20 + 2.15 * pow(t, 0.62));
        float d    = length(P - vec2(cx[i], head.y)) / cr[i];
        float line = exp(-pow((P.x - cut) / 0.009, 2.0));     // thin shadow at the cut edge
        float span = 1.0 - smoothstep(0.74, 1.04, d);         // only across that disc's height
        col *= 1.0 - 0.38 * line * span;
      }

      // magenta-pink halo ringing the head — sits OUTSIDE the orange core so it
      // doesn't redden it (a soft annulus around the body, not on top of it).
      {
        float hd = length(P - head);
        float ring = smoothstep(0.095, 0.18, hd) * smoothstep(0.30, 0.18, hd);
        col += vec3(0.22,0.02,0.12) * ring * 0.28;
      }
      // broad deep-blue halo wrapping the whole chain (linear)
      float chainY = abs(P.y - head.y);
      float chainX = smoothstep(head.x-0.10, head.x+0.04, P.x)
                   * smoothstep(cx[N-1]+0.18, cx[N-1]-0.04, P.x);
      col += vec3(0.012,0.03,0.30) * chainX * smoothstep(0.16, 0.0, chainY) * 0.6;
    }

    // vignette + grain
    float r = length(uv-0.5);
    col *= 1.0 - r*r*0.7;
    float grain = hash21(uv*uResolution + fract(uTime)*91.3) - 0.5;
    col += grain * 0.022;

    col *= uFade;
    gl_FragColor = vec4(max(col,0.0), 1.0);
  }
`;
