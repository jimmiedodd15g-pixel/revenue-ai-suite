import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  delta?: number;
  icon: LucideIcon;
  accent?: "primary" | "accent" | "success" | "warning";
  sublabel?: string;
}

const accentMap = {
  primary: "from-primary/20 to-transparent border-primary/30 text-primary",
  accent: "from-accent/20 to-transparent border-accent/30 text-accent",
  success: "from-success/20 to-transparent border-success/30 text-success",
  warning: "from-warning/20 to-transparent border-warning/30 text-warning",
};

export function KpiCard({ label, value, delta, icon: Icon, accent = "primary", sublabel }: KpiCardProps) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="glass-card rounded-xl p-5 relative overflow-hidden group hover:shadow-elevated transition-smooth">
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60", accentMap[accent].split(" ").slice(0, 2).join(" "))} />
      <div className="relative space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</span>
          <div className={cn("h-8 w-8 rounded-lg border flex items-center justify-center", accentMap[accent].split(" ").slice(2).join(" "), "bg-card/60")}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-bold tracking-tight glow-text">{value}</div>
            {sublabel && <div className="text-[11px] text-muted-foreground mt-0.5">{sublabel}</div>}
          </div>
          {delta !== undefined && (
            <div className={cn("flex items-center gap-1 text-xs font-semibold", positive ? "text-success" : "text-destructive")}>
              {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {positive ? "+" : ""}{delta}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
