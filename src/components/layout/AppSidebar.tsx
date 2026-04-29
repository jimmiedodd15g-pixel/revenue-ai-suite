import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Cpu, ShieldAlert, Settings, Activity, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { title: "Executive Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "ML Engines", url: "/engines", icon: Cpu },
  { title: "Risk Analysis", url: "/risk-analysis", icon: ShieldAlert },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/80 backdrop-blur-xl">
      <div className="h-16 flex items-center gap-3 px-6 border-b border-sidebar-border">
        <div className="relative">
          <div className="h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-foreground">IRGE Engine</span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Revenue AI</span>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {items.map((item) => {
          const active = location.pathname === item.url;
          return (
            <NavLink
              key={item.url}
              to={item.url}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground border border-primary/30 shadow-glow"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={cn("h-4 w-4", active && "text-primary")} />
              {item.title}
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />}
            </NavLink>
          );
        })}
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <div className="rounded-lg border border-border/60 bg-card/50 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Activity className="h-3.5 w-3.5 text-success" />
            <span className="text-xs font-medium">System Status</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">OCI Lakehouse</span>
            <span className="flex items-center gap-1 text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Live
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">Latency</span>
            <span className="text-foreground font-mono">1.2s</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
