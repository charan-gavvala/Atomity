# Atomity Frontend Challenge — Submission

**Live Demo:** https://atomity-challenge.vercel.app
**GitHub:** https://github.com/charan-gavvala/atomity-challenge

---

## Feature Chosen

**Option B — Multi-Cloud Topology Section (0:45–0:55)**

The video shows AWS, Azure, and Google Cloud logos with a cost tag, then transitions to a diagram of cloud providers connected to a central resource chart. I interpreted this as a "Multi-Cloud Intelligence Hub" — a scroll-triggered section that visualises cost and resource data across AWS, Azure, GCP, and On-Premise infrastructure in a live topology map.

I chose Option B over Option A because it offered more visual complexity, more animation surface area, and more room for creative interpretation.

---

## Animation Approach

All animations are scroll-triggered using Framer Motion's `whileInView` with `once: true` so they fire exactly once as the section enters the viewport.

**Sequence:**
1. Section header fades and translates up
2. Four provider nodes scale in from 0.7 with a 50ms stagger
3. Pulse rings begin an infinite scale + fade loop on each node
4. SVG connection lines draw themselves via `pathLength` 0→1
5. Animated data packet dots travel along each line on a loop
6. Central metrics panel scales and fades in
7. Resource bars grow upward via `scaleY` with a stagger
8. Count-up numbers animate via `requestAnimationFrame` (cubic ease-out)

Hover on a provider node scales it (spring physics) and uses CSS `:has()` to dim sibling nodes.

`useReducedMotion()` from Framer Motion disables all JS animations for users with reduced motion preferences. CSS `@media (prefers-reduced-motion: reduce)` handles the CSS-side animations (pulse rings).

---

## Token & Styling Architecture

CSS custom properties are defined once in `globals.css` under `:root` and `[data-theme="dark"]`. A TypeScript file (`tokens/index.ts`) maps those to named exports for use in `style={}` props where Tailwind can't reach.

```
globals.css       → defines --color-* --spacing-* --radius-*
tokens/index.ts   → exports { colors: { bgCard: "var(--color-bg-card)", ... } }
components        → reference tokens.colors.bgCard or className with CSS vars
```

No hex value appears in any component file. All colors go through the token system.

**Modern CSS features used:**
- `clamp()` — fluid section title font size and panel padding
- `@container` — MetricsPanel bar heights respond to panel container width
- `:has()` — parent grid dims siblings when a node is hovered
- `color-mix()` — pulse ring color derived from provider's brand color
- Native CSS nesting — `.bar-fill` nested inside `.bar-track`
- Logical properties — `margin-inline`, `padding-block`, `inline-size` throughout

---

## Data Fetching & Caching

**API:** `https://jsonplaceholder.typicode.com/users`

User IDs from the API response are used as a numeric seed to generate deterministic cloud cost and resource values. The same API response always produces the same dashboard — no randomness.

**Cache:** Manual `sessionStorage` with a 5-minute TTL.

```
First load  → fetch API → transform → write sessionStorage → render
Revisit     → read sessionStorage → timestamp fresh → skip fetch → render instantly
After 5min  → timestamp stale → refetch
```

A `useRef(hasFetched)` guard prevents React's StrictMode double-invocation from firing the fetch twice in development.

sessionStorage access is wrapped in try/catch — if unavailable (private browsing), the app falls through to a normal fetch without breaking.

---

## Libraries Used

| Library | Why |
|---------|-----|
| Next.js 14 (App Router) | Framework, TypeScript, Vercel deployment |
| Framer Motion | Scroll triggers, spring hover, `useReducedMotion` |
| Tailwind CSS | Layout utilities, responsive breakpoints |

No charting libraries, no UI component libraries, no state management libraries.

---

## Tradeoffs & Decisions

**Manual cache vs React Query:** React Query would add 13KB and a provider wrapper for a single fetch. Manual sessionStorage cache demonstrates the same understanding with less overhead. Mentioned as a production upgrade.

**Custom SVG bars vs chart library:** Building bars from scratch lets me control the `scaleY` entrance animation exactly. A chart library would fight against Framer Motion for control of the elements.

**sessionStorage vs localStorage:** Dashboard data should be considered session-scoped — cloud costs from a previous browser session could be stale by hours. sessionStorage TTL of 5 minutes is appropriate.

**4 providers only:** The video shows 3 cloud providers. I added On-Premise as a fourth to create a symmetric 2×2 corner layout, which gives the topology diagram better visual balance and makes the grid CSS cleaner.

---

## What I'd Improve With More Time

- **Real-time data:** Replace JSONPlaceholder with a WebSocket or SSE endpoint for live cost updates with delta animations
- **Node drilldown:** Clicking a provider node expands a detail panel with per-service cost breakdown
- **Retry logic:** Exponential backoff on fetch failure with a "Retry" button
- **Full WCAG AA audit:** Currently passes the basics, but a proper audit with axe-core would catch edge cases
- **E2E tests:** Cypress tests for scroll trigger timing, cache hit/miss behavior, dark mode persistence
- **Storybook:** Each component isolated with all prop variants visible

---

## Local Development

```bash
npm install
npm run dev
# → http://localhost:3000
```

```bash
npm run build   # verify no TypeScript errors before submitting
```
