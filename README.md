# AI-Powered Revenue Optimization System (IRGE Extension)

A high-performance enterprise dashboard and decision engine UI built on a hybrid lakehouse architecture. The system visualizes real-time, revenue-driving decisions across **lead scoring, churn, upsell, pricing, and budget allocation**, with a target end-to-end latency of **<2s**.

> Aesthetic: dark "Enterprise AI" theme — glassmorphism, gradient accents, data-dense layouts inspired by Bloomberg / Palantir / OpenAI consoles.

---

## ✨ Features

### 🔐 Authentication
- Email + password **Sign In** and **Sign Up** flows with Zod validation
- Password complexity rules (min 8 chars, uppercase, number) and confirmation matching
- Mock **Microsoft Entra ID (SSO)** integration

### 📊 Pages

| Route | Purpose |
|---|---|
| `/` | Login / Sign-up with Microsoft SSO |
| `/dashboard` | Executive KPIs, Revenue Lift charts, live decision stream |
| `/engines` | Deep dive into the 5 ML microservices and their performance |
| `/risk-analysis` | Shapley-weighted risk matrix, feature importance, top risk accounts |
| `/settings` | OCI API config, OAuth status, lakehouse source health |

### 🤖 5 ML Microservices Visualized
1. **Lead Scoring** (target accuracy >88%)
2. **Churn Prediction** (target >85%)
3. **Upsell / Cross-sell**
4. **Dynamic Pricing**
5. **Budget Allocation**

### 📡 Real-Time Mock Data Layer
- `src/lib/mock-data.ts` — entity types (`Decision`, `RiskAccount`, `LeadEvent`)
- `src/lib/use-live-data.ts` — `useLiveDecisions`, `useLiveLeads`, `useLiveCounters` hooks simulate the OCI lakehouse stream
- Live counters update every ~2.5s (Leads Scored, Revenue Lift, Decisions/sec, etc.)

### 🎨 Design System
- Custom **Enterprise Dark** theme in `src/index.css` and `tailwind.config.ts`
- Semantic HSL tokens: `--primary`, `--primary-glow`, `--success`, `--warning`, etc.
- Reusable utilities: `glass-card`, `gradient-primary`, `shadow-glow`, `transition-smooth`
- Shared components: `KpiCard`, `SectionCard`, `AppLayout`, `AppSidebar`, `TopBar`

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│  OCI Lakehouse (Bronze → Silver → Gold)             │
│  + IRGE Scanner Stream + Salesforce CDC             │
└────────────────────┬────────────────────────────────┘
                     │  (mocked via use-live-data)
                     ▼
┌─────────────────────────────────────────────────────┐
│  Decision Engine v2.4 — 5 ML Microservices          │
│  Shapley explainability • <2s latency               │
└────────────────────┬────────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────────┐
│  React Dashboard (this repo)                        │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

- **React 18** + **TypeScript** + **Vite 5**
- **Tailwind CSS v3** + **shadcn/ui** + **Radix UI**
- **React Router v6**
- **Recharts** for data visualization
- **React Hook Form** + **Zod** for forms & validation
- **TanStack Query** for async state
- **Sonner** for toast notifications
- **Lucide** icons
- **Vitest** + Testing Library for tests

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
│   ├── dashboard/      # KpiCard, SectionCard
│   ├── layout/         # AppLayout, AppSidebar, TopBar
│   └── ui/             # shadcn primitives
├── lib/
│   ├── mock-data.ts    # Entity types + generators
│   ├── use-live-data.ts# Real-time simulation hooks
│   └── utils.ts
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Engines.tsx
│   ├── RiskAnalysis.tsx
│   └── Settings.tsx
├── index.css           # Design tokens (HSL)
└── App.tsx             # Routes
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
