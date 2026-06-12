"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Minus, PartyPopper, X } from "lucide-react";
import { formatCurrency } from "@/lib/calculations";
import {
  readHistory,
  recordSnapshot,
  progressSince,
  newlyReachedMilestones,
  type ProgressDelta,
  type Milestone,
} from "@/lib/history";
import { track } from "@/lib/analytics";
import type { FinancialMetrics } from "@/lib/types";

const SEEN_KEY = "freedomly_milestones_seen";

interface Props {
  metrics: FinancialMetrics;
}

function readSeen(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export function ProgressSection({ metrics }: Props) {
  const [progress, setProgress] = useState<ProgressDelta | null>(null);
  const [celebrations, setCelebrations] = useState<Milestone[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const prior = readHistory();
    const delta = progressSince(prior, metrics);
    const seen = readSeen();
    const fresh = newlyReachedMilestones(metrics, delta?.since ?? null).filter(
      (mst) => !seen.has(mst.id)
    );
    recordSnapshot(metrics);
    setProgress(delta);
    setCelebrations(fresh);
    setReady(true);
    if (fresh.length > 0) {
      track("milestone_reached", { ids: fresh.map((m) => m.id).join(",") });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function dismissCelebrations() {
    const seen = readSeen();
    celebrations.forEach((m) => seen.add(m.id));
    try {
      localStorage.setItem(SEEN_KEY, JSON.stringify(Array.from(seen)));
    } catch { /* ignore */ }
    setCelebrations([]);
  }

  if (!ready) return null;
  if (!progress && celebrations.length === 0) return null;

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider px-1">
        Your progress
      </h2>

      {celebrations.length > 0 && (
        <div className="relative bg-gradient-to-r from-emerald-500/15 to-emerald-400/10 border border-emerald-400/40 rounded-2xl px-5 py-4 flex items-start gap-3">
          <PartyPopper className="text-emerald-300 shrink-0 mt-0.5" size={20} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-emerald-200">
              {celebrations.length === 1 ? "Milestone reached!" : `${celebrations.length} milestones reached!`}
            </p>
            <ul className="mt-1 flex flex-col gap-0.5">
              {celebrations.map((m) => (
                <li key={m.id} className="text-sm text-white/85">
                  <span className="font-semibold text-white">{m.label}</span>{" "}
                  <span className="text-white/60">— {m.blurb}</span>
                </li>
              ))}
            </ul>
          </div>
          <button onClick={dismissCelebrations} aria-label="Dismiss" className="shrink-0 text-white/40 hover:text-white/80 transition-colors">
            <X size={16} />
          </button>
        </div>
      )}

      {progress && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-white/55 px-1">
            Since your last visit · {progress.daysAgo} day{progress.daysAgo === 1 ? "" : "s"} ago
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <StatPill
              label="Net worth"
              from={formatCurrency(progress.since.netWorth)}
              to={formatCurrency(metrics.netWorth)}
              delta={progress.netWorth}
              goodWhenPositive
            />
            <StatPill
              label="Investments"
              from={formatCurrency(progress.since.totalInvestments)}
              to={formatCurrency(metrics.totalInvestments)}
              delta={progress.totalInvestments}
              goodWhenPositive
            />
            <StatPill
              label="Health score"
              from={`${Math.round(progress.since.healthScore)} pts`}
              to={`${Math.round(metrics.healthScore)} pts`}
              delta={progress.healthScore}
              goodWhenPositive
            />
            <FreedomPill
              baseline={progress.since.freedomAge}
              current={metrics.freedomAge.freedomAge}
              delta={progress.freedomAgeYears}
            />
          </div>
        </div>
      )}
    </section>
  );
}

function StatPill({
  label,
  from,
  to,
  delta,
  goodWhenPositive,
}: {
  label: string;
  from: string;
  to: string;
  delta: number;
  goodWhenPositive: boolean;
}) {
  const isZero = Math.abs(delta) < 0.5;
  const isGood = goodWhenPositive ? delta > 0 : delta < 0;
  const dotColor = isZero ? "bg-slate-300" : isGood ? "bg-emerald-500" : "bg-red-400";
  const Icon = isZero ? Minus : isGood ? TrendingUp : TrendingDown;
  const iconColor = isZero ? "text-slate-400" : isGood ? "text-emerald-500" : "text-red-400";

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-xl px-3 py-2.5 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      </div>
      <div className="flex items-baseline gap-1.5 flex-wrap">
        <span className="text-xs text-slate-400 line-through">{from}</span>
        <span className="text-sm font-bold text-slate-800">{to}</span>
      </div>
      <div className={`flex items-center gap-0.5 text-xs font-semibold ${iconColor}`}>
        <Icon size={11} />
        {isZero ? "No change" : isGood ? "Improved" : "Declined"}
      </div>
    </div>
  );
}

function FreedomPill({
  baseline,
  current,
  delta,
}: {
  baseline: number | null;
  current: number | null;
  delta: number | null;
}) {
  const hasData = baseline !== null && current !== null && delta !== null;
  const isZero = !hasData || Math.abs(delta!) < 0.05;
  const isGood = hasData && delta! < 0;
  const dotColor = isZero ? "bg-slate-300" : isGood ? "bg-emerald-500" : "bg-red-400";
  const Icon = isZero ? Minus : isGood ? TrendingUp : TrendingDown;
  const iconColor = isZero ? "text-slate-400" : isGood ? "text-emerald-500" : "text-red-400";

  const mag = hasData ? Math.abs(delta!) : 0;
  const changeText = isZero
    ? "No change"
    : mag >= 0.95
    ? `${Math.round(mag)} yr${Math.round(mag) === 1 ? "" : "s"} ${isGood ? "sooner" : "later"}`
    : `${Math.round(mag * 12)} mo ${isGood ? "sooner" : "later"}`;

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-xl px-3 py-2.5 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Freedom age</span>
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      </div>
      <div className="flex items-baseline gap-1.5 flex-wrap">
        {hasData ? (
          <>
            <span className="text-xs text-slate-400 line-through">age {baseline}</span>
            <span className="text-sm font-bold text-slate-800">age {current}</span>
          </>
        ) : (
          <span className="text-sm font-bold text-slate-500">—</span>
        )}
      </div>
      <div className={`flex items-center gap-0.5 text-xs font-semibold ${iconColor}`}>
        <Icon size={11} />
        {changeText}
      </div>
    </div>
  );
}
