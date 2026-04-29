import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { DollarSign, Users, TrendingDown, Target, Gauge, Zap } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const revenueData = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  baseline: 4.2 + i * 0.08,
  optimized: 4.2 + i * 0.18 + Math.random() * 0.1,
}));

const channelData = [
  { name: "Lead Conv.", value: 32, color: "hsl(var(--chart-1))" },
  { name: "Upsell", value: 28, color: "hsl(var(--chart-2))" },
  { name: "Retention", value: 24, color: "hsl(var(--chart-3))" },
  { name: "Pricing", value: 16, color: "hsl(var(--chart-4))" },
];

const tooltipStyle = {
  contentStyle: {
    background: "hsl(var(--popover))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "8px",
    fontSize: "12px",
  },
};

export default function Dashboard() {
  const [auto, setAuto] = useState(82.4);

  useEffect(() => {
    toast.success("Lead Scoring model exceeded target", {
      description: "Accuracy 89.2% • Target >88%",
      duration: 4000,
    });
    const t = setTimeout(() => {
      toast.success("Churn Prediction calibrated", {
        description: "Accuracy 86.4% • Target >85%",
      });
    }, 1800);
    const interval = setInterval(() => {
      setAuto((a) => Math.max(78, Math.min(90, a + (Math.random() - 0.5) * 0.4)));
    }, 2000);
    return () => { clearTimeout(t); clearInterval(interval); };
  }, []);

  return (
    <AppLayout title="Executive Dashboard" subtitle="Real-time revenue intelligence • IRGE Lakehouse v2.4">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Projected Revenue Lift" value="+11.8%" delta={2.4} icon={DollarSign} accent="primary" sublabel="Target 5–15% • $48.2M ARR" />
          <KpiCard label="Lead Conversion" value="34.7%" delta={6.1} icon={Users} accent="accent" sublabel="vs. 28.6% baseline" />
          <KpiCard label="Churn Reduction" value="-22.4%" delta={4.8} icon={TrendingDown} accent="success" sublabel="3,214 customers retained" />
          <KpiCard label="Marketing ROI" value="4.6×" delta={12.3} icon={Target} accent="warning" sublabel="Blended attribution" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SectionCard
            className="lg:col-span-2"
            title="Revenue Lift — Optimized vs. Baseline"
            description="12-month projection driven by AI decision engine"
            action={<Badge variant="outline" className="text-[10px] border-primary/40 text-primary">$M ARR</Badge>}
          >
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="opt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="base" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip {...tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="baseline" stroke="hsl(var(--muted-foreground))" fill="url(#base)" strokeWidth={2} />
                <Area type="monotone" dataKey="optimized" stroke="hsl(var(--primary))" fill="url(#opt)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </SectionCard>

          <SectionCard title="Decision Automation Rate" description="Target >80% • Live OCI stream">
            <div className="flex flex-col items-center justify-center py-4 space-y-3">
              <div className="relative h-44 w-44">
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" stroke="hsl(var(--secondary))" strokeWidth="10" fill="none" />
                  <circle
                    cx="50" cy="50" r="42"
                    stroke="url(#gaugeGrad)"
                    strokeWidth="10"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${(auto / 100) * 264} 264`}
                    style={{ transition: "stroke-dasharray 0.5s ease" }}
                  />
                  <defs>
                    <linearGradient id="gaugeGrad">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--accent))" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Gauge className="h-5 w-5 text-primary mb-1" />
                  <div className="text-4xl font-bold glow-text">{auto.toFixed(1)}%</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Automated</div>
                </div>
              </div>
              <Badge className="bg-success/15 text-success border border-success/30 hover:bg-success/20">
                <Zap className="h-3 w-3 mr-1" /> Above target
              </Badge>
            </div>
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SectionCard title="Revenue Contribution by Engine" description="Last 30 days" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={[
                { name: "Lead", v: 12.4 },
                { name: "Churn", v: 9.8 },
                { name: "Upsell", v: 14.2 },
                { name: "Pricing", v: 7.6 },
                { name: "Budget", v: 6.1 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="v" radius={[6, 6, 0, 0]}>
                  {[0,1,2,3,4].map((i) => (
                    <Cell key={i} fill={`hsl(var(--chart-${i+1}))`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>

          <SectionCard title="Revenue Mix" description="Decision-driven">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={channelData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3}>
                  {channelData.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {channelData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="ml-auto font-medium">{d.value}%</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </AppLayout>
  );
}
