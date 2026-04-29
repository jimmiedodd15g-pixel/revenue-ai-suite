import { AppLayout } from "@/components/layout/AppLayout";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";
import { riskAccounts } from "@/lib/mock-data";

const riskColor: Record<string, string> = {
  Critical: "bg-destructive/15 text-destructive border-destructive/40",
  High: "bg-chart-5/15 text-chart-5 border-chart-5/40",
  Medium: "bg-warning/15 text-warning border-warning/40",
  Low: "bg-chart-1/15 text-chart-1 border-chart-1/40",
  "Very Low": "bg-success/15 text-success border-success/40",
};

const shapley = [
  { feature: "Credit Score", value: 0.67 },
  { feature: "Engagement History", value: 0.34 },
  { feature: "Transaction Frequency", value: 0.28 },
  { feature: "Support Ticket Volume", value: 0.21 },
  { feature: "Product Usage", value: 0.18 },
];

// 5x5 matrix: rows = likelihood (low->high), cols = impact (low->high)
const matrix = [
  [2, 4, 8, 12, 18],
  [3, 6, 12, 20, 28],
  [5, 10, 18, 32, 45],
  [4, 8, 16, 28, 38],
  [2, 5, 9, 14, 22],
];
const labels = ["Very Low", "Low", "Medium", "High", "Critical"];

const distribution = [
  { name: "Critical", value: 12, color: "hsl(var(--destructive))" },
  { name: "High", value: 38, color: "hsl(var(--chart-5))" },
  { name: "Medium", value: 124, color: "hsl(var(--warning))" },
  { name: "Low", value: 286, color: "hsl(var(--chart-1))" },
  { name: "Very Low", value: 412, color: "hsl(var(--success))" },
];

const tooltipStyle = {
  contentStyle: { background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" },
};

function cellColor(v: number) {
  if (v >= 30) return "bg-destructive/70 text-destructive-foreground border-destructive";
  if (v >= 18) return "bg-chart-5/60 text-foreground border-chart-5/70";
  if (v >= 10) return "bg-warning/50 text-warning-foreground border-warning/70";
  if (v >= 5) return "bg-chart-1/30 text-foreground border-chart-1/50";
  return "bg-success/20 text-foreground border-success/40";
}

export default function RiskAnalysis() {
  return (
    <AppLayout title="Risk Analysis" subtitle="Shapley Value-based Predictive Quality (PQ) Scoring">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SectionCard
            title="Risk Assessment Matrix"
            description="Likelihood × Impact • Account count per cell"
            className="lg:col-span-2"
            action={<Badge variant="outline" className="border-primary/40 text-primary">PQ Weighted</Badge>}
          >
            <div className="overflow-x-auto">
              <div className="min-w-[480px]">
                <div className="flex items-center mb-2 ml-20">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Impact →</span>
                </div>
                <div className="grid grid-cols-[80px_repeat(5,1fr)] gap-1.5">
                  <div />
                  {labels.map((l) => (
                    <div key={l} className="text-[10px] text-center text-muted-foreground font-medium">{l}</div>
                  ))}
                  {matrix.map((row, ri) => (
                    <div key={`row-${ri}`} className="contents">
                      <div className="text-[10px] text-right pr-2 self-center text-muted-foreground font-medium">
                        {labels[4 - ri]}
                      </div>
                      {row.map((v, ci) => (
                        <div
                          key={`${ri}-${ci}`}
                          className={cn(
                            "aspect-square rounded-lg border flex items-center justify-center text-sm font-bold transition-smooth hover:scale-105 cursor-pointer",
                            cellColor(v)
                          )}
                        >
                          {v}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-2 -rotate-90 origin-left absolute" style={{ display: "none" }}>
                  Likelihood
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-border/60 text-[10px]">
              <span className="text-muted-foreground">Severity:</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-success/40" /> Low</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-warning/60" /> Medium</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-chart-5/70" /> High</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-destructive/80" /> Critical</span>
            </div>
          </SectionCard>

          <SectionCard title="Risk Priority Distribution" description="872 active accounts scored">
            <div className="space-y-3">
              {distribution.map((d) => {
                const total = distribution.reduce((s, x) => s + x.value, 0);
                const pct = (d.value / total) * 100;
                return (
                  <div key={d.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
                        {d.name}
                      </span>
                      <span className="font-mono text-muted-foreground">{d.value} • {pct.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: d.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>

        <SectionCard
          title="Shapley Feature Importance"
          description="Top 5 predictors driving the PQ score"
          action={<Badge variant="outline" className="border-accent/40 text-accent">SHAP v3.1</Badge>}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={shapley} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} horizontal={false} />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} domain={[0, 0.75]} />
              <YAxis dataKey="feature" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={150} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {shapley.map((_, i) => (
                  <Cell key={i} fill={`hsl(var(--chart-${i + 1}))`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-3 border-t border-border/60">
            {shapley.map((s, i) => (
              <div key={s.feature} className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.feature}</div>
                <div className="text-lg font-bold font-mono" style={{ color: `hsl(var(--chart-${i + 1}))` }}>
                  {s.value.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Top Risk Accounts"
          description="Ranked by Shapley-weighted PQ Score"
          action={<Badge variant="outline" className="border-warning/40 text-warning">{riskAccounts.length} accounts</Badge>}
        >
          <div className="overflow-x-auto -mx-5">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/60">
                  <th className="text-left font-medium py-2 px-5">Account</th>
                  <th className="text-left font-medium py-2">Segment</th>
                  <th className="text-right font-medium py-2">ARR</th>
                  <th className="text-right font-medium py-2">PQ Score</th>
                  <th className="text-left font-medium py-2 pl-4">Top Driver</th>
                  <th className="text-left font-medium py-2">CSM</th>
                  <th className="text-right font-medium py-2 px-5">Risk</th>
                </tr>
              </thead>
              <tbody>
                {riskAccounts.map((a) => (
                  <tr key={a.id} className="border-b border-border/30 hover:bg-secondary/30 transition-smooth">
                    <td className="py-2.5 px-5">
                      <div className="font-medium">{a.name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{a.id}</div>
                    </td>
                    <td className="py-2.5 text-muted-foreground">{a.segment}</td>
                    <td className="py-2.5 text-right font-mono tabular-nums">
                      ${(a.arr / 1000).toFixed(0)}K
                    </td>
                    <td className="py-2.5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-success via-warning to-destructive"
                            style={{ width: `${a.pqScore * 100}%` }}
                          />
                        </div>
                        <span className="font-mono tabular-nums w-10">{a.pqScore.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="py-2.5 pl-4 text-muted-foreground">{a.topDriver}</td>
                    <td className="py-2.5">{a.csm}</td>
                    <td className="py-2.5 px-5 text-right">
                      <Badge variant="outline" className={cn("text-[10px]", riskColor[a.risk])}>
                        {a.risk}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </AppLayout>
  );
}
