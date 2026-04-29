import { AppLayout } from "@/components/layout/AppLayout";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Cloud, Activity, Shield, KeyRound, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const sources = [
  { name: "OCI Lakehouse — Bronze", status: "healthy", latency: "78ms", records: "2.4B" },
  { name: "OCI Lakehouse — Silver", status: "healthy", latency: "112ms", records: "1.8B" },
  { name: "OCI Lakehouse — Gold", status: "healthy", latency: "94ms", records: "412M" },
  { name: "IRGE Scanner Stream", status: "healthy", latency: "412ms", records: "12.4K/s" },
  { name: "Salesforce CDC", status: "warning", latency: "1.8s", records: "892K" },
];

export default function Settings() {
  return (
    <AppLayout title="Settings" subtitle="API configuration & data source health">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SectionCard title="REST API Configuration" description="OCI endpoint • Decision Engine v2.4" action={<Badge className="bg-success/15 text-success border border-success/30">Connected</Badge>}>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">API Base URL</Label>
                <Input defaultValue="https://decisions.irge.oci.oraclecloud.com/v2" className="font-mono text-xs bg-secondary/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Region</Label>
                  <Input defaultValue="us-ashburn-1" className="text-xs bg-secondary/50" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Tenancy OCID</Label>
                  <Input defaultValue="ocid1.tenancy.oc1..irge-prod" className="font-mono text-xs bg-secondary/50" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs flex items-center gap-1.5"><KeyRound className="h-3 w-3" /> API Key</Label>
                <Input type="password" defaultValue="•••••••••••••••••••••••••••" className="font-mono text-xs bg-secondary/50" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">Test Connection</Button>
                <Button size="sm" className="bg-gradient-primary text-primary-foreground" onClick={() => toast.success("API configuration saved")}>Save Changes</Button>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Data Source Status" description="IRGE Scanner integration health">
            <div className="space-y-2">
              {sources.map((s) => (
                <div key={s.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 border border-border/60 hover:border-primary/30 transition-smooth">
                  <div className="flex items-center gap-3">
                    {s.status === "healthy" ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-warning" />
                    )}
                    <div>
                      <div className="text-sm font-medium">{s.name}</div>
                      <div className="text-[11px] text-muted-foreground">{s.records} records</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-muted-foreground">{s.latency}</span>
                    <Badge variant="outline" className={s.status === "healthy" ? "border-success/40 text-success bg-success/10" : "border-warning/40 text-warning bg-warning/10"}>
                      {s.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Decision Engine Preferences" description="Behavior of the automated decisioning layer">
            <div className="space-y-4">
              {[
                { label: "Auto-execute decisions ≥ 0.85 confidence", desc: "Bypasses human review queue", on: true },
                { label: "Real-time event streaming", desc: "Sub-2s end-to-end latency target", on: true },
                { label: "Shapley explainability log", desc: "Persist top-5 features per decision", on: true },
                { label: "Shadow mode for new models", desc: "Run challenger models silently for 7 days", on: false },
              ].map((p) => (
                <div key={p.label} className="flex items-center justify-between gap-4 p-3 rounded-lg border border-border/60">
                  <div>
                    <div className="text-sm font-medium">{p.label}</div>
                    <div className="text-[11px] text-muted-foreground">{p.desc}</div>
                  </div>
                  <Switch defaultChecked={p.on} />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Authentication" description="OAuth 2.0 — Microsoft compatible">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/40 border border-border/60">
                <div className="h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <Shield className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-xs font-medium">Microsoft Entra ID</div>
                  <div className="text-[10px] text-muted-foreground">SSO • MFA enforced</div>
                </div>
                <Badge className="ml-auto bg-success/15 text-success border border-success/30">Active</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full">Manage SSO</Button>
            </div>
          </SectionCard>

          <SectionCard title="Performance Targets" description="SLA for the Decision Engine">
            <div className="space-y-3 text-xs">
              {[
                { icon: Activity, k: "End-to-end latency", v: "< 2s", actual: "1.2s" },
                { icon: Database, k: "Lakehouse refresh", v: "< 5min", actual: "2.4min" },
                { icon: Cloud, k: "API uptime", v: "99.95%", actual: "99.98%" },
              ].map((t) => (
                <div key={t.k} className="flex items-center gap-3">
                  <t.icon className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground flex-1">{t.k}</span>
                  <span className="font-mono">{t.actual}</span>
                  <Badge variant="outline" className="border-success/40 text-success bg-success/10 text-[10px]">{t.v}</Badge>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </AppLayout>
  );
}
