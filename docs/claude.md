# Claude / AI Agent Interaction Notes

> This file is the prompting playbook used while building the IRGE Extension with the Lovable AI agent (Claude Sonnet under the hood). It captures rules, patterns that worked, and anti-patterns to avoid.

## 1. Agent rules (system-level guidance given to the AI)

1. **Always use semantic design tokens** from `src/index.css` and `tailwind.config.ts`. Never raw Tailwind colors (`text-white`, `bg-black`) in components.
2. **Touch only the files I name.** Do not regenerate unrelated pages or components.
3. **Prefer `code--line_replace` over full file rewrites** for edits.
4. **Type everything.** All entities live in `src/lib/mock-data.ts`; reuse them.
5. **No backend code** unless I explicitly enable Lovable Cloud.
6. **Verify visually** after UI changes (preview, screenshot, or console).
7. **Be concise** in chat — code and screenshots over prose.

## 2. Prompting patterns that worked

### 2.1 Concrete acceptance criteria
> "Add a `KpiCard` showing Lead Scoring accuracy. Props: `label`, `value`, `target`, `trend`. Color the value `text-success` when value ≥ target, `text-warning` otherwise."

✅ First-try success. The AI knew exactly what success looked like.

### 2.2 Anchor to existing files
> "Look at `Dashboard.tsx`. Add a new section *below* the live counter strip that reuses `SectionCard` and renders `useLiveDecisions()` in a table."

✅ Avoided duplicate components, kept the design language consistent.

### 2.3 Provide the type first
> "Given `type Decision = {...}`, build a `<DecisionRow decision={...} />` component."

✅ Eliminated guessing about field names.

### 2.4 Reference brands for aesthetics
> "Make this feel like Bloomberg Terminal × Palantir Foundry — dense, dark, glassmorphic, gradient accents."

✅ Far better than "make it look professional".

### 2.5 Atomic scope
> "Only edit `src/pages/RiskAnalysis.tsx`. Do not touch any other file."

✅ Prevented churn on stable code.

## 3. Prompting patterns that failed

### 3.1 Vague mega-prompts
> "Build the whole dashboard with all 5 engines and risk and settings."

❌ Produced shallow stubs everywhere. Splitting per page worked far better.

### 3.2 Underspecified "real-time"
> "Make it real-time."

❌ Got `setInterval` every time. Should have specified SSE / WebSocket / polling cadence.

### 3.3 Letting the AI invent metrics
> "Pick reasonable accuracy targets for each model."

❌ Got hallucinated numbers (e.g., 94.3% for everything). Better: provide the numbers explicitly.

### 3.4 "Make it better"
❌ Useless without a delta. Always specify *what* better means (faster, denser, more contrast, fewer clicks).

## 4. Bugs the AI introduced (and how they were caught)

| Bug | Cause | Fix |
|---|---|---|
| Risk matrix columns collapsed | `<>...</>` fragment inside CSS Grid | Replace with `<div className="contents">` |
| Counters reset on each tick | Object spread dropped a key | Spread first, then override specific keys |
| Login form accepted empty password | Zod schema missing `.min(1)` chain | Tightened schema |
| Recharts tooltip white-on-white | Default tooltip ignored theme | Custom `<Tooltip content={...}>` using HSL tokens |

## 5. Anti-patterns to avoid

- ❌ Asking for 5 pages in one prompt
- ❌ Trusting AI-supplied numbers / metrics without source
- ❌ Skipping a re-read of the diff before accepting
- ❌ Letting AI pick the chart library without comparison
- ❌ Allowing raw Tailwind colors to slip into components
- ❌ Using `setInterval` without cleanup (`return () => clearInterval(...)`)

## 6. Workflow that worked

1. **Sketch → Spec.** Write 5–10 lines of acceptance criteria before prompting.
2. **Scope narrowly.** One file or one feature per prompt.
3. **Read the diff.** Always.
4. **Verify visually.** Open the preview; screenshot if responsive.
5. **Commit small.** Easier to roll back when the AI introduces drift.
6. **Document as you go.** This file, `architecture.md`, and `security.md` are AI-cheap and human-valuable.

## 7. Model selection notes

- **Code generation + refactoring:** Claude Sonnet (via Lovable) — best balance of speed and adherence to instructions.
- **Architecture / debate:** Claude Opus or GPT-4-class — better at pushing back.
- **Inline completions:** Copilot / Cursor tab — fastest for micro-edits.
- **Visual generation:** not used in this project (no generated imagery).

## 8. Open questions for next iteration

- Should the agent be given a persistent `mem://` of the design tokens to prevent drift?
- Can we automate the "verify visually" step with screenshot diffs?
- Is there a structured prompt template that would reduce mega-prompt failure mode?
