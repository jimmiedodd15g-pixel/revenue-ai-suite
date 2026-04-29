import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="h-16 shrink-0 border-b border-border/60 bg-background/60 backdrop-blur-xl flex items-center justify-between px-6 gap-4">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search models, leads, signals..."
            className="pl-9 h-9 w-72 bg-secondary/50 border-border/60 text-xs"
          />
        </div>
        <Badge variant="outline" className="border-success/40 text-success bg-success/10 gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          Real-time
        </Badge>
        <Button size="icon" variant="ghost" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
        </Button>
        <div className="h-9 w-9 rounded-full bg-gradient-accent flex items-center justify-center">
          <User className="h-4 w-4 text-accent-foreground" />
        </div>
      </div>
    </header>
  );
}
