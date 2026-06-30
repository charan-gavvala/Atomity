# App Flow

## Page Structure

```
/  (root page)
└── layout.tsx         → sets metadata, font, html/body wrapper
└── page.tsx           → imports and renders <CloudDashboard />
    └── CloudDashboard.tsx
        ├── Section header (eyebrow badge + h2 + subtitle)
        ├── Dashboard canvas
        │   ├── ConnectionLines.tsx   (SVG layer, absolute positioned)
        │   ├── ProviderNode × 4     (corner grid positions)
        │   └── MetricsPanel         (center grid position)
        └── Stat strip (summary KPIs below canvas)
```

---

## Component Tree

```
<CloudDashboard>
  │
  ├── <motion.div> Section header
  │     └── eyebrow badge, h2, subtitle
  │
  ├── <div> dashboard-canvas
  │     ├── [loading]  <LoadingSkeleton />
  │     ├── [error]    <ErrorState message={...} />
  │     └── [success]  <div> provider-grid
  │           ├── <ConnectionLines providers={data.providers} />
  │           │     └── <svg> (absolute, full canvas)
  │           │           ├── <defs> linearGradients per provider
  │           │           ├── <motion.line> × 4 (draw animation)
  │           │           ├── <circle> × 4 (traveling data packets)
  │           │           └── <path> × 4 (hidden, for animateMotion)
  │           │
  │           ├── <ProviderNode> top-left    (AWS)
  │           ├── <ProviderNode> top-right   (Azure)
  │           ├── <ProviderNode> bottom-left (GCP)
  │           ├── <ProviderNode> bottom-right (On-Prem)
  │           │     Each contains:
  │           │       ├── <motion.div> node-hex (hexagon shape)
  │           │       │     ├── <ProviderIcon> (custom SVG logo)
  │           │       │     └── node stats (resources, efficiency)
  │           │       ├── <motion.div> pulse-ring (infinite)
  │           │       └── provider label + spend (CountUp)
  │           │
  │           └── <MetricsPanel>  center
  │                 ├── panel header + live badge
  │                 ├── KPI row (Total Spend | Savings Found)
  │                 └── resource bars × 6
  │                       ├── <motion.div> bar-track (scaleY)
  │                       │     └── <motion.div> bar-fill (height %)
  │                       ├── bar label
  │                       └── bar value (CountUp)
  │
  └── <motion.div> stat-strip (3 summary stats)
```

---

## User Journey

### 1. First Visit

```
User opens page
  → layout renders (no flash, font preloaded)
  → CloudDashboard mounts
  → useDashboardData hook fires
      → checks sessionStorage → miss
      → setLoading(true)
      → fetch jsonplaceholder.typicode.com/users
      → transform response → DashboardData
      → write to sessionStorage with timestamp
      → setData(transformed), setLoading(false)
  → Loading skeleton shows during fetch (~100–300ms)
  → Dashboard renders with data
  → User scrolls down
      → Section header fades up
      → Provider nodes scale in (staggered)
      → Pulse rings begin infinite loop
      → Connection lines draw themselves (pathLength 0→1)
      → Central panel scales in
      → Resource bars grow upward (staggered)
      → Count-up numbers animate
      → Data packet dots begin traveling along lines
```

### 2. Revisit / Re-render (Same Tab)

```
User navigates away and back (or component remounts)
  → useDashboardData hook fires
  → checks sessionStorage → hit, timestamp fresh
  → setData(cached), setLoading(false) — instant, no network
  → Loading skeleton never shown (data available synchronously-ish)
  → Scroll animations replay on scroll
```

### 3. Hover Interaction

```
User hovers a ProviderNode
  → node scales to 1.06 (spring physics)
  → CSS :has() on parent grid:
      → hovered node connection line brightens
      → other 3 nodes reduce opacity to 0.4
      → other connection lines reduce opacity to 0.3
  → Mouse leaves → all return to normal (spring easing)
```

### 4. Dark Mode Toggle

```
User clicks toggle (top-right corner)
  → JavaScript sets data-theme="dark" on <html>
  → CSS variables re-cascade instantly
  → All token-referenced colors update
  → Toggle icon swaps (sun ↔ moon)
  → Preference saved to localStorage
      → On next page load, reads preference and applies before paint
```

### 5. Reduced Motion

```
User has prefers-reduced-motion: reduce in OS settings
  → useReducedMotion() hook returns true
  → All motion.div initial/animate props receive empty objects
  → Framer Motion's global reduced motion also disables internally
  → Elements appear immediately without transitions
  → Count-up numbers still increment (visual, not motion)
  → Pulse rings: animation disabled via CSS media query
```

---

## Scroll Trigger Sequence (Timeline)

All triggers use `whileInView` with `viewport={{ once: true, margin: "-5%" }}`.
"Once" means they don't re-trigger on scroll up/down.

```
t=0ms    Section enters viewport
t=0ms    Header fades up (duration 550ms)
t=100ms  AWS node (top-left) scales in
t=150ms  Azure node (top-right) scales in
t=200ms  GCP node (bottom-left) scales in
t=250ms  On-Prem node (bottom-right) scales in
t=200ms  Connection line TL begins drawing (800ms)
t=300ms  Connection line TR begins drawing
t=400ms  Connection line BL begins drawing
t=500ms  Connection line BR begins drawing
t=300ms  Pulse rings begin on each node
t=300ms  MetricsPanel scales in (delay 100ms after nodes)
t=500ms  Bar 1 (CPU) grows up
t=580ms  Bar 2 (GPU) grows up
t=660ms  Bar 3 (RAM) grows up
t=740ms  Bar 4 (Storage) grows up
t=820ms  Bar 5 (Network) grows up
t=900ms  Bar 6 (Nodes) grows up
t=500ms  Count-up numbers begin (1.4s duration)
t=1000ms Data packets begin traveling lines (loops)
t=800ms  Stat strip fades up
```

---

## Grid Layout Logic

```
Desktop (1280px+):

┌──────────┬──────────┬──────────┐
│  AWS     │          │  Azure   │
│  node    │          │  node    │
├──────────┼──────────┼──────────┤
│          │ Metrics  │          │
│          │  Panel   │          │
├──────────┼──────────┼──────────┤
│  GCP     │          │ On-Prem  │
│  node    │          │  node    │
└──────────┴──────────┴──────────┘

SVG connection lines are absolute-positioned over the entire grid,
connecting corner midpoints to center panel midpoint.

Tablet (768px):
Nodes stack 2×2, panel below full-width.

Mobile (375px):
All items single column, panel last.
Connection lines hidden on mobile (too cramped).
```
