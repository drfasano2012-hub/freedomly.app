"use client";

import { useState } from "react";
import { Check, Sparkles, X } from "lucide-react";
import { GOALS, RISK_OPTIONS } from "@/lib/profile-options";
import { track } from "@/lib/analytics";
import type { Goal, RiskTolerance, UserInputs } from "@/lib/types";

const DISMISS_KEY = "freedomly_sharpen_dismissed";

interface Props {
  inputs: UserInputs;
  setInputs: (data: UserInputs) => void;
}

/** Progressive profiling: goals + risk moved out of the checkup. Shows once,
 *  collects both in-place, then disappears for good. */
export function SharpenPlan({ inputs, setInputs }: Props) {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem(DISMISS_KEY) === "1";
  });
  const [goalIds, setGoalIds] = useState<string[]>([]);
  const [risk, setRisk] = useState<RiskTolerance | null>(null);

  // Already answered (during a previous visit or a pre-streamline checkup)? Stay hidden.
  if (dismissed || inputs.goals.length > 0) return null;

  function hide() {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
    setDismissed(true);
  }

  function save() {
    const goals: Goal[] = GOALS.filter((g) => goalIds.includes(g.id)).map(
      ({ id, label, horizon }) => ({ id, label, horizon })
    );
    setInputs({
      ...inputs,
      goals,
      riskTolerance: risk ?? inputs.riskTolerance,
    });
    track("plan_sharpened", { goal_count: goals.length, risk: risk ?? inputs.riskTolerance });
    hide();
  }

  return (
    <div className="bg-white/[0.06] border border-white/12 rounded-2xl px-5 py-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-emerald-400 shrink-0" />
          <p className="text-sm font-semibold text-white">
            Sharpen your plan{" "}
            <span className="text-white/45 font-normal">— two quick questions</span>
          </p>
        </div>
        <button
          onClick={hide}
          aria-label="Dismiss"
          className="shrink-0 text-white/40 hover:text-white/80 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div>
        <p className="text-xs text-white/65 mb-2">What are you working toward?</p>
        <div className="flex flex-wrap gap-2">
          {GOALS.map((g) => {
            const on = goalIds.includes(g.id);
            return (
              <button
                key={g.id}
                onClick={() =>
                  setGoalIds((ids) =>
                    on ? ids.filter((i) => i !== g.id) : [...ids, g.id]
                  )
                }
                className={`text-xs font-medium rounded-full px-3 py-1.5 border transition-colors flex items-center gap-1.5 ${
                  on
                    ? "bg-emerald-500 border-emerald-400 text-white"
                    : "bg-white/10 border-white/20 text-white/80 hover:border-white/40"
                }`}
              >
                {on && <Check size={12} />} {g.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div className="flex items-center gap-2">
          <p className="text-xs text-white/65">Investment risk:</p>
          <div className="flex gap-1.5">
            {RISK_OPTIONS.map((o) => (
              <button
                key={o.value}
                onClick={() => setRisk(o.value)}
                className={`text-xs font-medium rounded-full px-2.5 py-1.5 border transition-colors ${
                  risk === o.value
                    ? "bg-emerald-500 border-emerald-400 text-white"
                    : "bg-white/10 border-white/20 text-white/80 hover:border-white/40"
                }`}
              >
                {o.icon} {o.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={save}
          disabled={goalIds.length === 0 && risk === null}
          className="self-end sm:self-auto bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl px-5 py-2"
        >
          Save
        </button>
      </div>
    </div>
  );
}
