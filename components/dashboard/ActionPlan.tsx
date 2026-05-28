import { CheckCircle2, AlertCircle, Target } from "lucide-react";
import type { ActionPlanResult, Goal, GoalHorizon } from "@/lib/types";

interface Props {
  actionPlan: ActionPlanResult;
  goals: Goal[];
}

const HORIZON_LABELS: Record<GoalHorizon, { label: string; color: string }> = {
  short: { label: "Short-term", color: "bg-emerald-500" },
  mid: { label: "Mid-term", color: "bg-sky-500" },
  long: { label: "Long-term", color: "bg-purple-500" },
};

export function ActionPlan({ actionPlan, goals }: Props) {
  const { goingWell, needsAttention, topActions } = actionPlan;

  return (
    <div className="flex flex-col gap-4">
      {/* Going well + Needs attention */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* What's going well */}
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              What&rsquo;s going well
            </p>
          </div>
          {goingWell.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {goingWell.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-emerald-600 mt-0.5 shrink-0">✓</span>
                  <span className="text-xs text-emerald-800 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-emerald-600 italic">
              Complete your checkup to see what you&rsquo;re doing well.
            </p>
          )}
        </div>

        {/* Needs attention */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle size={14} className="text-amber-500 shrink-0" />
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Needs attention
            </p>
          </div>
          {needsAttention.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {needsAttention.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5 shrink-0">→</span>
                  <span className="text-xs text-amber-800 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-amber-600 italic">
              No major issues detected — keep it up!
            </p>
          )}
        </div>
      </div>

      {/* Goals you set */}
      {goals.length > 0 && (
        <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Target size={14} className="text-slate-400 shrink-0" />
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Goals you set
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {goals.map((goal) => {
              const horizon = HORIZON_LABELS[goal.horizon];
              return (
                <div
                  key={goal.id}
                  className="flex items-center gap-2 bg-white/60 border border-slate-200 rounded-xl px-3 py-1.5"
                >
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${horizon.color}`} />
                  <span className="text-xs text-slate-600">{goal.label}</span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-400">{horizon.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top 3 Next Actions */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl p-6 flex flex-col gap-5">
        <div>
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
            Your top 3 next actions
          </p>
          <p className="text-xs text-slate-500">
            Prioritized based on your numbers — highest impact first.
          </p>
        </div>

        <ol className="flex flex-col gap-5">
          {topActions.map((action, i) => (
            <li key={action.id} className="flex gap-4">
              <div className="shrink-0 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-white">
                {i + 1}
              </div>
              <div className="flex flex-col gap-1 pt-0.5 min-w-0">
                <p className="text-sm font-semibold text-slate-900 leading-snug">{action.text}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{action.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="text-xs text-slate-400 border-t border-slate-200 pt-4">
          Educational guidance only — not financial advice. Consider a CFP for personalized planning.
        </p>
      </div>
    </div>
  );
}
