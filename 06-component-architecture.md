# Component Architecture

## Design Principles
- Every component does one thing
- No component file exceeds ~150 lines
- Props are typed — no implicit any
- No shared mutable state — all data flows down via props
- Hooks are the only place side effects live

---

## File Map

```
/
├── tokens/
│   └── index.ts              Design token references (CSS var strings)
│
├── hooks/
│   └── useDashboardData.ts   Fetch, transform, cache, return {data, loading, error}
│
├── components/
│   ├── CloudDashboard.tsx    Outer section shell, grid layout, scroll trigger
│   ├── ProviderNode.tsx      Single cloud provider node (hex, logo, pulse, stats)
│   ├── ConnectionLines.tsx   SVG layer with draw-on-scroll lines + data packets
│   ├── MetricsPanel.tsx      Central panel, resource bars, KPI row
│   ├── CountUp.tsx           Reusable count-up number animation
│   └── States.tsx            LoadingSkeleton + ErrorState
│
└── app/
    ├── globals.css           CSS variables, token declarations, component styles
    ├── layout.tsx            HTML wrapper, metadata, font, theme init script
    └── page.tsx              Root page — just renders <CloudDashboard />
```

---

## Component Contracts

### `useDashboardData` hook
```ts
// Input: none
// Output:
{
  data: DashboardData | null,
  loading: boolean,
  error: string | null
}
```
All fetch, cache, and transform logic is contained here. Nothing else touches the network.

---

### `<CloudDashboard />`
```ts
// Props: none
// Responsibilities:
// - Renders section shell with aria-labelledby
// - Calls useDashboardData()
// - Conditionally renders loading/error/success states
// - Renders section header, dashboard canvas, stat strip
// - Passes data down to children
```

---

### `<ProviderNode />`
```ts
interface ProviderNodeProps {
  provider: CloudProvider;   // data
  delay: number;             // stagger delay for entrance animation
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}
// Responsibilities:
// - Hexagonal node shape (CSS clip-path or border trick)
// - Renders correct SVG logo via ProviderIcon switch
// - Pulse ring animation (infinite)
// - Scale on hover
// - CountUp for resource count and efficiency
// - Provider name + spend below hex
```

---

### `<ConnectionLines />`
```ts
interface ConnectionLinesProps {
  providers: CloudProvider[];   // for gradient colors
}
// Responsibilities:
// - Absolute SVG covering entire dashboard canvas
// - 4 gradient-colored dashed lines, one per provider
// - pathLength 0→1 draw animation on scroll
// - Animated circle dots traveling paths (animateMotion)
// - aria-hidden (decorative)
```

---

### `<MetricsPanel />`
```ts
interface MetricsPanelProps {
  metrics: ResourceMetric[];
  totalSpend: number;
  totalSavings: number;
}
// Responsibilities:
// - Centered panel with card styling
// - "Live" badge with blinking dot
// - KPI row: Total Spend / Savings Found with CountUp
// - 6 resource bars: scaleY entrance, staggered
// - Bar heights proportional to max value in metrics[]
// - CountUp value label on each bar
```

---

### `<CountUp />`
```ts
interface CountUpProps {
  to: number;
  duration?: number;     // default 1.4s
  prefix?: string;       // "$", etc.
  suffix?: string;       // "k", "%", " cores"
  decimals?: number;     // default 0
  className?: string;
}
// Responsibilities:
// - Uses useInView to start only when visible
// - RAF-based animation (not setInterval)
// - Cubic ease-out easing
// - Formats number with thousand separator
// - Runs once (once: true)
```

---

### `<LoadingSkeleton />`
```ts
// Props: none
// Renders:
// - 4 grey pulsing blobs in corner positions (matching node locations)
// - 1 grey pulsing rectangle in center (matching panel location)
// - aria-busy="true" aria-label="Loading dashboard data"
// - Pulse animation via Framer Motion animate prop
```

---

### `<ErrorState />`
```ts
interface ErrorStateProps {
  message: string;
}
// Props: error message string
// Renders: centered error card with icon + message
// role="alert" for screen readers
```

---

## Token Architecture

### Why TypeScript token file + CSS variables (both)?

CSS variables do the actual theming work. The TypeScript token file provides autocomplete and prevents typos in component code.

```ts
// tokens/index.ts — just string references to CSS vars
export const tokens = {
  colors: {
    bgCard: "var(--color-bg-card)",
    accentSuccess: "var(--color-accent-success)",
    // ...
  }
}

// Component usage (inline style when needed):
<div style={{ background: tokens.colors.bgCard }}>

// But prefer className with Tailwind where possible:
<div className="bg-[var(--color-bg-card)]">
```

### Token Naming Convention
```
--color-{category}-{variant}
--spacing-{size}
--radius-{size}

Categories: bg, text, accent, border
Variants: primary, secondary, muted, success, warning, error
Sizes: xs, sm, md, lg, xl, 2xl, full
```

---

## State Flow Diagram

```
sessionStorage
     │
     ▼
useDashboardData
  ├── loading: boolean
  ├── error: string | null
  └── data: DashboardData | null
          │
          ▼
    CloudDashboard
     ├──────────────────┐
     ▼                  ▼
ProviderNode × 4    MetricsPanel
     │                  │
     ▼                  ▼
  CountUp            CountUp × 8
```

No prop drilling beyond 2 levels. No context needed. Clean.
