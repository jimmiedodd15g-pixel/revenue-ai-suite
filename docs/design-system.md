# Design System — IRGE Extension

## 1. Philosophy

**Enterprise Dark.** Dense, calm, trustworthy. Inspired by Bloomberg Terminal, Palantir Foundry, and the OpenAI console. Information density wins over whitespace; gradients and glow accents signal AI/intelligence.

## 2. Color tokens (HSL, defined in `src/index.css`)

| Token | Role |
|---|---|
| `--background` | Page background (deep navy / near-black) |
| `--foreground` | Primary text |
| `--card` | Surface for cards & panels |
| `--primary` / `--primary-glow` | Brand accent + glow for CTAs and highlights |
| `--success` | Above-target metrics, executed decisions |
| `--warning` | Below-target, queued decisions |
| `--destructive` | Critical risk, errors |
| `--muted` / `--muted-foreground` | Secondary surfaces and labels |
| `--border` | Hairline dividers |

**Rule:** components must reference these tokens via Tailwind semantic classes (`bg-card`, `text-success`). Raw colors (`text-white`, `bg-slate-900`) are forbidden.

## 3. Utilities

| Utility | Purpose |
|---|---|
| `glass-card` | Frosted, semi-transparent panel with subtle border |
| `gradient-primary` | Brand gradient (primary → primary-glow) |
| `shadow-glow` | Soft colored glow for active / hovered cards |
| `transition-smooth` | Standard easing for hover/state changes |

## 4. Typography

- **Sans-serif system stack** (Inter-like, fallback to system UI)
- Headings: medium weight, tight tracking
- Numbers: tabular figures where possible (`tabular-nums`) for KPI alignment

## 5. Component conventions

- All cards use `SectionCard` or `KpiCard` — never raw `<div>`
- Tables use shadcn `Table` primitives with `text-sm` and `tabular-nums` for numeric columns
- Charts use Recharts with HSL colors pulled from CSS variables, never hardcoded hex
- Forms use React Hook Form + Zod; errors render inline below inputs

## 6. Motion

- Hover transitions ≤ 200ms
- Live data updates fade in (no layout jumps)
- No bouncy springs — this is enterprise, not consumer

## 7. Accessibility

- Contrast ratio ≥ 4.5:1 for body text on all surfaces
- Focus rings always visible (`focus-visible:ring-2 ring-primary`)
- All interactive elements reachable by keyboard
- ARIA labels on icon-only buttons
