import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Shield, Activity, Zap } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const signIn = (method: string) => {
    setLoading(true);
    setTimeout(() => {
      toast.success(`Authenticated via ${method}`);
      navigate("/dashboard");
    }, 700);
  };

  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute inset-0 bg-gradient-glow" />

      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 w-1/2 relative z-10 border-r border-border/60">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sm font-bold">IRGE Engine</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Revenue AI</div>
          </div>
        </div>

        <div className="space-y-6 max-w-md">
          <h1 className="text-4xl font-bold tracking-tight leading-tight">
            AI-Powered <span className="bg-gradient-accent bg-clip-text text-transparent">Revenue Optimization</span>
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Real-time decisions across Lead Scoring, Churn, Upsell, Pricing, and Budget Allocation —
            powered by a hybrid lakehouse on Oracle Cloud Infrastructure.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { i: Activity, k: "<2s", v: "Decision latency" },
              { i: Zap, k: ">80%", v: "Automation rate" },
              { i: Shield, k: "OAuth 2.0", v: "Microsoft SSO" },
            ].map((s) => (
              <div key={s.v} className="space-y-1.5">
                <s.i className="h-4 w-4 text-primary" />
                <div className="text-lg font-bold glow-text">{s.k}</div>
                <div className="text-[10px] text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-[11px] text-muted-foreground">© 2026 IRGE • Enterprise build v2.4.1</div>
      </div>

      {/* Right login */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-sm space-y-6 glass-card rounded-2xl p-8">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold">Sign in</h2>
            <p className="text-xs text-muted-foreground">Use your enterprise account to continue</p>
          </div>

          <Button
            onClick={() => signIn("Microsoft")}
            disabled={loading}
            className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow h-11"
          >
            <Shield className="h-4 w-4 mr-2" />
            Continue with Microsoft
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); signIn("Email"); }}
            className="space-y-3"
          >
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">Work email</Label>
              <Input id="email" type="email" placeholder="you@enterprise.com" required className="bg-secondary/50" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pw" className="text-xs">Password</Label>
              <Input id="pw" type="password" placeholder="••••••••" required className="bg-secondary/50" />
            </div>
            <Button type="submit" variant="outline" className="w-full" disabled={loading}>
              Sign in with email
            </Button>
          </form>

          <p className="text-[10px] text-center text-muted-foreground">
            Protected by OAuth 2.0 • SOC 2 Type II
          </p>
        </div>
      </div>
    </div>
  );
}
