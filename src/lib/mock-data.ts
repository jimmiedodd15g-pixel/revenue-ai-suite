// Centralized mock data for the IRGE dashboard.
// This simulates streams that would normally come from the OCI lakehouse REST API.

export type Decision = {
  id: string;
  ts: string;
  account: string;
  engine: "Lead" | "Churn" | "Upsell" | "Pricing" | "Budget";
  action: string;
  confidence: number;
  impact: number; // $ revenue impact
  status: "executed" | "queued" | "review";
};

export type RiskAccount = {
  id: string;
  name: string;
  segment: "Enterprise" | "Mid-Market" | "SMB";
  pqScore: number;
  arr: number;
  risk: "Critical" | "High" | "Medium" | "Low" | "Very Low";
  topDriver: string;
  csm: string;
};

export type LeadEvent = {
  id: string;
  source: string;
  score: number;
  ts: string;
  region: string;
  vertical: string;
};

const accounts = [
  "Aperture Labs", "Initech", "Wonka Industries", "Stark Industries", "Wayne Enterprises",
  "Cyberdyne Systems", "Tyrell Corp", "Globex Inc", "Hooli", "Pied Piper",
  "Massive Dynamic", "Soylent Corp", "Umbrella Holdings", "Acme Co", "Vandelay Imports",
];

const csms = ["A. Singh", "M. Garcia", "J. Park", "L. Müller", "R. Tanaka", "S. Okafor"];

let decisionCounter = 1000;
export function generateDecision(): Decision {
  decisionCounter++;
  const engines: Decision["engine"][] = ["Lead", "Churn", "Upsell", "Pricing", "Budget"];
  const engine = engines[Math.floor(Math.random() * engines.length)];
  const actionMap: Record<Decision["engine"], string[]> = {
    Lead: ["Route to AE", "Add to nurture", "Promote to SQL", "Trigger outreach"],
    Churn: ["Schedule QBR", "Discount offer", "Escalate to CSM", "Send retention kit"],
    Upsell: ["Pitch Tier 2", "Suggest add-on", "Bundle proposal", "Volume discount"],
    Pricing: ["Hold list price", "Apply -3% bracket", "Promote annual plan", "Custom quote"],
    Budget: ["Shift to LinkedIn", "Pause Display", "Scale Search +12%", "Reallocate to ABM"],
  };
  const actions = actionMap[engine];
  const confidence = 0.62 + Math.random() * 0.36;
  const status: Decision["status"] =
    confidence >= 0.85 ? "executed" : confidence >= 0.75 ? "queued" : "review";
  return {
    id: `DEC-${decisionCounter}`,
    ts: new Date().toISOString(),
    account: accounts[Math.floor(Math.random() * accounts.length)],
    engine,
    action: actions[Math.floor(Math.random() * actions.length)],
    confidence,
    impact: Math.round((Math.random() * 48000 + 1200) * 100) / 100,
    status,
  };
}

export const seedDecisions: Decision[] = Array.from({ length: 18 }, (_, i) => {
  const d = generateDecision();
  return { ...d, ts: new Date(Date.now() - i * 18_000).toISOString() };
});

export const riskAccounts: RiskAccount[] = [
  { id: "ACC-2041", name: "Aperture Labs", segment: "Enterprise", pqScore: 0.91, arr: 480_000, risk: "Critical", topDriver: "Credit Score", csm: "A. Singh" },
  { id: "ACC-1187", name: "Initech",       segment: "Mid-Market", pqScore: 0.84, arr: 142_000, risk: "High",     topDriver: "Engagement History", csm: "M. Garcia" },
  { id: "ACC-3320", name: "Wonka Industries", segment: "Enterprise", pqScore: 0.78, arr: 612_000, risk: "High",  topDriver: "Support Ticket Volume", csm: "J. Park" },
  { id: "ACC-0921", name: "Globex Inc",    segment: "Mid-Market", pqScore: 0.66, arr: 88_000,  risk: "Medium",   topDriver: "Transaction Frequency", csm: "L. Müller" },
  { id: "ACC-4412", name: "Pied Piper",    segment: "SMB",        pqScore: 0.54, arr: 24_000,  risk: "Medium",   topDriver: "Product Usage", csm: "R. Tanaka" },
  { id: "ACC-5501", name: "Hooli",         segment: "Enterprise", pqScore: 0.42, arr: 920_000, risk: "Low",      topDriver: "Engagement History", csm: "S. Okafor" },
  { id: "ACC-7733", name: "Stark Industries", segment: "Enterprise", pqScore: 0.31, arr: 1_240_000, risk: "Low", topDriver: "Credit Score", csm: "A. Singh" },
  { id: "ACC-8841", name: "Acme Co",       segment: "SMB",        pqScore: 0.18, arr: 16_500,  risk: "Very Low", topDriver: "Product Usage", csm: "M. Garcia" },
];

const sources = ["Webinar", "Demo Request", "Content DL", "Partner Referral", "Cold Outbound", "Paid Search"];
const regions = ["NA-East", "NA-West", "EMEA", "APAC", "LATAM"];
const verticals = ["FinServ", "Healthcare", "Retail", "Manufacturing", "Tech"];

export function generateLead(): LeadEvent {
  return {
    id: `LD-${Math.floor(Math.random() * 90000 + 10000)}`,
    source: sources[Math.floor(Math.random() * sources.length)],
    score: Math.round((40 + Math.random() * 58) * 10) / 10,
    ts: new Date().toISOString(),
    region: regions[Math.floor(Math.random() * regions.length)],
    vertical: verticals[Math.floor(Math.random() * verticals.length)],
  };
}

export const seedLeads: LeadEvent[] = Array.from({ length: 12 }, () => generateLead());

// Used by the dashboard "live counters"
export const liveCounters = {
  leadsScoredToday: 28_412,
  decisionsExecutedToday: 19_847,
  revenueLiftToday: 312_480, // $
  accountsRetained: 84,
};
