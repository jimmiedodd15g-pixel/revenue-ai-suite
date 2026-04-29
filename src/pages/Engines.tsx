import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Target, TrendingDown, Sparkles, DollarSign, PieChart, Activity, Zap, User } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";

const engines = [
  { id: "lead", name: "Lead Scoring", icon: Target, accuracy: 89.2, target: 88, latency: "412ms", calls: "12.4K/min", color: "chart-1", desc: "Ranks inbound leads by conversion likelihood." },
  { id: "churn", name: "Churn Prediction", icon: TrendingDown, accuracy: 86.4, target: 85, latency: "287ms", calls: "8.1K/min", color: "chart-2", desc: "Identifies at-risk accounts in real time." },
  { id: "upsell", name: "Upsell Propensity", icon: Sparkles, accuracy: 84.1, target: 82, latency: "356ms", calls: "5.7K/min", color: "chart-3", desc: "Surfaces best-fit expansion opportunities." },
  { id: "pricing", name: "Pricing Optimization", icon: DollarSign, accuracy: 91.6, target: 88, latency: "198ms", calls: "3.2K/min", color: "chart-4", desc: "Dynamic price elasticity per segment." },
  { id: "budget", name: "Budget Allocation", icon: PieChart, accuracy: 87.8, target: 85, latency: "521ms", calls: "1.8K/min", color: "chart-5", desc: "Reallocates spend across channels hourly." },
];

const tooltipStyle = {
  contentStyle: { background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" },
};

export default function Engines() {
  const [pulse, setPulse] = useState(0);
  useEffect(() => {
    const i = setInterval(() => setPulse((p) => (p + 1) % 5), 1200);
    return () => clearInterval(i);
  }, []);

  const trendData = Array.from({ length: 24 }, (_, i) => ({
    h: `${i}:00`,
    lead: 86 + Math.sin(i / 3) * 3 + Math.random() * 1.5,
    churn: 84 + Math.cos(i / 4) * 2 + Math.random() * 1.2,
    upsell: 82 + Math.sin(i / 5) * 2.5 + Math.random(),
  }));

  return (
    <AppLayout title="ML Engines" subtitle="AI Decision Engine Process Flow • 5 microservices">
      <div className="space-y-6">
        {/* Process Flow */}
        <SectionCard title="AI Decision Engine — Process Flow" description="Real-time event routing from ingestion to decision">
          <div className="relative py-8">
            <div className="flex items-center justify-between gap-2 overflow-x-auto">
              {/* Source */}
              <div className="flex flex-col items-center gap-2 min-w-[120px]">
                <div className="h-16 w-16 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-glow animate-pulse-glow">
                  <User className="h-7 w-7 text-accent-foreground" />
                </div>
                <span className="text-xs font-medium">Event Stream</span>
                <span className="text-[10px] text-muted-foreground">New Lead / Action</span>
              </div>

              <div className="flex-1 h-[2px] bg-gradient-to-r from-accent via-primary to-primary relative min-w-[40px]">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-glow to-transparent animate-flow" />
              </div>

              {/* Engines */}
              <div className="flex flex-col gap-3">
                {engines.map((e, i) => (
                  <div key={e.id} className="flex items-center gap-3">
                    <div className={cn(
                      "h-12 w-12 rounded-xl border flex items-center justify-center bg-card/80 transition-smooth",
                      pulse === i ? "border-primary shadow-glow scale-110" : "border-border"
                    )}>
                      <e.icon className={cn("h-5 w-5", pulse === i ? "text-primary" : "text-muted-foreground")} />
                    </div>
                    <div className="text-xs">
                      <div className="font-medium">{e.name}</div>
                      <div className="text-[10px] text-muted-foreground">{e.latency} • {e.calls}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex-1 h-[2px] bg-gradient-to-r from-primary to-success relative min-w-[40px]">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-success to-transparent animate-flow" />
              </div>

              {/* Decision */}
              <div className="flex flex-col items-center gap-2 min-w-[120px]">
                <div className="h-16 w-16 rounded-2xl bg-gradient-success flex items-center justify-center shadow-glow">
                  <Zap className="h-7 w-7 text-success-foreground" />
                </div>
                <span className="text-xs font-medium">Decision Output</span>
                <span className="text-[10px] text-muted-foreground">&lt;2s end-to-end</span>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Engine cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {engines.map((e) => {
            const above = e.accuracy > e.target;
            return (
              <div key={e.id} className="glass-card rounded-xl p-5 space-y-4 hover:shadow-elevated transition-smooth group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center border border-border">
                      <e.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">{e.name}</h3>
                      <p className="text-[11px] text-muted-foreground">{e.desc}</p>
                    </div>
                  </div>
                  <Badge className={cn(
                    "text-[10px]",
                    above ? "bg-success/15 text-success border border-success/30" : "bg-warning/15 text-warning border border-warning/30"
                  )}>
                    {above ? "ABOVE TGT" : "AT TARGET"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-muted-foreground">Accuracy</span>
                    <span className="text-2xl font-bold glow-text">{e.accuracy}%</span>
                  </div>
                  <Progress value={e.accuracy} className="h-1.5" />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Target: {e.target}%</span>
                    <span>Δ +{(e.accuracy - e.target).toFixed(1)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border/60">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Latency</div>
                    <div className="text-sm font-mono font-semibold">{e.latency}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Throughput</div>
                    <div className="text-sm font-mono font-semibold">{e.calls}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <SectionCard title="24h Accuracy Trend" description="Top 3 engines">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="h" stroke="hsl(var(--muted-foreground))" fontSize={10} interval={3} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={[78, 94]} />
              <Tooltip {...tooltipStyle} />
              <Line type="monotone" dataKey="lead" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} name="Lead Scoring" />
              <Line type="monotone" dataKey="churn" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} name="Churn" />
              <Line type="monotone" dataKey="upsell" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={false} name="Upsell" />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>
    </AppLayout>
  );
}
