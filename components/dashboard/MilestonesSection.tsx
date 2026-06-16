"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronDown, Lock, ArrowRight } from "lucide-react";
import { getMilestoneProgress, type MilestoneProgress } from "@/lib/history";
import type { FinancialMetrics } from "@/lib/types";

interface Props {
  metrics: FinancialMetrics;
}

const PREVIEW_COUNT = 3;

export function MilestonesSection({ metrics }: Props) {
  const milestones = getMilestoneProgress(metrics);
  const achievedCount = milestones.filter((m) => m.achieved).length;
  const [expanded, setExpanded] = useState(false);

  // Default view: the nearest unachieved milestones, so returning users see
  // what's next instead of scrolling past everything they've already hit.
  const unachieved = [...milestones].filter((m) => !m.achieved).sort((a, b) => b.pct - a.pct);
  const preview = unachieved.slice(0, PREVIEW_COUNT);
  const showAll = expanded || unachieved.length === 0;
  const visible = showAll ? milestones : preview;
  const hasMore = !showAll && visible.length < milestones.length;

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between px-1">
        <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider">
          Your journey
        </h2>
        <span className="text-xs text-white/55">
          {achievedCount} / {milestones.length} milestones
        </span>
      </div>

      <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl p-5 flex flex-col gap-1">
        {/* Progress ribbon */}
        <div className="flex items-center gap-1 mb-4">
          {milestones.map((m) => (
            <div
              key={m.id}
              className={`flex-1 h-1.5 rounded-full ${
                m.achieved ? "bg-emerald-500" : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {visible.map((m) => (
            <MilestoneCard key={m.id} milestone={m} />
          ))}
        </div>

        {hasMore && (
          <button
            onClick={() => setExpanded(true)}
            className="self-start flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors mt-3"
          >
            See all {milestones.length} milestones
            <ChevronDown size={13} />
          </button>
        )}
      </div>
    </section>
  );
}

function MilestoneCard({ milestone: m }: { milestone: MilestoneProgress }) {
  const pctDisplay = Math.round(m.pct * 100);

  return (
    <div
      className={`rounded-xl p-3.5 flex flex-col gap-2 border transition-colors ${
        m.achieved
          ? "bg-emerald-50 border-emerald-200/70"
          : "bg-white/60 border-slate-200/60"
      }`}
    >
      {/* Top row */}
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 shrink-0">
          {m.achieved ? (
            <CheckCircle2 size={18} className="text-emerald-500" />
          ) : (
            <Lock size={16} className="text-slate-400 mt-0.5" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-semibold leading-snug ${
              m.achieved ? "text-emerald-700" : "text-slate-700"
            }`}
          >
            {m.label}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 leading-snug">{m.blurb}</p>
        </div>
      </div>

      {/* Progress bar */}
      {!m.achieved && (
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{m.currentDisplay}</span>
            <span>{m.targetDisplay}</span>
          </div>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${pctDisplay}%` }}
            />
          </div>
        </div>
      )}

      {/* Learn link for unachieved milestones */}
      {!m.achieved && (
        <Link
          href={`/learn/${m.lessonId}`}
          className="self-start flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors mt-0.5"
        >
          Learn how
          <ArrowRight size={11} />
        </Link>
      )}
    </div>
  );
}
