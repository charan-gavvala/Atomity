# Build Process & Commit Strategy

## Local Setup

```bash
# 1. Scaffold project
npx create-next-app@latest atomity-challenge \
  --typescript \
  --tailwind \
  --app \
  --no-eslint \
  --import-alias "@/*"

cd atomity-challenge

# 2. Install animation library
npm install framer-motion

# 3. Start dev server
npm run dev
# → http://localhost:3000
```

---

## Build Commands

```bash
npm run dev      # Development server with hot reload
npm run build    # Production build — check for TypeScript errors here
npm run start    # Serve production build locally
```

Always run `npm run build` before pushing. Catches type errors that dev mode ignores.

---

## Directory Setup (run once after scaffold)

```bash
mkdir -p tokens components hooks
```

---

## Build Order (What to Build First)

Build in this order — each step is testable before moving on:

```
1. globals.css        → paste all CSS variables, verify dark/light tokens
2. tokens/index.ts    → write token map, verify TypeScript compiles
3. app/layout.tsx     → font, metadata, theme init script
4. app/page.tsx       → blank page, just import CloudDashboard stub
5. hooks/useDashboardData.ts → fetch + cache + transform
                               TEST: console.log(data) in page.tsx
6. components/States.tsx     → loading + error components
                               TEST: force loading=true in CloudDashboard
7. components/CountUp.tsx    → TEST: <CountUp to={1234} /> on page
8. components/MetricsPanel.tsx → TEST: pass mock metrics prop
9. components/ProviderNode.tsx → TEST: render one node with mock provider
10. components/ConnectionLines.tsx → TEST: render SVG, check browser
11. components/CloudDashboard.tsx → wire everything together
12. Responsive CSS            → test at 1280 / 768 / 375
13. Dark mode toggle          → add to layout, test token swap
14. README.md                 → write last, when everything works
```

---

## Commit Strategy

**Rule:** One logical change per commit. If you can't summarize it in 10 words, split it.

```
Commit 1:  init: scaffold Next.js with TypeScript, Tailwind, App Router
Commit 2:  tokens: define CSS variable system for colors, spacing, radius
Commit 3:  tokens: add dark mode token overrides under [data-theme="dark"]
Commit 4:  feat: useDashboardData hook — fetch, transform, sessionStorage cache
Commit 5:  feat: CountUp component with RAF animation and useInView trigger
Commit 6:  feat: LoadingSkeleton and ErrorState components
Commit 7:  feat: ProviderNode with hex shape, provider icons, pulse ring
Commit 8:  feat: ConnectionLines SVG with draw animation and data packets
Commit 9:  feat: MetricsPanel with animated bars and KPI count-ups
Commit 10: feat: CloudDashboard — wires all components, scroll triggers
Commit 11: style: responsive layout — tablet 768px and mobile 375px
Commit 12: feat: dark mode toggle with localStorage persistence
Commit 13: a11y: prefers-reduced-motion, aria labels, semantic HTML audit
Commit 14: docs: README — approach, tradeoffs, decisions, libraries
```

Aim for 12–15 commits minimum. The evaluator checks git log.

---

## Pre-Submission Checklist

### Code
- [ ] `npm run build` passes with 0 errors
- [ ] No `any` types anywhere
- [ ] No hardcoded hex values in components (only in globals.css)
- [ ] No pre-built UI library imports
- [ ] All components in separate files
- [ ] Token file exists and is used

### Functionality
- [ ] Data fetches from API on first load
- [ ] Network tab shows 0 requests on revisit (within 5 min)
- [ ] Loading skeleton appears during fetch
- [ ] Error state renders if you break the API URL
- [ ] All animations trigger on scroll
- [ ] Hover interactions work
- [ ] Dark mode toggle works
- [ ] Dark mode preference persists on reload

### Responsive
- [ ] Desktop 1280px — full 3×3 grid layout
- [ ] Tablet 768px — 2×2 nodes + panel below
- [ ] Mobile 375px — single column stack
- [ ] No horizontal scroll at any breakpoint
- [ ] Text is readable at all sizes

### Accessibility
- [ ] `prefers-reduced-motion` disables animations
- [ ] Tab key reaches dark mode toggle
- [ ] `<section aria-labelledby>` present
- [ ] SVG decorative elements have `aria-hidden="true"`
- [ ] Loading state has `aria-busy="true"`
- [ ] Error state has `role="alert"`

### Deployment
- [ ] GitHub repo is **public**
- [ ] Vercel project connected to GitHub
- [ ] Live URL loads without errors
- [ ] Live URL tested on mobile (not just desktop)
- [ ] README.md exists in repo root

### Submission
- [ ] Reply to career@atomity.de before deadline
- [ ] Include: GitHub URL, Live URL, brief note
- [ ] Deadline: Wednesday 1 July, 23:59

---

## Vercel Deployment

```bash
# Push to GitHub first
git remote add origin https://github.com/YOUR_USERNAME/atomity-challenge.git
git push -u origin main

# Then on vercel.com:
# 1. New Project
# 2. Import from GitHub
# 3. Select atomity-challenge
# 4. Framework: Next.js (auto-detected)
# 5. Deploy

# Every subsequent push auto-deploys
```

Environment variables: none needed (JSONPlaceholder is public, no key required).

---

## Common Pitfalls to Avoid

| Pitfall | Fix |
|---------|-----|
| `useEffect` double-fire in dev | `useRef(hasFetched)` guard |
| sessionStorage throws in private mode | wrap in try/catch |
| SVG `animateMotion` not working in some browsers | test in Chrome + Firefox |
| Framer Motion `whileInView` fires on initial mount if element is already visible | add `margin: "-5%"` to viewport |
| `clamp()` in Tailwind arbitrary value | use `text-[clamp(...)]` syntax |
| TypeScript error on CSS custom properties in style prop | cast as `React.CSSProperties` |
| Dark mode flicker on load | inline script in `<head>` before paint to read localStorage |
