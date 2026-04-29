# Mock Data Specification

> All data in the prototype is generated client-side. This spec documents the entity shapes and generator behavior, so production wiring (real OCI / SSE) is a drop-in replacement.

## 1. Entities

### `Decision`
```ts
type Decision = {
  id: string;            // "DEC-1042"
  ts: string;            // ISO timestamp
  account: string;       // e.g. "Aperture Labs"
  engine: "Lead" | "Churn" | "Upsell" | "Pricing" | "Budget";
  action: string;        // engine-specific verb phrase
  confidence: number;    // 0..1
  impact: number;        // USD revenue impact
  status: "executed" | "queued" | "review";
};
```
**Status mapping** (driven by confidence):
- `confidence ≥ 0.85` → `executed`
- `0.75 ≤ confidence < 0.85` → `queued`
- otherwise → `review`

### `RiskAccount`
```ts
type RiskAccount = {
  id: string;
  name: string;
  segment: "Enterprise" | "Mid-Market" | "SMB";
  pqScore: number;       // 0..1, Shapley-weighted churn probability
  arr: number;           // USD
  risk: "Critical" | "High" | "Medium" | "Low" | "Very Low";
  topDriver: string;     // dominant Shapley feature
  csm: string;
};
```

### `LeadEvent`
```ts
type LeadEvent = {
  id: string;
  source: string;        // "Webinar", "Demo Request", ...
  score: number;         // 40..98
  ts: string;
  region: "NA-East" | "NA-West" | "EMEA" | "APAC" | "LATAM";
  vertical: "FinServ" | "Healthcare" | "Retail" | "Manufacturing" | "Tech";
};
```

## 2. Generators (`src/lib/mock-data.ts`)

| Function | Behavior |
|---|---|
| `generateDecision()` | Random engine + matching action; confidence ∈ [0.62, 0.98]; impact ∈ [$1.2k, $49.2k] |
| `generateLead()` | Random source/region/vertical; score ∈ [40, 98] |
| `seedDecisions` | 18 pre-generated decisions, timestamped backwards in 18s steps |
| `seedLeads` | 12 pre-generated leads |
| `riskAccounts` | Static, hand-curated set of 8 accounts spanning all risk tiers |
| `liveCounters` | Initial values for the dashboard counter strip |

## 3. Live hooks (`src/lib/use-live-data.ts`)

| Hook | Cadence | Behavior |
|---|---|---|
| `useLiveDecisions(ms = 4000)` | 4s | Prepends a new decision; keeps last 25 |
| `useLiveLeads(ms = 3500)` | 3.5s | Prepends a new lead; keeps last 15 |
| `useLiveCounters(ms = 2500)` | 2.5s | Increments leads, decisions, revenue lift, retained accounts |

All hooks clean up their intervals on unmount.

## 4. Production swap

To replace mocks with real streams:

1. Keep the same TypeScript types — they are the contract.
2. Replace each hook's `setInterval` body with an SSE/WebSocket subscription or TanStack Query subscription.
3. Move `riskAccounts` to a paginated query against the Gold layer.
4. Keep `seedDecisions` / `seedLeads` only as Storybook fixtures.
