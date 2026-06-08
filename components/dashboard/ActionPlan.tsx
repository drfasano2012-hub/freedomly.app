"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, AlertCircle, Target, ChevronDown, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import type { ActionPlanResult, Goal, GoalHorizon, EmploymentType } from "@/lib/types";

interface Props {
  actionPlan: ActionPlanResult;
  goals: Goal[];
  employmentType: EmploymentType;
}

const ACTIONS_KEY = "freedomly_actions_done";

const HORIZON_LABELS: Record<GoalHorizon, { label: string; color: string }> = {
  short: { label: "Short-term", color: "bg-emerald-500" },
  mid: { label: "Mid-term", color: "bg-sky-500" },
  long: { label: "Long-term", color: "bg-purple-500" },
};

/** Concrete, friction-removing steps per recommendation — this is what turns
 *  "you should…" into something a person can actually go do today. */
const PLAYBOOKS: Record<string, string[]> = {
  high_interest_debt: [
    "List every debt with its APR — you'll attack the highest rate first (the “avalanche” method).",
    "Pay the minimum on all of them, then throw every spare dollar at the highest-APR balance.",
    "Call the lender and ask for a lower rate — a 10-minute call works more often than you'd expect.",
    "Consider a 0% balance-transfer card to stop the interest while you pay it down.",
  ],
  emergency_fund: [
    "Open a separate high-yield savings account (e.g. Ally, Marcus, Capital One — ~4–5% APY) so you won't touch it.",
    "Set your target: 3× your monthly spending.",
    "Automate a transfer every payday — even a small amount compounds into the goal.",
    "Park it and leave it. This is insurance, not an investment.",
  ],
  savings_rate: [
    "Automate it — set an automatic transfer to savings/investing on payday, before you can spend it.",
    "Bump the amount 1% every couple of months; you won't feel it.",
    "Send every raise or bonus straight to savings.",
    "Free up cash with the subscription audit below.",
  ],
  audit_expenses: [
    "Pull up your last 2–3 months of card/bank statements.",
    "List every recurring charge — flag anything you forgot about or don't use.",
    "Cancel the dead weight today (aim for 3+).",
    "Redirect that freed-up money straight to savings — don't let it evaporate.",
  ],
};

/** Retirement steps differ by employment status — this is the whole point of asking. */
const RETIREMENT_PLAYBOOKS: Record<EmploymentType, string[]> = {
  w2: [
    "First, get the full 401(k) employer match — it's free money. Set your contribution to at least the match.",
    "Next, open or fund a Roth IRA at Fidelity, Schwab, or Vanguard ($7,000/yr).",
    "Have an HSA? Contribute — it's triple tax-advantaged.",
    "Then raise your 401(k) toward the annual max.",
  ],
  self_employed: [
    "Open a Solo 401(k) or SEP-IRA at Fidelity, Schwab, or Vanguard (free, ~20 minutes).",
    "A Solo 401(k) lets you contribute as both employee AND employer — far more than a regular IRA.",
    "Automate a monthly contribution from your business income.",
    "Invest it in a low-cost index fund — don't leave it sitting in cash.",
  ],
  business_owner: [
    "Open a Solo 401(k) or SEP-IRA (or a SIMPLE IRA if you have employees) at a major brokerage.",
    "These shelter far more than a regular IRA — you contribute as both employee and employer.",
    "Automate a monthly contribution from the business.",
    "Ask a CPA which account fits your business structure — the tax savings are significant.",
  ],
  not_employed: [
    "If your spouse has earned income, open a Spousal Roth IRA — it keeps your tax-free investing going.",
    "Roll any old 401(k)s into an IRA so they're not lost or stuck in cash.",
    "Keep a slightly larger emergency buffer while income is paused.",
    "When income resumes, prioritize the employer match / Solo 401(k) again.",
  ],
};

function playbookFor(actionId: string, emp: EmploymentType): string[] {
  if (actionId === "max_tax_advantaged" || actionId === "roth_ira") return RETIREMENT_PLAYBOOKS[emp];
  return PLAYBOOKS[actionId] ?? [];
}

export function ActionPlan({ actionPlan, goals, employmentType }: Props) {
  const { goingWell, needsAttention, topActions } = actionPlan;

  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());
  const [openId, setOpenId] = useState<string | null>(null);

  // Load completed actions from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(ACTIONS_KEY);
      if (raw) setDoneIds(new Set(JSON.parse(raw) as string[]));
    } catch {
      /* ignore */
    }
  }, []);

  function toggleDone(id: string) {
    setDoneIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        next.add(id);
        track("action_completed", { action_id: id });
      }
      try {
        localStorage.setItem(ACTIONS_KEY, JSON.stringify(Array.from(next)));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  function toggleSteps(id: string) {
    setOpenId((cur) => {
      if (cur !== id) track("action_step_expanded", { action_id: id });
      return cur === id ? null : id;
    });
  }

  const doneCount = topActions.filter((a) => doneIds.has(a.id)).length;
  const pct = topActions.length ? Math.round((doneCount / topActions.length) * 100) : 0;
  const allDone = topActions.length > 0 && doneCount === topActions.length;

  return (
    <div className="flex flex-col gap-4">
      {/* ── Your action plan — the do-list (hero of the dashboard) ── */}
      <div className="bg-white/80 backdrop-blur-sm border border-emerald-200 shadow-lg ring-1 ring-emerald-100 rounded-2xl p-6 flex flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
              Your action plan
            </p>
            <p className="text-xs text-slate-500">
              Your highest-impact moves — check them off as you do them.
            </p>
          </div>
          <span className="shrink-0 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
            {doneCount} of {topActions.length} done
          </span>
        </div>

        {/* progress bar */}
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden -mt-1">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>

        <ol className="flex flex-col gap-3">
          {topActions.map((action) => {
            const isDone = doneIds.has(action.id);
            const isOpen = openId === action.id;
            const steps = playbookFor(action.id, employmentType);
            return (
              <li
                key={action.id}
                className={cn(
                  "border rounded-xl transition-colors",
                  isDone ? "border-emerald-200 bg-emerald-50/50" : "border-slate-200 bg-white/60"
                )}
              >
                <div className="flex gap-3 p-4">
                  {/* check toggle */}
                  <button
                    onClick={() => toggleDone(action.id)}
                    aria-pressed={isDone}
                    aria-label={isDone ? "Mark as not done" : "Mark as done"}
                    title={isDone ? "Done — tap to undo" : "Mark as done"}
                    className="shrink-0 mt-0.5 group/check"
                  >
                    {isDone ? (
                      <CheckCircle2 size={24} className="text-emerald-500" />
                    ) : (
                      <Circle
                        size={24}
                        strokeWidth={2}
                        className="text-slate-300 group-hover/check:text-emerald-400 transition-colors"
                      />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-semibold leading-snug",
                        isDone ? "text-slate-400 line-through" : "text-slate-900"
                      )}
                    >
                      {action.text}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed mt-0.5">{action.detail}</p>

                    {steps.length > 0 && (
                      <button
                        onClick={() => toggleSteps(action.id)}
                        aria-expanded={isOpen}
                        className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                      >
                        <ListChecks size={13} />
                        {isOpen ? "Hide steps" : "How to do this"}
                        <ChevronDown
                          size={13}
                          className={cn("transition-transform duration-200", isOpen && "rotate-180")}
                        />
                      </button>
                    )}

                    {isOpen && steps.length > 0 && (
                      <ol className="mt-3 flex flex-col gap-2.5 border-t border-slate-200 pt-3">
                        {steps.map((s, j) => (
                          <li key={j} className="flex gap-2.5 text-xs text-slate-600 leading-relaxed">
                            <span className="shrink-0 w-4 h-4 mt-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-[10px]">
                              {j + 1}
                            </span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {allDone ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
            <p className="text-sm font-semibold text-emerald-700">🎉 Plan complete — nice work.</p>
            <p className="text-xs text-emerald-800 mt-1">
              Update your numbers to see your freedom date move closer — and get your next set of moves.
            </p>
          </div>
        ) : (
          <p className="text-xs text-slate-500 border-t border-slate-200 pt-4">
            As you complete these and update your numbers, your plan refreshes and your freedom date moves
            closer. Educational guidance only — not financial advice.
          </p>
        )}
      </div>

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
            <p className="text-xs text-amber-600 italic">No major issues detected — keep it up!</p>
          )}
        </div>
      </div>

      {/* Goals you set */}
      {goals.length > 0 && (
        <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Target size={14} className="text-slate-400 shrink-0" />
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Goals you set</p>
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
    </div>
  );
}
