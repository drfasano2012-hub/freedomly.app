"use client";

import { useState, useMemo } from "react";
import { formatCurrencyFull } from "@/lib/calculations";
import type { FreedomAgeResult } from "@/lib/types";

interface Props {
  result: FreedomAgeResult;
  currentAge: number;
  monthlySurplus: number;
  monthlySpending: number;
  monthlyTakeHome: number;
  totalInvestedPlusCash: number;
}

function getStatusBadge(result: FreedomAgeResult): {
  label: string;
  color: string;
  bg: string;
  border: string;
} {
  if (result.status === "already_reached")
    return { label: "Freedom reached", color: "#34d399", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)" };
  if (result.status === "no_surplus" || result.status === "over_50_years")
    return { label: "Stuck", color: "#f87171", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)" };
  const years = result.yearsToFreedom ?? 999;
  if (years <= 15)
    return { label: "On track", color: "#34d399", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)" };
  if (years <= 30)
    return { label: "Getting there", color: "#3b82f6", bg: "rgba(59,130,246,0.10)", border: "rgba(59,130,246,0.3)" };
  // Changed from orange to blue
  return { label: "Needs work", color: "#3b82f6", bg: "rgba(59,130,246,0.10)", border: "rgba(59,130,246,0.3)" };
}

/** Inline freedom age calculation for "what if" spending scenarios */
function calcAdjustedFreedomAge(
  currentAge: number,
  monthlyTakeHome: number,
  adjustedMonthlySpending: number,
  startingValue: number
): { status: "no_surplus" | "over_50_years" | "already_reached" | "normal"; freedomAge: number | null; yearsToFreedom: number | null; fiNumber: number } {
  const annualSpending = adjustedMonthlySpending * 12;
  const fiNumber = annualSpending * 25;
  const monthlyRate = 0.07 / 12;
  const surplus = monthlyTakeHome - adjustedMonthlySpending;

  if (startingValue >= fiNumber) {
    return { status: "already_reached", freedomAge: currentAge, yearsToFreedom: 0, fiNumber };
  }
  if (surplus <= 0) {
    return { status: "no_surplus", freedomAge: null, yearsToFreedom: null, fiNumber };
  }

  let fv = startingValue;
  let months = 0;
  while (fv < fiNumber && months < 600) {
    fv = fv * (1 + monthlyRate) + surplus;
    months++;
  }
  if (months >= 600) {
    return { status: "over_50_years", freedomAge: null, yearsToFreedom: null, fiNumber };
  }

  const yearsToFreedom = months / 12;
  return {
    status: "normal",
    freedomAge: Math.round(currentAge + yearsToFreedom),
    yearsToFreedom: Math.round(yearsToFreedom * 10) / 10,
    fiNumber,
  };
}

export function FreedomAgeCard({
  result,
  currentAge,
  monthlySurplus,
  monthlySpending,
  monthlyTakeHome,
  totalInvestedPlusCash,
}: Props) {
  const badge = getStatusBadge(result);

  // Spending adjustment state — expressed as monthly reduction ($)
  const [spendingReduction, setSpendingReduction] = useState(0);

  const adjustedSpending = Math.max(0, monthlySpending - spendingReduction);
  const adjusted = useMemo(
    () => calcAdjustedFreedomAge(currentAge, monthlyTakeHome, adjustedSpending, totalInvestedPlusCash),
    [currentAge, monthlyTakeHome, adjustedSpending, totalInvestedPlusCash]
  );

  const isAdjusted = spendingReduction > 0;

  const renderMain = () => {
    if (result.status === "already_reached") {
      return (
        <div className="flex flex-col gap-2">
          <div className="text-6xl sm:text-7xl font-bold text-emerald-600 leading-none">
            {currentAge}
          </div>
          <p className="text-sm text-slate-600 mt-1">
            You&rsquo;ve already hit your freedom number — your investments permanently cover your living expenses. Work is now optional.
          </p>
        </div>
      );
    }

    if (result.status === "no_surplus") {
      return (
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-semibold text-slate-500 leading-snug">
            No surplus yet
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Right now your spending meets or exceeds your income, leaving nothing to invest. The first step is creating any positive monthly surplus — even $200/month starts the clock. Reducing spending by $200 has the same effect as a $200 raise.
          </p>
        </div>
      );
    }

    if (result.status === "over_50_years") {
      return (
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-semibold text-slate-500 leading-snug">
            50+ years out
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Your FI number is {formatCurrencyFull(result.fiNumber)}. Your current surplus is too small to close this gap in a reasonable timeline. Three levers accelerate it: grow your income, reduce monthly spending, or both. Adding $300/month to your surplus can cut a decade off this projection.
          </p>
        </div>
      );
    }

    // normal
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-end gap-2">
          <span className="text-6xl sm:text-7xl font-bold text-slate-800 leading-none">
            {result.freedomAge}
          </span>
          <span className="text-base text-slate-500 mb-2">years old</span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          Your FI number is {formatCurrencyFull(result.fiNumber)} — 25× your annual spending. Your{" "}
          <span className="font-semibold text-emerald-700">{formatCurrencyFull(monthlySurplus)}/month</span>{" "}
          surplus invested at 7% annually gets you there in {result.yearsToFreedom} years. Every extra $100/month you free up pulls this date closer.
        </p>
      </div>
    );
  };

  const renderAdjustedResult = () => {
    if (!isAdjusted) return null;
    if (adjusted.status === "already_reached") {
      return (
        <p className="text-sm font-semibold text-emerald-600">
          You&rsquo;ve already reached your FI number — freedom now!
        </p>
      );
    }
    if (adjusted.status === "no_surplus") {
      return <p className="text-sm text-red-500">Still no surplus at this spending level.</p>;
    }
    if (adjusted.status === "over_50_years") {
      return <p className="text-sm text-slate-500">Still 50+ years out at this level.</p>;
    }
    const delta =
      result.status === "normal" && result.freedomAge !== null && adjusted.freedomAge !== null
        ? result.freedomAge - adjusted.freedomAge
        : null;
    return (
      <div className="flex items-center gap-3 flex-wrap">
        <div>
          <span className="text-2xl font-bold text-blue-600">{adjusted.freedomAge}</span>
          <span className="text-sm text-slate-500 ml-1.5">years old</span>
        </div>
        {delta !== null && delta > 0 && (
          <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            {delta} year{delta !== 1 ? "s" : ""} earlier
          </span>
        )}
        {delta !== null && delta === 0 && (
          <span className="text-xs text-slate-500">Same timeline</span>
        )}
        <span className="text-xs text-slate-500">
          FI number: {formatCurrencyFull(adjusted.fiNumber)} · Surplus:{" "}
          {formatCurrencyFull(monthlyTakeHome - adjustedSpending)}/mo
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Freedom Age Projection
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            Based on your current monthly spending of{" "}
            <span className="font-medium text-slate-500">{formatCurrencyFull(monthlySpending)}/mo</span>
          </p>
        </div>
        <span
          className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border"
          style={{ color: badge.color, background: badge.bg, borderColor: badge.border }}
        >
          {badge.label}
        </span>
      </div>

      {/* Main value + contextual guidance */}
      <div>{renderMain()}</div>

      {/* What is financial freedom? */}
      {result.status !== "already_reached" && (
        <div className="bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-slate-600 mb-1">What is financial freedom?</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your investments generate enough passive income to cover your living expenses permanently — you no longer need to work for money. Reached when your portfolio = 25× your annual spending.
          </p>
        </div>
      )}

      {/* Spending adjustment calculator */}
      {result.status !== "already_reached" && (
        <div className="bg-blue-50/60 border border-blue-200/60 rounded-xl px-4 py-4 flex flex-col gap-3">
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-0.5">
              What if I reduced my monthly spending?
            </p>
            <p className="text-xs text-slate-500">
              Drag to see how lower expenses shift your freedom date.
            </p>
          </div>

          {/* Slider */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">Monthly spending reduction</span>
              <span className="text-xs font-semibold text-blue-600">
                {spendingReduction === 0 ? "None" : `−${formatCurrencyFull(spendingReduction)}/mo`}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={Math.max(100, Math.floor((monthlySpending - 100) / 100) * 100)}
              step={100}
              value={spendingReduction}
              onChange={(e) => setSpendingReduction(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer accent-blue-500"
              style={{ background: `linear-gradient(to right, #3b82f6 ${(spendingReduction / Math.max(100, Math.floor((monthlySpending - 100) / 100) * 100)) * 100}%, #e2e8f0 0%)` }}
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>$0</span>
              <span>
                Adjusted spending: <span className="font-medium text-slate-600">{formatCurrencyFull(adjustedSpending)}/mo</span>
              </span>
            </div>
          </div>

          {/* Adjusted result */}
          <div className="min-h-[2rem]">
            {isAdjusted ? (
              renderAdjustedResult()
            ) : (
              <p className="text-xs text-slate-400 italic">Slide to explore scenarios</p>
            )}
          </div>
        </div>
      )}

      {/* Secondary metrics */}
      <div className="border-t border-slate-200 pt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-600 mb-0.5">FI number</p>
          <p className="text-base font-semibold text-slate-700">
            {formatCurrencyFull(result.fiNumber)}
          </p>
        </div>
        {result.status === "normal" && result.yearsToFreedom !== null && (
          <div>
            <p className="text-xs text-slate-600 mb-0.5">Years to freedom</p>
            <p className="text-base font-semibold text-slate-700">
              {result.yearsToFreedom} yrs
            </p>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        Assumes 7% real annual return, 4% safe withdrawal rate. FI number = 25× annual spending.
      </p>
    </div>
  );
}
