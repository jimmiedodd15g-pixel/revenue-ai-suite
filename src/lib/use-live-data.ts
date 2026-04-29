import { useEffect, useState } from "react";
import { Decision, generateDecision, seedDecisions, generateLead, seedLeads, LeadEvent, liveCounters } from "./mock-data";

export function useLiveDecisions(intervalMs = 4000) {
  const [decisions, setDecisions] = useState<Decision[]>(seedDecisions);
  useEffect(() => {
    const i = setInterval(() => {
      setDecisions((prev) => [generateDecision(), ...prev].slice(0, 25));
    }, intervalMs);
    return () => clearInterval(i);
  }, [intervalMs]);
  return decisions;
}

export function useLiveLeads(intervalMs = 3500) {
  const [leads, setLeads] = useState<LeadEvent[]>(seedLeads);
  useEffect(() => {
    const i = setInterval(() => {
      setLeads((prev) => [generateLead(), ...prev].slice(0, 15));
    }, intervalMs);
    return () => clearInterval(i);
  }, [intervalMs]);
  return leads;
}

export function useLiveCounters(intervalMs = 2500) {
  const [counters, setCounters] = useState(liveCounters);
  useEffect(() => {
    const i = setInterval(() => {
      setCounters((c) => ({
        leadsScoredToday: c.leadsScoredToday + Math.floor(Math.random() * 14 + 2),
        decisionsExecutedToday: c.decisionsExecutedToday + Math.floor(Math.random() * 9 + 1),
        revenueLiftToday: c.revenueLiftToday + Math.floor(Math.random() * 1800 + 200),
        accountsRetained: c.accountsRetained + (Math.random() > 0.85 ? 1 : 0),
      }));
    }, intervalMs);
    return () => clearInterval(i);
  }, [intervalMs]);
  return counters;
}
