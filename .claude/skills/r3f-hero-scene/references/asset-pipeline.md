# 3D Asset Pipeline

For all glTF/GLB assets used in the portfolio.

## Tooling

Install once globally:
```bash
npm install -g @gltf-transform/cli
```

## Standard optimize step

```bash
gltf-transform optimize input.glb output.glb \
  --texture-compress webp \
  --simplify-error 0.001
```

This chains: weld → simplify → quantize → Draco → texture compression.

## For textures specifically (KTX2)

```bash
gltf-transform uastc output.glb output.ktx2.glb \
  --level 4 \
  --rdo 4 \
  --zstd 22
```

KTX2/Basis textures stay GPU-compressed at runtime (~10× VRAM savings vs PNG/JPEG decoded to RGBA8). Worth it for any texture used in the hero.

## Loading in R3F

```tsx
import { useGLTF } from '@react-three/drei'
import { DRACOLoader, KTX2Loader } from 'three-stdlib'

useGLTF.preload('/models/cpu.glb')

// Drei auto-wires Draco if the decoder path is set:
// In your app root once:
useGLTF.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
```

For KTX2 you need to register the loader manually with the renderer:
```tsx
const ktx2Loader = new KTX2Loader().setTranscoderPath('/basis/').detectSupport(gl)
useGLTF('/models/cpu.glb', undefined, (loader) => {
  loader.setKTX2Loader(ktx2Loader)
})
```

## Polycount budget

- Hero centerpiece: <50k triangles
- Background props: <10k triangles each
- Total scene budget: <250k triangles for 60fps on mid-tier mobile
- Use `InstancedMesh` for anything repeated >4×

## Textures budget

- Hero hero asset: 2K max per channel (albedo, normal, roughness)
- Backgrounds: 1K
- Always KTX2 for anything >512px
