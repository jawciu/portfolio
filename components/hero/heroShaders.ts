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
    // 7 discs in a row, each MASKED to its right-hand cap (same trick as the
    // orbs): the head shows almost a whole circle, the next few read as
    // semicircles, and the tail discs shrink to thin slivers. Spacing tightens
    // on the left so the front caps overlap into one body, and opens up on the
    // right so the slivers separate. Colour ramps orange -> coral -> pink ->
    // purple -> blue along the chain; a blue rim haloes every cap.
    {
      const int N = 7;
      vec2  head  = vec2(0.150, 0.195);
      float breathe = 1.0 + 0.030 * sin(uTime * 0.6);
      float wob = (fbm(P * 7.0 + uTime * 0.05) - 0.5);   // shared lumpy-edge wobble

      // pass 1: accumulate centre x positions (spacing depends on radii)
      float cx[N]; float cr[N];
      float xacc = 0.0, prevR = 0.0;
      for (int i = 0; i < N; i++){
        float t = float(i) / float(N-1);
        float r = mix(0.100, 0.084, t) * breathe;        // discs stay LARGE + tall; mask does the thinning
        if (i > 0) xacc += (prevR + r) * mix(0.46, 0.98, t); // overlap left, gap right
        prevR = r;
        cx[i] = head.x + xacc;
        cr[i] = r;
      }

      // pass 2: composite BACK (tail) -> FRONT (head) so the head sits on top
      for (int j = 0; j < N; j++){
        int   i = N - 1 - j;
        float t = float(i) / float(N-1);
        vec2  c = vec2(cx[i], head.y);
        c.y += 0.006 * sin(uTime*0.7 + float(i)*1.7);    // organic wobble
        float r = cr[i];
        float d = length(P - c) / r;                     // 0 centre -> 1 rim
        d += wob * mix(0.11, 0.03, t);                   // lumpy cloud edge (head cloudier)

        // mask: a straight vertical cut revealing only the right cap. Head cut sits
        // past the left rim (almost whole circle); the next discs thin into caps and
        // the tail into slivers. (The masked-circle trick, like the orbs.)
        float cut = c.x + r * mix(-1.10, 0.80, pow(t, 0.72));
        float vis = smoothstep(cut, cut + 0.012, P.x);

        vec3  base   = flameRamp(t);                      // already LINEAR -> stays saturated
        float bright = mix(1.18, 0.92, t);
        float body   = 1.0 - smoothstep(0.82, 1.05, d);  // solid cap, soft edge
        float glow   = exp(-d*d*1.9);                     // soft outer falloff

        // saturated body (front over back)
        col = mix(col, base * bright, clamp(body * vis, 0.0, 1.0));
        // outer halo ONLY (never re-light the centre -> no yellow/white blowout)
        col += base * bright * 0.40 * glow * (1.0 - body) * vis;
        // bright SATURATED blue leading rim riding the convex right edge (linear blue)
        float rim = smoothstep(0.74, 1.00, d) * (1.0 - smoothstep(1.00, 1.18, d));
        col += vec3(0.04, 0.12, 1.10) * rim * vis * mix(0.55, 1.20, t);
      }

      // magenta-pink halo ringing the head — sits OUTSIDE the orange core so it
      // doesn't redden it (a soft annulus around the body, not on top of it).
      {
        float hd = length(P - head);
        float ring = smoothstep(0.085, 0.16, hd) * smoothstep(0.26, 0.16, hd);
        col += vec3(0.22,0.02,0.12) * ring * 0.45;
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
