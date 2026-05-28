"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { formatCurrencyFull } from "@/lib/calculations";

interface Props {
  initialMonthlyExpenses?: number;
  initialCurrentSavings?: number;
}

export function EmergencyFundTool({
  initialMonthlyExpenses = 0,
  initialCurrentSavings = 0,
}: Props) {
  const [monthlyExpenses, setMonthlyExpenses] = useState(String(initialMonthlyExpenses));
  const [targetMonths, setTargetMonths] = useState("6");
  const [currentSavings, setCurrentSavings] = useState(String(initialCurrentSavings));
  const [monthlySaving, setMonthlySaving] = useState("500");

  const parse = (s: string) => parseFloat(s) || 0;

  const expenses = parse(monthlyExpenses);
  const target = Math.max(1, parse(targetMonths));
  const savings = parse(currentSavings);
  const saving = parse(monthlySaving);

  const targetAmount = expenses * target;
  const gap = Math.max(0, targetAmount - savings);
  const progressPct = targetAmount > 0 ? Math.min(100, (savings / targetAmount) * 100) : 0;
  const monthsToGoal = gap > 0 && saving > 0 ? Math.ceil(gap / saving) : 0;

  const now = new Date();
  const goalDate = new Date(now.getFullYear(), now.getMonth() + monthsToGoal);
  const goalLabel = goalDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const isReached = savings >= targetAmount && targetAmount > 0;
  const valid = expenses > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Monthly expenses"
          type="number"
          min={0}
          placeholder="3,200"
          prefix="$"
          hint="All monthly costs: rent, food, transport, etc."
          value={monthlyExpenses}
          onChange={(e) => setMonthlyExpenses(e.target.value)}
        />
        <Input
          label="Target months of coverage"
          type="number"
          min={1}
          max={24}
          placeholder="6"
          suffix="mo"
          hint="3 months minimum; 6 is the standard goal"
          value={targetMonths}
          onChange={(e) => setTargetMonths(e.target.value)}
        />
        <Input
          label="Current cash savings"
          type="number"
          min={0}
          placeholder="2,000"
          prefix="$"
          hint="Checking + high-yield savings"
          value={currentSavings}
          onChange={(e) => setCurrentSavings(e.target.value)}
        />
        <Input
          label="Monthly saving capacity"
          type="number"
          min={0}
          placeholder="500"
          prefix="$"
          hint="How much you can add per month toward this goal"
          value={monthlySaving}
          onChange={(e) => setMonthlySaving(e.target.value)}
        />
      </div>

      {valid ? (
        <div className="flex flex-col gap-4">
          {isReached ? (
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 flex items-start gap-3">
              <CheckCircle2 size={18} className="text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-700 mb-1">
                  Emergency fund fully funded!
                </p>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  You have {formatCurrencyFull(savings)} covering {(savings / expenses).toFixed(1)} months of
                  expenses — meeting your {target}-month target.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white/50 border border-slate-200 rounded-2xl p-5 flex flex-col gap-4">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Results</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white/60 border border-slate-200 rounded-xl p-4">
                  <p className="text-xs text-slate-600 mb-1">Target amount</p>
                  <p className="text-lg font-bold text-slate-800">{formatCurrencyFull(targetAmount)}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{target} months × {formatCurrencyFull(expenses)}</p>
                </div>
                <div className="bg-white/60 border border-slate-200 rounded-xl p-4">
                  <p className="text-xs text-slate-600 mb-1">Remaining gap</p>
                  <p className="text-lg font-bold text-amber-600">{formatCurrencyFull(gap)}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Still needed</p>
                </div>
                <div className="bg-white/60 border border-slate-200 rounded-xl p-4">
                  <p className="text-xs text-slate-600 mb-1">Months to goal</p>
                  <p className="text-lg font-bold text-emerald-600">
                    {saving > 0 ? monthsToGoal : "—"}
                  </p>
                  {saving > 0 && monthsToGoal > 0 && (
                    <p className="text-xs text-slate-500 mt-0.5">By {goalLabel}</p>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-400">
                    {progressPct.toFixed(0)}% funded — {(savings / expenses).toFixed(1)} of {target} months covered
                  </span>
                </div>
                <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progressPct}%`,
                      backgroundColor: progressPct >= 100 ? "#10b981" : progressPct >= 50 ? "#f59e0b" : "#ef4444",
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>$0</span>
                  <span>{formatCurrencyFull(targetAmount)}</span>
                </div>
              </div>
            </div>
          )}

          <p className="text-xs text-slate-400 leading-relaxed">
            The CFP Board recommends 3–6 months of essential expenses in an accessible, liquid account (HYSA or
            money market fund). Keep this separate from your investment accounts.
          </p>
        </div>
      ) : (
        <div className="bg-white/30 rounded-2xl p-6 text-center">
          <p className="text-sm text-slate-600">Enter your monthly expenses to see your emergency fund plan.</p>
        </div>
      )}
    </div>
  );
}
