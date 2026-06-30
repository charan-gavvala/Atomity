# Tech Stack

## Core Framework
**Next.js 14+ (App Router)**
- Used for: routing, server components, built-in TypeScript, Vercel deployment
- Why not Vite/CRA: Next.js deploys to Vercel in one click, App Router gives built-in fetch caching as a fallback option
- Config: `--app --typescript --tailwind --no-eslint`

## Language
**TypeScript**
- Strict mode enabled
- All props, hook return types, and API shapes are typed
- No `any` usage

## Animation
**Framer Motion**
- Used for: scroll-triggered entrance, staggered reveals, count-up triggers, hover states, spring physics
- Why not GSAP: Framer Motion integrates natively with React and is the preferred library per the brief
- Key APIs used:
  - `motion.div` with `whileInView` for scroll triggers
  - `useInView` for count-up number trigger
  - `useReducedMotion` for accessibility
  - `animate` with repeat for pulse rings
  - `initial / whileInView / transition` pattern throughout

## Styling
**Tailwind CSS + Custom CSS**
- Tailwind: utility classes for layout, spacing, flex/grid
- Custom CSS in `globals.css`: design tokens (CSS variables), component-specific styles, modern CSS features
- Why both: Tailwind handles layout fast, custom CSS handles token architecture and modern CSS features that Tailwind can't express (container queries, color-mix, nesting)

## Modern CSS Features Used

| Feature | Where Used |
|---------|-----------|
| CSS custom properties (variables) | All color/spacing tokens |
| `clamp()` | Section title font-size, panel padding |
| `@container` | MetricsPanel bar heights respond to panel container width |
| `:has()` | Parent grid dims siblings when a node is hovered |
| `color-mix()` | Pulse ring color derived from provider color |
| CSS nesting (native) | `.bar-fill` nested inside `.bar-track` |
| Logical properties | `margin-inline`, `padding-block`, `inline-size` |

## State & Data
- **Fetch API** — native, no axios needed
- **sessionStorage** — manual cache with 5-minute TTL
- **useState + useEffect + useRef** — local state management
- No Redux, no Zustand, no React Query (manual cache demonstrates understanding without dependency overhead)

## Deployment
- **Vercel** — GitHub integration, auto-deploy on push
- Zero config needed for Next.js on Vercel

## Dev Tools
- **Node.js 18+**
- **npm** (lockfile committed)
- **Git** with incremental commits

---

## What Was Deliberately NOT Used

| Skipped | Reason |
|---------|--------|
| MUI / Chakra / shadcn | Explicitly banned by brief |
| React Query / SWR | Manual cache was sufficient and shows deeper understanding |
| GSAP | Framer Motion preferred per brief |
| Sass / Less | Native CSS nesting makes preprocessors unnecessary |
| Axios | Native fetch is sufficient |
| Redux / Zustand | No global state needed |
| Chart.js / Recharts | Custom SVG bars demonstrate component-building skill |

---

## Package.json Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "framer-motion": "^11.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "@types/react": "^18.x",
    "@types/node": "^20.x",
    "tailwindcss": "^3.x",
    "postcss": "^8.x",
    "autoprefixer": "^10.x"
  }
}
```
