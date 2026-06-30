# Atomity Challenge

**Live Demo:** [https://atomity-challenge-hjx9copow-charan-gavvalas-projects.vercel.app](https://atomity-challenge-hjx9copow-charan-gavvalas-projects.vercel.app)

A multi-cloud infrastructure dashboard built for the Atomity frontend engineering challenge.

---

## Feature Chosen

I went with **Option B — the topology visualiser**. The brief asked for a node map with provider cards connected to a central panel, and I used that as a jumping-off point rather than just following it literally.

The creative interpretation: the four cloud provider nodes sit at the corners of a CSS Grid, connected by animated SVG gradient lines that pulse with moving data-packet dots. The center panel isn't just a label — it's a live resource intelligence card with a KPI row and an animated bar chart. The whole thing reads like an actual infrastructure monitor, not a static mockup.

The design language is deliberately muted and dark-mode-first — infrastructure dashboards live on ops screens, not marketing pages, so I leaned into that.

---

## Animation Approach

Everything is layered to feel like the UI is *loading in*, not just appearing.

- **Scroll triggers** — Framer Motion's `whileInView` with `viewport={{ once: true }}` on every major block. Nothing re-triggers on scroll-back.
- **Stagger timing** — Provider nodes entrance delays are offset by 50ms per node (`[0.1, 0.15, 0.2, 0.25]`). The stat strip below fades in last at `delay: 0.4`.
- **Spring hover** — The provider node cards use `whileHover={{ scale: 1.06 }}` with `spring { stiffness: 300, damping: 20 }`. This gives a snappy but organic bounce instead of a linear scale.
- **SVG connection lines** — Each `motion.line` draws itself by animating `pathLength` from `0` to `1` with a staggered delay. Data-packet dots then move along the line using `offsetDistance` in a repeating loop.
- **RAF count-up** — `CountUp` uses `requestAnimationFrame` with cubic ease-out (`1 - (1 - t)^3`) triggered by `useInView` from Framer Motion. No library for this — just a clean `useRef + rAF` loop that cancels on unmount.
- **Skeleton pulse** — While data is loading, three skeleton shapes animate `opacity: [0.4, 0.8, 0.4]` on a 1.4s infinite loop with per-element delays.
- **Reduced motion** — `useReducedMotion()` from Framer Motion replaces all `initial`/`animate` props with empty objects when the user has the OS preference set. Animations just don't happen — no jank, no flash.

---

## Token Architecture

All design values live in `app/globals.css` as CSS custom properties under `:root` (light) and `[data-theme="dark"]`. No values are hardcoded anywhere else in the codebase.

```css
:root {
  --color-accent-primary: #2f5bff;
  --spacing-lg: 1.5rem;
  --radius-full: 9999px;
  /* ... */
}
```

`tokens/index.ts` mirrors every variable as a typed TypeScript constant:

```ts
export const tokens = {
  colors: {
    accentPrimary: "var(--color-accent-primary)",
  },
  spacing: {
    lg: "var(--spacing-lg)",
  },
  // ...
} as const;
```

Components consume tokens via `tokens.colors.aws` etc., which means you get autocomplete and rename safety — and if you ever change the underlying CSS variable, the TS map stays in sync without touching component files.

The dark mode switch in `ThemeToggle` just flips `data-theme` on the `<html>` element. The CSS cascade does the rest — no JS color lookups, no style injection.

---

## Data Fetching & Caching

The API is `https://jsonplaceholder.typicode.com/users` — a real HTTP endpoint that returns stable-ish data (10 user objects with numeric IDs). I picked it because it's always available, has no auth, and returns a predictable JSON shape.

**Transform logic** — the raw response isn't financial data, so `transformToDashboard()` synthesises it:

1. `seed = sum of first 4 user IDs` — this gives a deterministic number per API response (typically `1+2+3+4 = 10`).
2. A `jitter(base, idx)` function applies ±10% variation using `(seed + idx * 7) % 20 - 10`, so the numbers look realistic without being random on every render.
3. Four cloud providers are assembled with hardcoded base spend values (`$48.2k`, `$31.5k`, `$22.8k`, `$14.1k`) jittered by the seed. Resources, efficiency, and savings are derived from the same seed.
4. Six `ResourceMetric` entries (CPU, GPU, RAM, Storage, Network, Nodes) are similarly seeded.

**Caching** — `sessionStorage` with a 5-minute TTL:

```
Load → check sessionStorage → cache miss → fetch → transform → write cache → render
Load → check sessionStorage → cache hit (< 5min) → render (0 requests)
```

A `useRef(false)` guard (`hasFetched`) prevents React 18 StrictMode's double-invocation from firing two parallel requests. The ref flips to `true` before the async call starts, so the second `useEffect` invocation bails immediately.

---

## Libraries Used

| Library | Why |
|---|---|
| `next` 14 | App Router, server components, built-in font optimisation |
| `framer-motion` | `useInView`, `useReducedMotion`, `motion.*` primitives, spring physics |
| `react` 18 | Concurrent features, `useRef`, `useEffect`, `useState` |
| `typescript` | End-to-end type safety, no `any` in the final build |

No UI component libraries. Every element is hand-rolled with vanilla CSS classes backed by the CSS variable token system.

---

## Tradeoffs

**Manual sessionStorage cache vs React Query / SWR**  
React Query would give deduplication, background refresh, devtools, and error retries out of the box. I went manual because the brief asked for explicit cache and fetch logic — it's easier to explain and audit without understanding a library's internals. In a real product I'd swap this for React Query immediately.

**Custom bar chart vs Recharts / Victory**  
The resource bars are CSS + Framer Motion `scaleY` animations. They look great and gave me full control over the token-based colors and animation timing. A charting library would add ~50kB and introduce its own styling constraints. For 6 bars, the custom approach wins. For anything more complex (zoom, tooltip, axis labels), reach for Recharts.

**sessionStorage vs localStorage**  
`sessionStorage` is per-tab — the cache resets when you close the tab, which I wanted for a data-freshness demo. The theme preference uses `localStorage` intentionally (you want dark mode to persist across sessions). If the dashboard data needed to persist, I'd move it to `localStorage` with a stricter TTL validation.

---

## What I'd Improve

- **Real-time updates** — swap the polling pattern for a WebSocket that pushes cost anomaly events. The SVG connection lines are already built for it; the data-packet animation could carry actual event payloads.
- **Node drilldown** — clicking a provider node should expand to a detail view: per-service spend breakdown, cost trend chart, top offenders list. The grid layout already has space for a slide-in panel.
- **Retry logic** — the current error state is a dead end. A proper implementation would include exponential backoff retries with a max attempt count, and a "Try again" button that re-runs `loadData()`.
- **Full WCAG 2.1 AA audit** — I've covered the basics (landmarks, `aria-label`, `role="alert"`, `aria-busy`, `aria-labelledby`, keyboard-accessible toggle), but I haven't run a formal audit with a screen reader. Focus management during the loading → data transition and colour contrast on the success bar fills need checking.
- **E2E tests** — Playwright tests covering the three async states (skeleton, error, data), the dark mode toggle, and keyboard navigation through the provider grid.

---

## Local Dev

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

To preview a production build locally:

```bash
npm run build
npm start
```
