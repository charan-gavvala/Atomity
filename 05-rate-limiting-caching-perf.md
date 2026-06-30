# Rate Limiting, Caching & Performance

## API Rate Limits

### JSONPlaceholder
- **Rate limit:** None enforced (public mock API, no auth)
- **Reliability:** Highly stable, maintained by Typicode
- **Latency:** Typically 50–200ms from Europe
- **Response size:** ~3.5KB for `/users` — negligible
- **CORS:** Allowed from all origins — no proxy needed

Since JSONPlaceholder has no rate limit, the only concern is **unnecessary requests** — which is solved by caching.

---

## Caching Architecture

### Layer 1 — In-Memory (React State)
- Once data is in `useState`, re-renders don't re-fetch
- Covers: tab stays open, component remounts within same session
- Lifetime: until page reload

### Layer 2 — sessionStorage (Persistent Cache)
- Survives React remounts and navigation within the tab
- **TTL:** 5 minutes (`CACHE_TTL_MS = 5 * 60 * 1000`)
- **Key:** `atomity_dashboard_data`
- **Value:** `{ data: DashboardData, timestamp: number }`
- Clears automatically when tab closes

### Cache Decision Tree

```
useDashboardData mounts
        │
        ▼
sessionStorage.getItem(CACHE_KEY)
        │
   ┌────┴────┐
  miss      hit
   │         │
   │    parse JSON
   │         │
   │    timestamp fresh?
   │    ┌────┴────┐
   │   yes        no
   │    │         │
   │  use cache  (fall through to fetch)
   │    │
   ▼    ▼
fetch /users
        │
   success?
   ┌────┴────┐
  yes        no
   │         │
transform  setError
   │
write sessionStorage
   │
setData
```

### What the Network Tab Shows

| Scenario | Requests |
|----------|----------|
| First load | 1 × GET jsonplaceholder.typicode.com/users |
| Page revisit (< 5 min) | 0 — served from sessionStorage |
| Page revisit (> 5 min) | 1 × GET (stale, refresh) |
| New tab | 1 × GET (sessionStorage is tab-scoped) |
| Hard refresh (Ctrl+R) | 1 × GET (sessionStorage clears on reload) |

---

## Performance Targets

### Animation Performance
- All animations use `transform` and `opacity` only — GPU-composited, never triggers layout or paint
- SVG line draw uses `pathLength` — compositor-friendly
- Bar grow uses `scaleY` — no height reflow
- Count-up uses `requestAnimationFrame` directly — no `setInterval` jank
- Pulse rings use CSS `will-change: transform` implicitly via Framer Motion

### Bundle Size

| Package | Approx Size (gzip) |
|---------|-------------------|
| Next.js runtime | ~90KB |
| React + ReactDOM | ~45KB |
| Framer Motion | ~50KB |
| Tailwind (purged) | ~8–15KB |
| App code | ~20–30KB |
| **Total** | **~215–230KB** |

Well within acceptable range for a marketing/demo page.

### Core Web Vitals Goals

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| FID / INP | < 100ms |
| CLS | 0 (no layout shifts) |

CLS is 0 because:
- Loading skeleton matches final layout dimensions exactly
- No images that could shift layout
- Fonts preloaded via `next/font`

### Font Loading
Use `next/font/google` with `display: swap` — font loads asynchronously, no blocking.

---

## Accessibility Performance

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .pulse-ring { animation: none; }
  * { transition-duration: 0.01ms !important; }
}
```
Plus `useReducedMotion()` from Framer Motion disables all JS-driven animations.

### Color Contrast
All text meets WCAG AA minimum:
- Body text on background: > 4.5:1
- Muted text: > 3:1 (large text)
- Accent green on dark: verified with `color-contrast()` mental check

### Focus Management
- Dark mode toggle: `<button>` with visible focus ring
- Provider nodes: `<div role="button" tabIndex={0}>` with keyboard handler if interactive
- SVG elements: `aria-hidden="true"` on decorative SVGs
- Section: `aria-labelledby` pointing to `<h2>`

---

## Error Recovery

### Fetch Failure
- User sees error state with the HTTP status or message
- No retry logic (would complicate the code for minimal gain in a challenge context)
- Mentioned in README as a known tradeoff

### Cache Parse Failure
```ts
try {
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (cached) { /* use it */ }
} catch {
  // sessionStorage unavailable (private browsing, storage full)
  // silently fall through to fetch
}
```
Cache is never a hard dependency — always degrades to a fresh fetch.

### sessionStorage Unavailable
Some browsers block sessionStorage in private/incognito mode. The try/catch above handles this — the app works fine without caching, just re-fetches every mount.

---

## Development vs Production

| Setting | Dev | Prod |
|---------|-----|------|
| API calls | Same (no mocking) | Same |
| Cache TTL | 5 minutes | 5 minutes |
| Source maps | Yes | No (Vercel default) |
| React StrictMode | Double-invokes effects | Off in prod |
| Next.js output | `.next/` dev server | Optimized static + edge |

**StrictMode note:** In development, `useEffect` runs twice. The `useRef(hasFetched)` guard prevents double-fetching:
```ts
const hasFetched = useRef(false);
useEffect(() => {
  if (hasFetched.current) return;
  hasFetched.current = true;
  // fetch...
}, []);
```
