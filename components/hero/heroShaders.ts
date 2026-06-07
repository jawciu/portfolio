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

  void main(){
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 par = (uMouse - 0.5) * 0.03;
    vec2 P = vec2(uv.x*aspect, 1.0 - uv.y) + vec2(par.x, -par.y);

    vec3 col = uBg;
    // faint warm bloom hugging the fireball head + cool fill bottom-right (mood)
    col += vec3(0.09,0.035,0.045) * smoothstep(0.7,0.0,length(P-vec2(0.20,0.20)));
    col += vec3(0.02,0.025,0.06) * smoothstep(1.1,0.0,length(P-vec2(1.4,0.85)));

    // ---- FIREBALL -------------------------------------------------------
    // 7 anchor lobes packed TIGHT (centre spacing well under 2r) under a wide
    // gaussian + low iso-floor, so the metaball field fuses them into one
    // continuous scalloped comet (no separate dots). Colour is driven by the
    // along-chain parameter: warm orange head -> magenta bridge -> deep
    // blue-purple body. Gentle breathe + wobble; the head stays brightest.
    {
      float field = 0.0, alongAccum = 0.0, wsum = 0.0;
      vec2  head  = vec2(0.150, 0.200);
      const int N = 7;
      float breathe = 1.0 + 0.035 * sin(uTime * 0.6);
      float x = 0.0, prevR = 0.0;
      for (int i = 0; i < N; i++){
        float fi = float(i);
        float t  = fi / float(N-1);               // 0 head -> 1 tip
        float r  = mix(0.074, 0.030, t) * breathe;// orange head -> soft tapered tip (no bead)
        if (i > 0) x += (prevR + r) * 0.54;       // TIGHT packing -> necks fully fuse
        prevR = r;
        vec2 c = head + vec2(x, 0.0);
        c.y += 0.006 * sin(uTime*0.8 + fi*1.7);   // organic wobble (keeps it alive)
        c.x += 0.004 * sin(uTime*0.6 + fi*2.1);
        float dd = length(P - c) / r;
        float g  = exp(-dd*dd*1.7);               // WIDE gaussian -> soft melt, fills necks
        field += g;
        alongAccum += g*t; wsum += g;
      }

      // dither the iso-test input -> breaks contour banding on the additive lift
      field += (hash21(P*uResolution) - 0.5) * 0.015;
      float body  = smoothstep(0.24, 1.05, field);// LOW floor -> inter-lobe minima stay inside
      float aCh   = (wsum>0.0)? alongAccum/wsum : 0.0;  // 0 head -> 1 tail

      // palette: warm head fades FAST into a deep blue-purple (indigo) body
      float warm  = smoothstep(0.26, 0.0, aCh);   // 1 at head, gone by aCh~0.26
      vec3  hot   = vec3(1.00, 0.50, 0.24);       // warm orange head
      vec3  deep  = mix(vec3(0.50,0.30,1.02),     // vivid blue-purple -> deep indigo at the tip
                        vec3(0.30,0.16,0.82), aCh);
      vec3  fcol  = mix(deep, hot, warm);
      // magenta iridescent bridge — widened so it carries through the mid dead-zone
      float bridge = smoothstep(0.08,0.24,aCh) * smoothstep(0.62,0.30,aCh);
      fcol = mix(fcol, vec3(0.86,0.30,0.66), bridge*0.7);
      // hot core only in the dense head
      float core = smoothstep(1.05,1.7,field) * warm;
      fcol = mix(fcol, vec3(1.0,0.72,0.46), core*0.55);

      col += fcol * body * 2.05 * (1.0 - 0.32*aCh); // tail dimmer
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
