# AI-Powered Revenue Optimization System (IRGE Extension)

> A high-performance enterprise dashboard and decision engine UI built on a hybrid lakehouse architecture. The system visualizes real-time, revenue-driving decisions across **lead scoring, churn, upsell, pricing, and budget allocation**, with a target end-to-end latency of **<2s**.
>
> Aesthetic: dark "Enterprise AI" theme — glassmorphism, gradient accents, data-dense layouts inspired by Bloomberg / Palantir / OpenAI consoles.

---

## 📑 Table of Contents

1. [Project Overview](#-project-overview)
2. [Architecture Summary](#-architecture-summary)
3. [AI Models and Tools Used](#-ai-models-and-tools-used)
4. [AI Engineering Analysis](#-ai-engineering-analysis)
5. [Engineering Reflection](#-engineering-reflection)
6. [Supporting Context Files](#-supporting-context-files)
7. [Getting Started](#-getting-started)
8. [Project Structure](#-project-structure)
9. [Success Criteria](#-success-criteria)
10. [Deployment](#-deployment)

---

## 🧭 Project Overview

The **IRGE Extension** (Intelligent Revenue Growth Engine) is the front-end and decision-engine surface for an enterprise revenue-optimization platform. It is built as a **client-side React application** that consumes (mocked) streams from an OCI lakehouse and presents real-time decisions to RevOps, Sales, and Finance leaders.

**Primary user goals**
- See projected revenue lift (5–15%) updated in real time
- Inspect the 5 ML microservices powering automated decisions
- Drill into Shapley-weighted risk for top accounts
- Configure data sources, auth, and lakehouse health

**Pages**

| Route | Purpose |
|---|---|
| `/` | Login / Sign-up with mock Microsoft Entra SSO |
| `/dashboard` | Executive KPIs, Revenue Lift charts, live decision stream |
| `/engines` | Deep dive into the 5 ML microservices and their performance |
| `/risk-analysis` | Shapley-weighted risk matrix, feature importance, top accounts |
| `/settings` | OCI API config, OAuth status, lakehouse source health |

---

## 🏗️ Architecture Summary

```
┌─────────────────────────────────────────────────────┐
│  OCI Lakehouse (Bronze → Silver → Gold)             │
│  + IRGE Scanner Stream + Salesforce CDC             │
└────────────────────┬────────────────────────────────┘
                     │  (mocked via use-live-data hooks)
                     ▼
┌─────────────────────────────────────────────────────┐
│  Decision Engine v2.4 — 5 ML Microservices          │
│  Lead • Churn • Upsell • Pricing • Budget           │
│  Shapley explainability • <2s latency budget        │
└────────────────────┬────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────────┐
│  React 18 + Vite Dashboard (this repo)              │
│  Tailwind + shadcn/ui • Recharts • TanStack Query   │
└─────────────────────────────────────────────────────┘
```

**Frontend stack**
- **React 18 + TypeScript + Vite 5**
- **Tailwind CSS v3** with semantic HSL design tokens (`src/index.css`, `tailwind.config.ts`)
- **shadcn/ui** + **Radix UI** primitives
- **React Router v6**
- **Recharts** for data viz
- **React Hook Form + Zod** for validation
- **TanStack Query** for async state
- **Sonner** for toasts
- **Vitest** + Testing Library for tests

**Real-time data layer (mocked)**
- `src/lib/mock-data.ts` — entity types (`Decision`, `RiskAccount`, `LeadEvent`) + generators
- `src/lib/use-live-data.ts` — `useLiveDecisions`, `useLiveLeads`, `useLiveCounters` push updates every ~2.5–4s

For a deeper dive see [`docs/architecture.md`](./docs/architecture.md).

---

## 🤖 AI Models and Tools Used

This README distinguishes between **AI models conceptually visualized in the product** and **AI tools used during engineering**.

### A. AI models visualized inside the product (mocked)

| Model / Engine | Role | Target Metric |
|---|---|---|
| **Lead Scoring Model** | Ranks inbound leads, routes to AE / nurture / SQL | Accuracy > 88% |
| **Churn Prediction Model** | Predicts account churn risk, triggers retention plays | Accuracy > 85% |
| **Upsell / Cross-sell Model** | Recommends Tier 2 / add-on / bundle offers | Lift > 12% |
| **Dynamic Pricing Model** | Suggests price brackets, discounts, annual conversions | Margin > 8% |
| **Budget Allocation Model** | Reallocates spend across Search / LinkedIn / ABM / Display | ROAS > 4.0 |
| **Shapley Explainer** | Per-decision feature attribution on Risk Analysis page | — |

### B. AI tools used to build the product

| Tool | Role in this project |
|---|---|
| **Lovable AI agent** (Anthropic Claude Sonnet under the hood) | Primary code generation, refactoring, design-system scaffolding, page wiring |
| **Claude (chat)** | Architecture brainstorming, prompt drafting, naming, copy review |
| **GitHub Copilot** *(optional)* | Inline completions while hand-editing in IDE |
| **shadcn/ui generator** | Deterministic component scaffolds (not AI, but template-driven) |
| **Recharts + Tailwind docs (via web search)** | Reference lookups during AI-assisted edits |

Detailed prompting notes live in [`docs/claude.md`](./docs/claude.md).

---

## 🔬 AI Engineering Analysis

### Strengths of the AI tools used

- **Speed of scaffolding.** End-to-end page + layout + design-token setup that would normally take 1–2 days was produced in a single afternoon.
- **Consistency.** Once the design system (HSL tokens, `glass-card`, `gradient-primary`) was defined, the AI reliably applied it across all pages without re-introducing raw color classes.
- **Refactoring leverage.** Asking the AI to "extract a `KpiCard`" or "make the risk matrix a CSS grid" produced clean, reusable components on the first try.
- **Mock data fluency.** Generating realistic but coherent fixtures (`Decision`, `RiskAccount`, `LeadEvent`) was significantly faster with AI than hand-writing.

### Limitations encountered

- **CSS Grid + React fragments bug.** The AI's first pass at the risk matrix used `<>...</>` inside a `grid` parent, which silently broke the column layout. Required an explicit fix to `<div className="contents">`.
- **Over-eager rewrites.** Without scoping ("only touch this file"), the AI sometimes regenerated unrelated files, risking churn.
- **Shallow domain reasoning.** Concepts like Shapley weighting were rendered visually, but the AI did not push back on whether the *math* was meaningful — that remained a human responsibility.
- **Real-time semantics.** AI defaulted to `setInterval` simulations; it did not propose more sophisticated patterns (WebSocket / SSE / TanStack Query streaming) until prompted.

### Tradeoffs

| Choice | Tradeoff |
|---|---|
| Client-side mock data via hooks | ✅ Zero backend setup ❌ No persistence, no real auth |
| shadcn/ui + Tailwind tokens | ✅ Full design control ❌ More boilerplate than a finished component lib |
| One AI agent driving most files | ✅ Coherent style ❌ Single point of failure on subtle bugs |
| Recharts | ✅ Declarative, React-native ❌ Limited for very dense financial viz |

### Prompting strategies — what worked

- **Concrete acceptance criteria.** "Lead Scoring card must show accuracy %, target 88%, and turn `success` green when above target." → first-try success.
- **Anchoring to the design system.** Reminding the AI to "use semantic tokens from `index.css`, never raw Tailwind colors" prevented drift.
- **Atomic file scoping.** "Only edit `RiskAnalysis.tsx`" reliably prevented regressions.
- **Showing the desired data shape.** Pasting a TS type before asking for a component produced correctly-typed JSX immediately.

### Prompting strategies — what failed

- **Vague aesthetic prompts.** "Make it look more enterprise" produced inconsistent results until paired with reference brands (Bloomberg, Palantir).
- **Asking for "real-time"** without specifying the mechanism — got `setInterval` every time.
- **Multi-page mega-prompts.** Requesting 5 pages in one shot led to shallow implementations; splitting per page worked far better.
- **Letting the AI invent metric targets.** It would hallucinate plausible-but-wrong numbers (e.g., "92% lead accuracy") instead of asking.

---

## 🪞 Engineering Reflection

### What I would do differently *without* AI

- I would have started with a **lower-fidelity wireframe** (Figma or even paper) before touching code, because hand-coding raises the cost of throwing layouts away.
- I would have picked a **batteries-included chart library** (e.g., Tremor, Nivo) instead of composing Recharts from scratch, to save time.
- I would have **deferred the design system** and shipped with default shadcn theming first, then themed later.
- The mock data layer would likely have been **smaller and less typed** — AI made it cheap to add full TypeScript entities, which I would have skipped under time pressure.

### What AI *improved*

- **Design system discipline.** AI was relentless about using semantic tokens once instructed — more consistent than I usually am by hand.
- **Boilerplate elimination.** Routing, layout shells, sidebar nav, form validation schemas — all near-instant.
- **Documentation.** This README, `architecture.md`, `security.md`, and `claude.md` exist *because* AI made writing them cheap.
- **Refactor courage.** Knowing a refactor is one prompt away made me more willing to extract components and rename things.

### What AI *degraded*

- **Deep understanding of edge cases.** I caught myself trusting AI output without reading it, and missed the grid-fragment bug for one cycle.
- **Architectural debate.** The AI rarely pushes back on questionable choices ("are you sure you want client-only state?"), so the burden of skepticism stays on me.
- **Library selection rigor.** AI picks the most popular option, not always the best fit. I would have evaluated Tremor vs. Recharts more carefully on my own.
- **Performance intuition.** AI happily ships `setInterval` chains and unmemoized renders; without review, this would degrade UX at scale.

**Net assessment:** AI roughly **3–5×'d delivery speed** for a UI-heavy prototype like this, while requiring **active human review** for correctness, performance, and architectural integrity.

---

## 📚 Supporting Context Files

These documents live in [`/docs`](./docs) and were used to guide the AI agent throughout development.

| File | Purpose |
|---|---|
| [`docs/architecture.md`](./docs/architecture.md) | System architecture, data flow, decision-engine contracts, latency budget |
| [`docs/security.md`](./docs/security.md) | Auth model, secrets handling, RLS expectations, threat notes |
| [`docs/claude.md`](./docs/claude.md) | Prompting playbook, agent rules, what worked / failed, anti-patterns |
| [`docs/design-system.md`](./docs/design-system.md) | Tokens, color system, typography, component conventions |
| [`docs/mock-data-spec.md`](./docs/mock-data-spec.md) | Entity schemas + generator behavior for the live-data simulation |

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint
npm run lint
```

Open [http://localhost:5173](http://localhost:5173) and sign in (any valid mock credentials work) to enter the dashboard.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── dashboard/       # KpiCard, SectionCard
│   ├── layout/          # AppLayout, AppSidebar, TopBar
│   └── ui/              # shadcn primitives
├── lib/
│   ├── mock-data.ts     # Entity types + generators
│   ├── use-live-data.ts # Real-time simulation hooks
│   └── utils.ts
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Engines.tsx
│   ├── RiskAnalysis.tsx
│   └── Settings.tsx
├── index.css            # Design tokens (HSL)
└── App.tsx              # Routes

docs/
├── architecture.md
├── security.md
├── claude.md
├── design-system.md
└── mock-data-spec.md
```

---

## 🎯 Success Criteria

| Metric | Target | Current (mock) |
|---|---|---|
| Projected Revenue Growth | 5–15% | ✅ |
| Lead Scoring Accuracy | >88% | ✅ |
| Churn Model Accuracy | >85% | ✅ |
| End-to-end Decision Latency | <2s | 1.2s |
| API Uptime | 99.95% | 99.98% |

Toast alerts fire when models exceed their target accuracy.

---

## 📦 Deployment

This project is built and deployed with [Lovable](https://lovable.dev).

- **Preview:** auto-updates on every change
- **Publish:** click *Publish* in the Lovable editor for a production URL
- **Custom domain:** configure under *Project → Settings → Domains*

---

## 📝 License

Internal / proprietary — IRGE Extension prototype.
