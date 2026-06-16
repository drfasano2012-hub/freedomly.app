"use client";

import { useState, useMemo, useRef } from "react";
import { formatCurrencyFull } from "@/lib/calculations";
import { track } from "@/lib/analytics";
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

/** Inline freedom age projection for the "what if" simulator (explicit monthly investment). */
function calcAdjustedFreedomAge(
  currentAge: number,
  monthlyInvestment: number,
  adjustedMonthlySpending: number,
  startingValue: number
): FreedomAgeResult {
  const annualSpending = adjustedMonthlySpending * 12;
  const fiNumber = annualSpending * 25;
  const monthlyRate = 0.07 / 12;

  if (startingValue >= fiNumber) {
    return { status: "already_reached", freedomAge: currentAge, yearsToFreedom: 0, fiNumber, monthsToFreedom: 0 };
  }
  if (monthlyInvestment <= 0) {
    return { status: "no_surplus", freedomAge: null, yearsToFreedom: null, fiNumber, monthsToFreedom: null };
  }

  let fv = startingValue;
  let months = 0;
  while (fv < fiNumber && months < 600) {
    fv = fv * (1 + monthlyRate) + monthlyInvestment;
    months++;
  }
  if (months >= 600) {
    return { status: "over_50_years", freedomAge: null, yearsToFreedom: null, fiNumber, monthsToFreedom: null };
  }

  const yearsToFreedom = months / 12;
  return {
    status: "normal",
    freedomAge: Math.round(currentAge + yearsToFreedom),
    yearsToFreedom: Math.round(yearsToFreedom * 10) / 10,
    fiNumber,
    monthsToFreedom: months,
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
  // Freedom simulator — two levers: target monthly spending + monthly investing.
  const targetFloor = Math.max(0, Math.round((monthlySpending * 0.4) / 50) * 50);
  const targetCeil = Math.max(monthlySpending + 500, Math.round((monthlySpending * 1.25) / 50) * 50);
  const investDefault = Math.max(0, Math.round(monthlySurplus / 50) * 50);
  const investFloor = 0;
  const investCeil = Math.max(Math.round(monthlyTakeHome / 50) * 50, investDefault + 1000);

  const [targetSpending, setTargetSpending] = useState(monthlySpending);
  const [investing, setInvesting] = useState(investDefault);
  const sliderTracked = useRef(false);

  function trackOnce() {
    if (!sliderTracked.current) {
      sliderTracked.current = true;
      track("freedom_age_slider_used");
    }
  }
  function handleTarget(value: number) {
    const c = Math.min(targetCeil, Math.max(targetFloor, Math.round(value / 50) * 50));
    setTargetSpending(c);
    if (c !== monthlySpending) trackOnce();
  }
  function handleInvest(value: number) {
    const c = Math.min(investCeil, Math.max(investFloor, Math.round(value / 50) * 50));
    setInvesting(c);
    if (c !== investDefault) trackOnce();
  }
  function resetSim() {
    setTargetSpending(monthlySpending);
    setInvesting(investDefault);
  }

  const adjustedSpending = Math.max(0, targetSpending);
  const adjusted = useMemo(
    () => calcAdjustedFreedomAge(currentAge, investing, adjustedSpending, totalInvestedPlusCash),
    [currentAge, investing, adjustedSpending, totalInvestedPlusCash]
  );

  const isAdjusted = targetSpending !== monthlySpending || investing !== investDefault;
  const overCashflow = targetSpending + investing > monthlyTakeHome;

  // When sliders are moved, the whole card reflects the simulation
  const active = isAdjusted ? adjusted : result;
  const badge = getStatusBadge(active);

  // Delta vs. baseline (only meaningful when both are "normal")
  const delta =
    isAdjusted &&
    result.status === "normal" &&
    result.freedomAge !== null &&
    adjusted.status === "normal" &&
    adjusted.freedomAge !== null
      ? result.freedomAge - adjusted.freedomAge
      : null;

  const renderMain = () => {
    if (active.status === "already_reached") {
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

    if (active.status === "no_surplus") {
      return (
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-semibold text-slate-500 leading-snug">
            No surplus yet
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            {isAdjusted
              ? "At this spending and investing level there's nothing left to compound. Try lowering spending or raising the investing slider."
              : "Right now your spending meets or exceeds your income, leaving nothing to invest. The first step is creating any positive monthly surplus — even $200/month starts the clock. Reducing spending by $200 has the same effect as a $200 raise."}
          </p>
        </div>
      );
    }

    if (active.status === "over_50_years") {
      return (
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-semibold text-slate-500 leading-snug">
            50+ years out
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Your freedom number is {formatCurrencyFull(active.fiNumber)}. Your current surplus is too small to close this gap in a reasonable timeline. Three levers accelerate it: grow your income, reduce monthly spending, or both. Adding $300/month to your surplus can cut a decade off this projection.
          </p>
        </div>
      );
    }

    // normal
    const activeSurplus = isAdjusted ? investing : monthlySurplus;
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-end gap-3 flex-wrap">
          <span className="text-6xl sm:text-7xl font-bold text-slate-800 leading-none" style={{ transition: "color 0.2s" }}>
            {active.freedomAge ?? "—"}
          </span>
          <span className="text-base text-slate-600 mb-2">years old</span>
          {delta !== null && delta > 0 && (
            <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full mb-1.5">
              {delta} year{delta !== 1 ? "s" : ""} earlier 🎉
            </span>
          )}
          {delta !== null && delta < 0 && (
            <span className="text-sm font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full mb-1.5">
              {Math.abs(delta)} year{Math.abs(delta) !== 1 ? "s" : ""} later
            </span>
          )}
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          Your freedom number is {formatCurrencyFull(active.fiNumber)} — what your portfolio needs to cover your spending forever. Your{" "}
          <span className="font-semibold text-emerald-700">{formatCurrencyFull(activeSurplus)}/month</span>{" "}
          invested at 7% annually gets you there in {active.yearsToFreedom} years. Every extra $100/month you free up pulls this date closer.
        </p>
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
          <p className="text-xs text-slate-500 mt-0.5">
            {isAdjusted ? (
              <>
                Simulating —{" "}
                <button
                  onClick={resetSim}
                  className="text-blue-500 hover:text-blue-600 font-medium underline underline-offset-2"
                >
                  reset to current
                </button>
              </>
            ) : (
              <>
                Based on your current monthly spending of{" "}
                <span className="font-medium text-slate-500">{formatCurrencyFull(monthlySpending)}/mo</span>
              </>
            )}
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
      {active.status !== "already_reached" && (
        <div className="bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold text-slate-600 mb-1">What is financial freedom?</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your investments generate enough passive income to cover your living expenses permanently — you no longer need to work for money. Reached when your portfolio = 25× your annual spending.
          </p>
        </div>
      )}

      {/* Freedom simulator — spending + investing levers */}
      {result.status !== "already_reached" && (
        <div className="bg-blue-50/60 border border-blue-200/60 rounded-xl px-4 py-4 flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-0.5">Freedom simulator</p>
            <p className="text-xs text-slate-500">
              Adjust what you spend and invest — watch your freedom age move.
            </p>
          </div>

          <SimControl
            label="Monthly spending"
            value={targetSpending}
            floor={targetFloor}
            ceil={targetCeil}
            nowLabel={`now: ${formatCurrencyFull(monthlySpending)}`}
            onChange={handleTarget}
          />

          <SimControl
            label="Monthly investing"
            value={investing}
            floor={investFloor}
            ceil={investCeil}
            nowLabel={`now: ${formatCurrencyFull(investDefault)}`}
            onChange={handleInvest}
          />

          {overCashflow && (
            <p className="text-xs text-amber-700 -mt-1">
              Heads up — spending + investing is more than your {formatCurrencyFull(monthlyTakeHome)}/mo take-home.
            </p>
          )}
        </div>
      )}

      {/* Secondary metrics */}
      <div className="border-t border-slate-200 pt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-600 mb-0.5">Freedom number</p>
          <p className="text-base font-semibold text-slate-700">
            {formatCurrencyFull(active.fiNumber)}
          </p>
        </div>
        {active.status === "normal" && active.yearsToFreedom !== null && (
          <div>
            <p className="text-xs text-slate-600 mb-0.5">Years to freedom</p>
            <p className="text-base font-semibold text-slate-700">
              {active.yearsToFreedom} yrs
            </p>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        Assumes 7% real annual return, 4% safe withdrawal rate. Freedom number = 25× annual spending.
      </p>
    </div>
  );
}

function SimControl({
  label,
  value,
  floor,
  ceil,
  nowLabel,
  onChange,
}: {
  label: string;
  value: number;
  floor: number;
  ceil: number;
  nowLabel: string;
  onChange: (v: number) => void;
}) {
  const pct = ceil > floor ? ((value - floor) / (ceil - floor)) * 100 : 0;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-slate-600 shrink-0">{label}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`Lower ${label}`}
            onClick={() => onChange(value - 100)}
            className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-600 font-bold hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center"
          >
            −
          </button>
          <span className="text-base font-bold text-slate-900 tabular-nums min-w-[5.5rem] text-center">
            {formatCurrencyFull(value)}/mo
          </span>
          <button
            type="button"
            aria-label={`Raise ${label}`}
            onClick={() => onChange(value + 100)}
            className="w-7 h-7 rounded-lg bg-white border border-slate-300 text-slate-600 font-bold hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>
      <input
        type="range"
        min={floor}
        max={ceil}
        step={50}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-blue-500"
        style={{ background: `linear-gradient(to right, #3b82f6 ${pct}%, #e2e8f0 0%)` }}
      />
      <div className="flex justify-between text-xs text-slate-500">
        <span>{formatCurrencyFull(floor)}</span>
        <span>{nowLabel}</span>
        <span>{formatCurrencyFull(ceil)}</span>
      </div>
    </div>
  );
}
