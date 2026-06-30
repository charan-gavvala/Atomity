# Requirements

## Feature Choice
**Option B — Multi-Cloud Topology Section (0:45–0:55)**

A scroll-triggered section showing AWS, Azure, GCP, and On-Premise nodes connected via animated lines to a central resource metrics panel.

---

## Functional Requirements

### Must Have
- [ ] Single webpage with one animated scroll-triggered section
- [ ] 4 cloud provider nodes rendered in corner positions (AWS, Azure, GCP, On-Prem)
- [ ] SVG connection lines from each node to central panel — animated draw on scroll
- [ ] Central metrics panel showing resource breakdown (CPU, GPU, RAM, Storage, Network, Nodes)
- [ ] Count-up number animations for all metrics
- [ ] Data fetched from a public API (not hardcoded)
- [ ] Loading state while data fetches
- [ ] Error state if fetch fails
- [ ] Caching — no redundant network requests on revisit
- [ ] Fully responsive (desktop 1280px / tablet 768px / mobile 375px)
- [ ] Deployed to a public URL (Vercel)
- [ ] Public GitHub repo with incremental commits

### Should Have
- [ ] Dark mode toggle
- [ ] Hover interactions on provider nodes (highlight line, dim others)
- [ ] Animated data packet dots traveling along connection lines
- [ ] Pulse ring animation on each node
- [ ] `prefers-reduced-motion` support

### Nice to Have
- [ ] Smooth theme transition animation
- [ ] Keyboard navigation for interactive elements
- [ ] Meaningful favicon and page title

---

## Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | No animation jank. 60fps target. No layout shifts on load. |
| Accessibility | Semantic HTML, sufficient color contrast, keyboard-accessible, reduced-motion respected |
| Code quality | No monolithic files. Logical component separation. No dead code. |
| Styling | No hardcoded hex values in components. All colors via CSS tokens. |
| Data | No hardcoded content. All metrics derived from API response. |
| Caching | First fetch hits network. Revisit reads from cache. No redundant requests. |
| Commits | Incremental. Each commit does one thing. No single giant commit. |

---

## Constraints

- No pre-built UI libraries (no MUI, Chakra, shadcn, Ant Design)
- No pre-built templates or copied marketing sites
- No AI-generated code submitted without understanding it (will be asked to explain)
- Every component must be self-built from scratch
- Must be deployed — no live URL = disqualified

---

## Evaluation Weights

| Criteria | Weight |
|----------|--------|
| Code quality | 25% |
| Animation craft | 20% |
| Responsiveness | 15% |
| Modern CSS & styling | 15% |
| Data handling | 15% |
| Product thinking & docs | 10% |

---

## Deadline
**Wednesday, 1 July, 23:59 midnight**

Submit to: career@atomity.de
- GitHub repo link (public)
- Live demo URL
- README.md in repo
