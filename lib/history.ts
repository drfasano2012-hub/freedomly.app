"use client";

import type { FinancialMetrics } from "./types";

/** A point-in-time capture of the user's headline numbers. Stored locally,
 *  one row per calendar day (latest edit wins for the current day). */
export interface Snapshot {
  date: string; // YYYY-MM-DD (local)
  ts: number; // epoch ms of capture
  netWorth: number;
  totalInvestments: number;
  savingsRate: number; // 0–1
  healthScore: number; // 0–100
  freedomAge: number | null;
  freedomReached: boolean;
  monthlySurplus: number;
  emergencyFundMonths: number;
  totalDebt: number;
}

const HISTORY_KEY = "freedomly_history";
const MAX_ROWS = 365;

function todayStr(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function snapshotFromMetrics(m: FinancialMetrics): Snapshot {
  return {
    date: todayStr(),
    ts: Date.now(),
    netWorth: m.netWorth,
    totalInvestments: m.totalInvestments,
    savingsRate: m.savingsRate,
    healthScore: m.healthScore,
    freedomAge: m.freedomAge.freedomAge,
    freedomReached: m.freedomAge.status === "already_reached",
    monthlySurplus: m.monthlySurplus,
    emergencyFundMonths: m.emergencyFundMonths,
    totalDebt: m.totalDebt,
  };
}

export function readHistory(): Snapshot[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Snapshot[]) : [];
  } catch {
    return [];
  }
}

function writeHistory(rows: Snapshot[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(rows.slice(-MAX_ROWS)));
  } catch {
    /* ignore quota / serialization errors */
  }
}

/** Upsert today's snapshot (latest values win for the current day) and persist.
 *  Returns the updated history. Call AFTER computing progress so the baseline
 *  (most recent prior-day row) isn't overwritten by today's capture. */
export function recordSnapshot(m: FinancialMetrics): Snapshot[] {
  const rows = readHistory();
  const snap = snapshotFromMetrics(m);
  const last = rows[rows.length - 1];
  if (last && last.date === snap.date) {
    rows[rows.length - 1] = snap; // same day → replace
  } else {
    rows.push(snap);
  }
  writeHistory(rows);
  return rows;
}

export interface ProgressDelta {
  since: Snapshot; // baseline used for the comparison
  daysAgo: number;
  netWorth: number; // current − baseline
  totalInvestments: number;
  healthScore: number;
  savingsRate: number;
  freedomAgeYears: number | null; // current − baseline (negative = freedom is sooner)
}

/** Compare current metrics to the most recent snapshot from an EARLIER day. */
export function progressSince(
  history: Snapshot[],
  current: FinancialMetrics
): ProgressDelta | null {
  const today = todayStr();
  const baseline = [...history].reverse().find((s) => s.date < today);
  if (!baseline) return null;

  const freedomAgeYears =
    current.freedomAge.freedomAge !== null && baseline.freedomAge !== null
      ? current.freedomAge.freedomAge - baseline.freedomAge
      : null;

  const daysAgo = Math.max(
    1,
    Math.round((Date.now() - baseline.ts) / (1000 * 60 * 60 * 24))
  );

  return {
    since: baseline,
    daysAgo,
    netWorth: current.netWorth - baseline.netWorth,
    totalInvestments: current.totalInvestments - baseline.totalInvestments,
    healthScore: current.healthScore - baseline.healthScore,
    savingsRate: current.savingsRate - baseline.savingsRate,
    freedomAgeYears,
  };
}

// ─── Milestones ──────────────────────────────────────────────────────────────

export interface Milestone {
  id: string;
  label: string;
  blurb: string;
}

interface MilestoneDef extends Milestone {
  achieved: (m: FinancialMetrics) => boolean;
}

const MILESTONE_DEFS: MilestoneDef[] = [
  {
    id: "positive_net_worth",
    label: "Positive net worth",
    blurb: "Your assets now outweigh your debts — you're building, not digging.",
    achieved: (m) => m.netWorth > 0,
  },
  {
    id: "debt_free",
    label: "Debt-free",
    blurb: "No debt weighing you down — every dollar now works for you.",
    achieved: (m) => m.totalDebt === 0,
  },
  {
    id: "emergency_3mo",
    label: "3-month safety floor",
    blurb: "You can absorb a setback without derailing your plan.",
    achieved: (m) => m.emergencyFundMonths >= 3,
  },
  {
    id: "nw_10k",
    label: "$10K net worth",
    blurb: "The first big milestone — momentum is real now.",
    achieved: (m) => m.netWorth >= 10000,
  },
  {
    id: "invested_25k",
    label: "$25K invested",
    blurb: "Your investments are large enough that compounding starts to show.",
    achieved: (m) => m.totalInvestments >= 25000,
  },
  {
    id: "savings_rate_20",
    label: "20% savings rate",
    blurb: "You're on a genuine FI track — most people never get here.",
    achieved: (m) => m.savingsRate >= 0.2,
  },
  {
    id: "nw_100k",
    label: "$100K net worth",
    blurb: "The hardest $100K is behind you; the next ones come faster.",
    achieved: (m) => m.netWorth >= 100000,
  },
  {
    id: "invested_100k",
    label: "$100K invested",
    blurb: "Compounding is now doing heavy lifting alongside your contributions.",
    achieved: (m) => m.totalInvestments >= 100000,
  },
  {
    id: "freedom_reached",
    label: "Financial freedom",
    blurb: "Your investments can cover your living expenses. You're free.",
    achieved: (m) => m.freedomAge.status === "already_reached",
  },
];

/** Milestones the user has reached but had NOT reached at the baseline snapshot.
 *  Empty on the first-ever visit (no baseline) to avoid celebrating everything. */
export function newlyReachedMilestones(
  current: FinancialMetrics,
  baseline: Snapshot | null
): Milestone[] {
  if (!baseline) return [];
  return MILESTONE_DEFS.filter((def) => {
    if (!def.achieved(current)) return false;
    return !wasAchievedAt(def.id, baseline);
  }).map(({ id, label, blurb }) => ({ id, label, blurb }));
}

/** Evaluate a milestone against a stored snapshot's saved fields. */
function wasAchievedAt(id: string, s: Snapshot): boolean {
  switch (id) {
    case "positive_net_worth":
      return s.netWorth > 0;
    case "debt_free":
      return s.totalDebt === 0;
    case "emergency_3mo":
      return s.emergencyFundMonths >= 3;
    case "nw_10k":
      return s.netWorth >= 10000;
    case "invested_25k":
      return s.totalInvestments >= 25000;
    case "savings_rate_20":
      return s.savingsRate >= 0.2;
    case "nw_100k":
      return s.netWorth >= 100000;
    case "invested_100k":
      return s.totalInvestments >= 100000;
    case "freedom_reached":
      return s.freedomReached === true;
    default:
      return false;
  }
}
