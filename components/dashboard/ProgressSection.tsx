"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Minus, PartyPopper, X } from "lucide-react";
import { formatCurrency, formatCurrencyFull } from "@/lib/calculations";
import {
  readHistory,
  recordSnapshot,
  progressSince,
  newlyReachedMilestones,
  type Snapshot,
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider px-1">
      {children}
    </h2>
  );
}

export function ProgressSection({ metrics }: Props) {
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [progress, setProgress] = useState<ProgressDelta | null>(null);
  const [celebrations, setCelebrations] = useState<Milestone[]>([]);
  const [ready, setReady] = useState(false);

  // On mount: read prior history, compute progress + new milestones vs the
  // baseline, THEN record today's snapshot (so today doesn't overwrite the
  // baseline used for the comparison).
  useEffect(() => {
    const prior = readHistory();
    const delta = progressSince(prior, metrics);
    const seen = readSeen();
    const fresh = newlyReachedMilestones(metrics, delta?.since ?? null).filter(
      (mst) => !seen.has(mst.id)
    );

    const updated = recordSnapshot(metrics);
    setHistory(updated);
    setProgress(delta);
    setCelebrations(fresh);
    setReady(true);

    if (fresh.length > 0) {
      track("milestone_reached", { ids: fresh.map((m) => m.id).join(",") });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chartData = useMemo(
    () =>
      history.map((s) => ({
        date: s.date,
        netWorth: s.netWorth,
        label: new Date(s.ts).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
      })),
    [history]
  );

  function dismissCelebrations() {
    const seen = readSeen();
    celebrations.forEach((m) => seen.add(m.id));
    try {
      localStorage.setItem(SEEN_KEY, JSON.stringify(Array.from(seen)));
    } catch {
      /* ignore */
    }
    setCelebrations([]);
  }

  if (!ready) return null;

  const hasDeltas = progress !== null;
  const hasChart = chartData.length >= 2;
  const hasCelebration = celebrations.length > 0;

  // Nothing to show yet (first visit, single data point) — stay invisible but
  // we've still recorded the snapshot above for next time.
  if (!hasDeltas && !hasChart && !hasCelebration) return null;

  return (
    <section className="flex flex-col gap-2">
      <SectionLabel>Your progress</SectionLabel>

      {hasCelebration && (
        <div className="relative bg-gradient-to-r from-emerald-500/15 to-emerald-400/10 border border-emerald-400/40 rounded-2xl px-5 py-4 flex items-start gap-3">
          <PartyPopper className="text-emerald-300 shrink-0 mt-0.5" size={22} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-emerald-200">
              {celebrations.length === 1
                ? "Milestone reached!"
                : `${celebrations.length} milestones reached!`}
            </p>
            <ul className="mt-1 flex flex-col gap-1">
              {celebrations.map((m) => (
                <li key={m.id} className="text-sm text-white/85">
                  <span className="font-semibold text-white">{m.label}</span>{" "}
                  <span className="text-white/60">— {m.blurb}</span>
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={dismissCelebrations}
            aria-label="Dismiss"
            className="shrink-0 text-white/40 hover:text-white/80 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {(hasDeltas || hasChart) && (
        <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl p-5 flex flex-col gap-4">
          {hasDeltas && progress && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-slate-500">
                Since your last visit{" "}
                <span className="text-slate-400">
                  ({progress.daysAgo} day{progress.daysAgo === 1 ? "" : "s"} ago)
                </span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <DeltaStat
                  label="Net worth"
                  value={progress.netWorth}
                  format={(v) => `${v >= 0 ? "+" : "-"}${formatCurrency(Math.abs(v))}`}
                  goodWhenPositive
                />
                <FreedomDelta years={progress.freedomAgeYears} />
                <DeltaStat
                  label="Health score"
                  value={progress.healthScore}
                  format={(v) => `${v >= 0 ? "+" : "-"}${Math.abs(Math.round(v))} pts`}
                  goodWhenPositive
                />
              </div>
            </div>
          )}

          {hasChart && (
            <div className={hasDeltas ? "border-t border-slate-200 pt-4" : ""}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-slate-500">Net worth over time</p>
                <p className="text-sm font-bold text-slate-800">
                  {formatCurrencyFull(metrics.netWorth)}
                </p>
              </div>
              <div className="h-28 -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 6, right: 6, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="nwFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                      axisLine={false}
                      tickLine={false}
                      minTickGap={24}
                    />
                    <YAxis hide domain={["auto", "auto"]} />
                    <Tooltip
                      formatter={(v: number) => [formatCurrencyFull(v), "Net worth"]}
                      contentStyle={{
                        fontSize: 12,
                        borderRadius: 8,
                        border: "1px solid #e2e8f0",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="netWorth"
                      stroke="#10b981"
                      strokeWidth={2}
                      fill="url(#nwFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function DeltaStat({
  label,
  value,
  format,
  goodWhenPositive,
}: {
  label: string;
  value: number;
  format: (v: number) => string;
  goodWhenPositive: boolean;
}) {
  const isZero = Math.abs(value) < 0.5;
  const isGood = goodWhenPositive ? value > 0 : value < 0;
  const color = isZero ? "text-slate-500" : isGood ? "text-emerald-600" : "text-red-600";
  const Icon = isZero ? Minus : isGood ? TrendingUp : TrendingDown;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-slate-500">{label}</span>
      <span className={`text-base font-bold flex items-center gap-1 ${color}`}>
        <Icon size={14} aria-hidden="true" />
        {isZero ? "No change" : format(value)}
      </span>
    </div>
  );
}

function FreedomDelta({ years }: { years: number | null }) {
  if (years === null) {
    return (
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-slate-500">Freedom age</span>
        <span className="text-base font-bold flex items-center gap-1 text-slate-500">
          <Minus size={14} aria-hidden="true" />
          —
        </span>
      </div>
    );
  }
  const isZero = Math.abs(years) < 0.05;
  // Negative years = freedom is sooner = good.
  const isGood = years < 0;
  const color = isZero ? "text-slate-500" : isGood ? "text-emerald-600" : "text-red-600";
  const Icon = isZero ? Minus : isGood ? TrendingUp : TrendingDown;
  const mag = Math.abs(years);
  const text = isZero
    ? "No change"
    : mag >= 0.95
    ? `${Math.round(mag)} yr${Math.round(mag) === 1 ? "" : "s"} ${isGood ? "sooner" : "later"}`
    : `${Math.round(mag * 12)} mo ${isGood ? "sooner" : "later"}`;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-slate-500">Freedom age</span>
      <span className={`text-base font-bold flex items-center gap-1 ${color}`}>
        <Icon size={14} aria-hidden="true" />
        {text}
      </span>
    </div>
  );
}
