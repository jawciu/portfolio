// Backdrop shader — near-black substrate + the FLAME CHAIN (procedural 2D
// metaballs). Lives on a camera-facing plane behind the 3D orb/glass.
//
// Flame chain behaviour (agreed spec): blobs are BORN at the warm head (left),
// TRAVEL right, SHRINK + COOL (warm -> violet -> blue), MERGE/SPLIT via metaball
// necks, and DISSOLVE at the tip. Idle breathe + noise wobble; head pulses
// brightest. Everything organic (noise-driven) so it never reads mechanical.
//
// Coordinate space: P = (uv.x * aspect, 1 - uv.y) -> origin top-left, y down,
// 1 unit == viewport height. Flame head sits ~ (0.18, 0.22).

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
    // faint warm bloom top-left + cool fill bottom-right (mockup mood)
    col += vec3(0.10,0.04,0.05) * smoothstep(0.9,0.0,length(P-vec2(0.25,0.22)));
    col += vec3(0.02,0.03,0.06) * smoothstep(1.1,0.0,length(P-vec2(1.4,0.85)));

    // ---- FLAME CHAIN ----------------------------------------------------
    // 6 FIXED anchor lobes define the scalloped silhouette (big coral head ->
    // small blue tip; centre spacing < 2r so neighbours neck but don't fuse).
    // A travelling brightness pulse rides head->tip for the born/travel/dissolve
    // feel, plus gentle wobble/breathe so it never reads mechanical.
    {
      float field = 0.0, hueAccum = 0.0, wsum = 0.0;
      vec2  head  = vec2(0.155, 0.215);
      const int N = 6;
      float pulse = fract(uTime * 0.18);          // brightness bump rides head->tip
      float x = 0.0, prevR = 0.0;
      for (int i = 0; i < N; i++){
        float fi = float(i);
        float t  = fi / float(N-1);               // 0 head -> 1 tip
        float r  = mix(0.095, 0.028, t);          // big coral head -> small tip
        if (i > 0) x += (prevR + r) * 0.80;       // center spacing < 2r -> scallop necks
        prevR = r;
        vec2 c = head + vec2(x, 0.0);
        c.y += 0.010 * sin(uTime*0.9 + fi*1.6);   // organic wobble (keeps it alive)
        c.x += 0.005 * sin(uTime*0.7 + fi*2.3);
        r   *= 1.0 + 0.05 * sin(uTime*1.3 + fi*2.0);  // breathe
        float dd = length(P - c) / r;
        float g  = exp(-dd*dd*2.6);               // TIGHTER gaussian -> rounder, isolated
        float ride = exp(-pow((t - pulse)*3.5, 2.0)); // travelling pulse
        g *= 0.65 + 0.7*ride;
        field += g;
        hueAccum += g*t; wsum += g;
      }

      float flame = smoothstep(0.50, 1.0, field); // HIGH floor -> distinct lobes
      float tHue  = (wsum>0.0)? hueAccum/wsum : 0.0;
      vec3 hot  = vec3(1.00, 0.45, 0.28);         // coral head
      vec3 mid  = vec3(0.96, 0.18, 0.74);         // magenta
      vec3 cool = vec3(0.32, 0.45, 1.00);         // blue tip
      vec3 fcol = (tHue < 0.5) ? mix(hot, mid, tHue*2.0)
                               : mix(mid, cool, (tHue-0.5)*2.0);
      // warm hot core ONLY near the head (gate by 1-tHue so tail stays blue)
      fcol = mix(fcol, vec3(1.0,0.62,0.42), smoothstep(0.9,1.3,field)*0.5*(1.0-tHue));
      col += fcol * flame * 2.6 * (1.0 - 0.30*tHue);  // tail dimmer
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
