---
name: portfolio-architecture
description: Next.js 15 App Router project structure for this designer portfolio — routes, MDX case studies, metadata/SEO/OG images, asset organization, providers for smooth scroll and analytics, typography setup, dark-theme tokens. Use when scaffolding the project, adding a new case study, configuring SEO metadata, organizing components and assets, or making structural decisions about the site.
license: Proprietary
metadata:
  project: portfolio
  framework: nextjs-15-app-router
---

# Portfolio Architecture — Next.js 15 App Router for a designer

Reference stack: Next.js 15 + React 19 + TypeScript + Tailwind 4 + MDX for case studies + R3F for hero scenes. Deploy on Vercel.

## Directory layout

```
portfolio/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx                  # home / hero
│   │   ├── about/page.tsx
│   │   └── contact/page.tsx
│   ├── work/
│   │   ├── page.tsx                  # case-study index
│   │   └── [slug]/page.tsx           # individual case study (renders MDX)
│   ├── api/
│   │   └── og/route.tsx              # dynamic OG image generation
│   ├── layout.tsx                    # root layout: fonts, providers, <html>
│   ├── providers.tsx                 # client providers: SmoothScroll, analytics
│   ├── globals.css                   # Tailwind + CSS vars + font-face
│   └── opengraph-image.tsx           # default OG image
├── components/
│   ├── ui/                           # buttons, links, layout primitives
│   ├── hero/                         # R3F hero scene (see r3f-hero-scene skill)
│   ├── case-study/                   # MDX components (Image, Quote, Carousel)
│   └── nav/
├── content/
│   └── work/
│       ├── project-one.mdx
│       └── project-two.mdx
├── lib/
│   ├── mdx.ts                        # MDX loader + frontmatter parsing
│   ├── projects.ts                   # typed project list helpers
│   └── useGPUTier.ts
├── public/
│   ├── fonts/                        # variable font files
│   ├── models/                       # optimized .glb assets
│   ├── hdri/                         # environment maps
│   └── images/
├── shaders/
│   └── lib/lygia/                    # vendored shader snippets
├── research/                         # tech-stack-recommendation.md and other research
├── .claude/skills/                   # the skills you're reading
├── next.config.mjs
├── tailwind.config.ts
└── package.json
```

## Root layout pattern

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://carolinejaworsky.com'),  // confirm domain
  title: { default: 'Caroline Jaworsky — Product Designer', template: '%s — Caroline Jaworsky' },
  description: 'Product designer working on consumer apps and B2B SaaS.',
  openGraph: {
    type: 'website',
    siteName: 'Caroline Jaworsky',
    images: ['/opengraph-image'],
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#050507] text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

## Providers

```tsx
// app/providers.tsx
'use client'
import { SmoothScroll } from '@/components/SmoothScroll'

export function Providers({ children }: { children: React.ReactNode }) {
  return <SmoothScroll>{children}</SmoothScroll>
}
```

Keep providers minimal — every wrapper here ships to every page.

## Case-study MDX pipeline

Use **next-mdx-remote** (simpler than Contentlayer for v15+; Contentlayer is currently unmaintained).

```ts
// lib/mdx.ts
import { compileMDX } from 'next-mdx-remote/rsc'
import fs from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod'

const FrontmatterSchema = z.object({
  title: z.string(),
  client: z.string().optional(),
  year: z.string(),
  role: z.string(),
  summary: z.string(),
  cover: z.string(),
  tags: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
})

export type ProjectFrontmatter = z.infer<typeof FrontmatterSchema>

export async function getProject(slug: string) {
  const source = await fs.readFile(
    path.join(process.cwd(), 'content/work', `${slug}.mdx`),
    'utf8'
  )
  const { content, frontmatter } = await compileMDX<ProjectFrontmatter>({
    source,
    options: { parseFrontmatter: true },
    components: mdxComponents,
  })
  FrontmatterSchema.parse(frontmatter)
  return { content, frontmatter, slug }
}

export async function getAllProjects() {
  const files = await fs.readdir(path.join(process.cwd(), 'content/work'))
  return Promise.all(
    files
      .filter((f) => f.endsWith('.mdx'))
      .map((f) => getProject(f.replace(/\.mdx$/, '')))
  )
}
```

MDX components (lib/mdx-components.tsx) provide rich primitives for case studies — `<Image>` with blur placeholder, `<Quote>`, `<Carousel>`, `<Video>`, `<TwoColumn>`, `<Aside>`, `<Embed>`.

## Per-page metadata (case study)

```tsx
// app/work/[slug]/page.tsx
import { getProject } from '@/lib/mdx'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { frontmatter } = await getProject(params.slug)
  return {
    title: frontmatter.title,
    description: frontmatter.summary,
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.summary,
      images: [`/api/og?title=${encodeURIComponent(frontmatter.title)}&client=${encodeURIComponent(frontmatter.client ?? '')}`],
    },
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { content, frontmatter } = await getProject(params.slug)
  return (
    <article>
      <CaseStudyHeader {...frontmatter} />
      {content}
    </article>
  )
}
```

## Dynamic OG images

Use Next's built-in `ImageResponse` for per-project OG images (huge for LinkedIn/Twitter shares when recruiters share your work):

```tsx
// app/api/og/route.tsx
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') ?? 'Caroline Jaworsky'
  const client = searchParams.get('client') ?? ''

  return new ImageResponse(
    (
      <div style={{
        background: '#050507', color: 'white', width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: 80, fontFamily: 'Inter',
      }}>
        <div style={{ fontSize: 24, opacity: 0.6 }}>{client}</div>
        <div style={{ fontSize: 80, fontWeight: 700, lineHeight: 1.05, marginTop: 16 }}>{title}</div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
```

## Typography

Use `next/font` with variable fonts. For the moody aesthetic, pair a strong display face with a clean grotesk:
- **Display:** Bricolage Grotesque, PP Editorial Old, GT Walsheim, or Migra (paid)
- **Body:** Inter, Geist, or PP Neue Montreal

```tsx
// app/fonts.ts
import { Bricolage_Grotesque, Geist } from 'next/font/google'

export const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display', display: 'swap' })
export const body = Geist({ subsets: ['latin'], variable: '--font-body', display: 'swap' })
```

Use `font-display: optional` if you're animating with SplitText to avoid the FOIT/FOUT reflow problem.

## Theme tokens (Tailwind 4 + CSS vars)

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-bg: #050507;
  --color-bg-elev: #0a0a0d;
  --color-fg: #f5f5f5;
  --color-fg-muted: #8a8a92;
  --color-accent-cyan: #00d4ff;
  --color-accent-magenta: #ff006e;
  --font-display: var(--font-display);
  --font-body: var(--font-body);
}

html, body {
  background: var(--color-bg);
  color: var(--color-fg);
  scroll-behavior: auto;   /* Lenis takes over */
}

::selection { background: var(--color-accent-cyan); color: var(--color-bg); }
```

Keep the accent palette tight (2-3 colors) — the holographic shaders will introduce all the chromatic variety naturally.

## next.config.mjs essentials

```js
import { withMDX } from '@next/mdx'

export default withMDX({
  pageExtensions: ['ts', 'tsx', 'mdx'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: ['raw-loader', 'glslify-loader'],
    })
    return config
  },
})
```

## Asset organization

- `public/models/` — optimized `.glb` files (run through `gltf-transform` first)
- `public/hdri/` — environment maps (`.hdr`, `.exr`, or pre-baked equirectangular `.jpg`)
- `public/images/` — Next-optimized images; subdivide by feature (`/hero`, `/work/[slug]`)
- `public/fonts/` — only if self-hosting; prefer `next/font` from Google or Bunny.net
- `shaders/lib/lygia/` — vendor only the LYGIA folders you use (don't pull the whole tree)

## Performance budget

- LCP < 2.5s — hero poster image (static) is the LCP; canvas mounts after
- Total JS < 200kb gzipped for first paint
- Three.js + R3F + drei + postprocessing → ~250kb gzipped, but lazy-loaded behind `dynamic({ ssr: false })`
- One Lighthouse pass per major change

## SEO checklist for case studies

- Unique `title` per page (template handles suffix)
- Unique `description` 140-160 chars
- Per-project OG image via `/api/og`
- Schema.org `CreativeWork` JSON-LD if you want extra polish
- Internal links between related projects (good for crawl + UX)

## Don't

- Don't put the hero R3F in a server component or import it eagerly.
- Don't fetch project data in client components — `getProject` runs in RSC; pass MDX as children.
- Don't write giant CSS files. Tailwind utility classes + the small token file above.
- Don't ship Contentlayer — it's stale. Use `next-mdx-remote` or `velite`.
- Don't create case-study routes manually for each — generate them statically via `generateStaticParams`:
  ```tsx
  export async function generateStaticParams() {
    const projects = await getAllProjects()
    return projects.map((p) => ({ slug: p.slug }))
  }
  ```
