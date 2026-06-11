import { CheckCircle2, AlertCircle } from "lucide-react";
import type { ActionPlanResult } from "@/lib/types";

/** The "going well / needs attention" readout — context for the action plan,
 *  lives in the collapsible Details section to keep the main flow lean. */
export function PlanDiagnostics({ actionPlan }: { actionPlan: ActionPlanResult }) {
  const { goingWell, needsAttention } = actionPlan;

  return (
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
          <p className="text-xs text-amber-600 italic">No major issues detected — keep it up!</p>
        )}
      </div>
    </div>
  );
}
