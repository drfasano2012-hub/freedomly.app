"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle2, Circle, Target, ChevronDown, ListChecks, Zap, BookOpen } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { awardActionXp } from "@/lib/learn-progress";
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
  emergency_floor: [
    "Open a separate high-yield savings account (Ally, Marcus, Capital One — ~4–5% APY) so you won't dip into it.",
    "Set the target at 3× your monthly spending — a floor, not a vault.",
    "Automate a transfer every payday until you hit it.",
    "Once you're at 3 months, redirect new savings to investing — don't keep piling up idle cash.",
  ],
  create_surplus: [
    "List your take-home vs. your spending to see the gap you need to close.",
    "Cut the biggest 2–3 expenses you won't miss (subscriptions, dining, unused memberships).",
    "Lift income where you can — a raise, freelance work, or selling unused stuff.",
    "Automate even $200/month into investing the day it becomes available.",
  ],
  capture_match: [
    "Check your 401(k) plan docs (or ask HR) for the match formula — e.g. 100% up to 4%.",
    "Set your contribution to at least hit the full match — anything less leaves free money behind.",
    "Confirm it's invested in a low-cost index fund, not sitting in cash.",
    "Revisit after any raise so your contribution keeps pace.",
  ],
  cut_spending: [
    "Pull your last 2–3 months of statements and total your recurring + discretionary spend.",
    "Find the cut in the big rocks first — housing, car, food, subscriptions.",
    "Cancel or downgrade today, and automate the freed-up money into investing so it doesn't evaporate.",
    "Remember it's a double win: you invest more AND your freedom number drops.",
  ],
  invest_more: [
    "Increase your automatic monthly investment by the target amount, on payday.",
    "Send raises and bonuses straight to investing before lifestyle creep claims them.",
    "Use low-cost broad index funds — keep fees under ~0.1%.",
    "Bump it again in a few months; you adapt faster than you'd think.",
  ],
  accessible_investing: [
    "After capturing any employer match, open a taxable brokerage account (Fidelity, Schwab, Vanguard).",
    "Roth IRA contributions (not earnings) can be withdrawn anytime — a flexible bridge to early freedom.",
    "Read up on the Roth conversion ladder and Rule 72(t) for tapping a 401(k) before 59½ penalty-free.",
    "Aim for enough outside retirement accounts to cover your early-freedom years.",
  ],
  optimize_allocation: [
    "Pick a stock/bond split that matches your risk tolerance and timeline.",
    "Consolidate into a few broad, low-cost index funds; avoid high-fee products.",
    "Rebalance back to your target about once a year.",
    "Keep only the cash you actually need — idle cash loses to inflation.",
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
  if (
    actionId === "start_investing" ||
    actionId === "max_tax_advantaged" ||
    actionId === "roth_ira"
  )
    return RETIREMENT_PLAYBOOKS[emp];
  return PLAYBOOKS[actionId] ?? [];
}

export function ActionPlan({ actionPlan, goals, employmentType }: Props) {
  const { topActions } = actionPlan;

  const [doneIds, setDoneIds] = useState<Set<string>>(new Set());
  const [openId, setOpenId] = useState<string | null>(null);
  const [xpFlash, setXpFlash] = useState<string | null>(null);

  // Load completed actions from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(ACTIONS_KEY);
      if (raw) setDoneIds(new Set(JSON.parse(raw) as string[]));
    } catch {
      /* ignore */
    }
  }, []);

  const showXpToast = useCallback((msg: string) => {
    setXpFlash(msg);
    setTimeout(() => setXpFlash(null), 2500);
  }, []);

  function toggleDone(id: string) {
    setDoneIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        next.add(id);
        track("action_completed", { action_id: id });
        const xp = awardActionXp(id);
        if (xp > 0) showXpToast(`+${xp} XP — keep building! 🎯`);
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
            <p className="text-xs text-slate-600">
              Your highest-impact moves — check them off as you do them.
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1">
              {doneCount} of {topActions.length} done
            </span>
            {xpFlash && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1 animate-pulse">
                {xpFlash}
              </span>
            )}
          </div>
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

                    {action.impact && (
                      <span
                        className={cn(
                          "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold leading-tight",
                          isDone
                            ? "bg-slate-100 text-slate-400"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        )}
                      >
                        <Zap size={11} className="shrink-0" aria-hidden="true" />
                        {action.impact}
                      </span>
                    )}

                    <div className="mt-2.5 flex flex-wrap items-center gap-3">
                      {steps.length > 0 && (
                        <button
                          onClick={() => toggleSteps(action.id)}
                          aria-expanded={isOpen}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                        >
                          <ListChecks size={13} />
                          {isOpen ? "Hide steps" : "How to do this"}
                          <ChevronDown
                            size={13}
                            className={cn("transition-transform duration-200", isOpen && "rotate-180")}
                          />
                        </button>
                      )}
                      {action.lessonId && !isDone && (
                        <Link
                          href={`/learn/${action.lessonId}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700"
                        >
                          <BookOpen size={13} />
                          Learn why this matters
                        </Link>
                      )}
                    </div>

                    {isOpen && steps.length > 0 && (
                      <ol className="mt-3 flex flex-col gap-2.5 border-t border-slate-200 pt-3">
                        {steps.map((s, j) => (
                          <li key={j} className="flex gap-2.5 text-xs text-slate-600 leading-relaxed">
                            <span className="shrink-0 w-4 h-4 mt-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
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
          <p className="text-xs text-slate-600 border-t border-slate-200 pt-4">
            As you complete these and update your numbers, your plan refreshes and your freedom date moves
            closer. Educational guidance only — not financial advice.
          </p>
        )}
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
