import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Shield, Activity, Zap, Loader2 } from "lucide-react";
import { toast } from "sonner";

const signInSchema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(8, "At least 8 characters").max(128),
});

const signUpSchema = z
  .object({
    name: z.string().trim().min(2, "Name is too short").max(100),
    company: z.string().trim().min(2, "Company is required").max(100),
    email: z.string().trim().email("Invalid email").max(255),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .max(128)
      .regex(/[A-Z]/, "Include an uppercase letter")
      .regex(/[0-9]/, "Include a number"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const ssoSignIn = (method: string) => {
    setLoading(true);
    setTimeout(() => {
      toast.success(`Authenticated via ${method}`);
      navigate("/dashboard");
    }, 700);
  };

  const handleSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const result = signInSchema.safeParse({
      email: form.get("email"),
      password: form.get("password"),
    });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        if (i.path[0]) fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      toast.success("Welcome back", { description: result.data.email });
      navigate("/dashboard");
    }, 700);
  };

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const result = signUpSchema.safeParse({
      name: form.get("name"),
      company: form.get("company"),
      email: form.get("email"),
      password: form.get("password"),
      confirm: form.get("confirm"),
    });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        if (i.path[0]) fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      toast.success("Account created", { description: `Welcome, ${result.data.name}` });
      navigate("/dashboard");
    }, 900);
  };

  const FieldError = ({ name }: { name: string }) =>
    errors[name] ? <p className="text-[10px] text-destructive mt-1">{errors[name]}</p> : null;

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
            AI-Powered{" "}
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              Revenue Optimization
            </span>
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

      {/* Right auth panel */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-sm space-y-5 glass-card rounded-2xl p-7">
          <div className="space-y-1 text-center">
            <h2 className="text-2xl font-bold">{tab === "signin" ? "Sign in" : "Create account"}</h2>
            <p className="text-xs text-muted-foreground">
              {tab === "signin" ? "Use your enterprise account to continue" : "Start your IRGE trial in seconds"}
            </p>
          </div>

          <Button
            onClick={() => ssoSignIn("Microsoft")}
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

          <Tabs value={tab} onValueChange={(v) => { setTab(v as typeof tab); setErrors({}); }}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-4">
              <form onSubmit={handleSignIn} className="space-y-3" noValidate>
                <div className="space-y-1.5">
                  <Label htmlFor="si-email" className="text-xs">Work email</Label>
                  <Input id="si-email" name="email" type="email" placeholder="you@enterprise.com" maxLength={255} className="bg-secondary/50" />
                  <FieldError name="email" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="si-pw" className="text-xs">Password</Label>
                  <Input id="si-pw" name="password" type="password" placeholder="••••••••" maxLength={128} className="bg-secondary/50" />
                  <FieldError name="password" />
                </div>
                <Button type="submit" variant="outline" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />}
                  Sign in with email
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-4">
              <form onSubmit={handleSignUp} className="space-y-3" noValidate>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="su-name" className="text-xs">Full name</Label>
                    <Input id="su-name" name="name" maxLength={100} placeholder="Jane Doe" className="bg-secondary/50" />
                    <FieldError name="name" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="su-company" className="text-xs">Company</Label>
                    <Input id="su-company" name="company" maxLength={100} placeholder="Acme" className="bg-secondary/50" />
                    <FieldError name="company" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="su-email" className="text-xs">Work email</Label>
                  <Input id="su-email" name="email" type="email" maxLength={255} placeholder="you@enterprise.com" className="bg-secondary/50" />
                  <FieldError name="email" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="su-pw" className="text-xs">Password</Label>
                  <Input id="su-pw" name="password" type="password" maxLength={128} placeholder="8+ chars, 1 number" className="bg-secondary/50" />
                  <FieldError name="password" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="su-confirm" className="text-xs">Confirm password</Label>
                  <Input id="su-confirm" name="confirm" type="password" maxLength={128} placeholder="Re-enter password" className="bg-secondary/50" />
                  <FieldError name="confirm" />
                </div>
                <Button type="submit" className="w-full bg-gradient-accent text-accent-foreground hover:opacity-90" disabled={loading}>
                  {loading && <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />}
                  Create account
                </Button>
                <p className="text-[10px] text-center text-muted-foreground">
                  By signing up you agree to the Terms & Privacy Policy.
                </p>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-[10px] text-center text-muted-foreground">
            Protected by OAuth 2.0 • SOC 2 Type II
          </p>
        </div>
      </div>
    </div>
  );
}
