# Architecture — IRGE Extension

## 1. System Overview

The IRGE Extension is a **client-side React 18 application** that visualizes the output of a hybrid lakehouse + ML decision engine. In production, data would flow from OCI; in this prototype, all streams are mocked client-side via React hooks.

```
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│  Source systems  │──▶│   OCI Lakehouse  │──▶│ Decision Engine  │
│ Salesforce CDC   │   │ Bronze / Silver  │   │ 5 ML microservices│
│ IRGE Scanner     │   │ / Gold layers    │   │ Shapley explainer │
│ Marketing APIs   │   └──────────────────┘   └────────┬─────────┘
└──────────────────┘                                   │
                                                       ▼
                                              ┌──────────────────┐
                                              │  REST / SSE API  │
                                              │  (mocked here)   │
                                              └────────┬─────────┘
                                                       ▼
                                              ┌──────────────────┐
                                              │ React Dashboard  │
                                              │ (this repository)│
                                              └──────────────────┘
```

## 2. Frontend layers

| Layer | Responsibility | Key files |
|---|---|---|
| **Routing** | Page-level navigation | `src/App.tsx` |
| **Layout** | Sidebar, topbar, page shell | `src/components/layout/*` |
| **Pages** | Composition + page-specific state | `src/pages/*` |
| **Domain components** | Reusable UI (KpiCard, SectionCard) | `src/components/dashboard/*` |
| **Data layer** | Mock generators + live hooks | `src/lib/mock-data.ts`, `src/lib/use-live-data.ts` |
| **Design system** | HSL tokens, utilities, gradients | `src/index.css`, `tailwind.config.ts` |

## 3. Real-time data contract

The dashboard expects three primary streams:

```ts
type Decision = { id; ts; account; engine; action; confidence; impact; status };
type RiskAccount = { id; name; segment; pqScore; arr; risk; topDriver; csm };
type LeadEvent = { id; source; score; ts; region; vertical };
```

In production these would arrive via **Server-Sent Events** or **WebSocket** from the Decision Engine API. In this prototype:

- `useLiveDecisions()` pushes a new `Decision` every ~4s
- `useLiveLeads()` pushes a new `LeadEvent` every ~3.5s
- `useLiveCounters()` increments aggregate counters every ~2.5s

## 4. Latency budget (<2s end-to-end)

| Hop | Budget |
|---|---|
| Source → Bronze ingest | 300 ms |
| Bronze → Silver/Gold transform | 500 ms |
| Decision Engine inference | 600 ms |
| API + network to client | 400 ms |
| React render | 200 ms |
| **Total** | **2.0 s** |

## 5. Page responsibilities

- **`/dashboard`** — exec KPIs, revenue lift, live decision stream, live counter strip.
- **`/engines`** — per-engine cards (Lead, Churn, Upsell, Pricing, Budget) with accuracy vs. target, throughput, last-trained.
- **`/risk-analysis`** — Likelihood × Impact 5×5 matrix, Shapley feature importance bars, top risk accounts table.
- **`/settings`** — OCI API base URL, OAuth status, Bronze/Silver/Gold source health, IRGE Scanner connection.

## 6. Future production hardening

- Replace mock hooks with TanStack Query + SSE/WebSocket transport
- Add server-side auth (Lovable Cloud / Supabase) and RLS-backed account scoping
- Persist user preferences (theme, density, saved filters)
- Add observability hooks (web vitals, decision-render latency)
