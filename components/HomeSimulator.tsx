"use client";

/**
 * HomeSimulator — a lightweight, no-signup "freedom" teaser for the homepage.
 * Three sliders → live "financially free in ~N years" + trajectory, then a CTA
 * into the full checkup. The interactive "aha" before we ask for anything.
 *
 * Educational estimate only (7% real return, FI = 25× annual spending).
 */

import { useState, useRef } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { track } from "@/lib/analytics";

const RATE = 0.07 / 12;

function yearsToFreedom(spendMo: number, investMo: number, current: number) {
  const fiNumber = spendMo * 12 * 25;
  if (current >= fiNumber) return { years: 0, fiNumber, reached: true };
  if (investMo <= 0) return { years: null, fiNumber, reached: false };
  let fv = current;
  let months = 0;
  while (fv < fiNumber && months < 720) {
    fv = fv * (1 + RATE) + investMo;
    months++;
  }
  if (months >= 720) return { years: null, fiNumber, reached: false };
  return { years: Math.round((months / 12) * 10) / 10, fiNumber, reached: true };
}

function fmt(n: number) {
  return "$" + Math.round(n).toLocaleString();
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-600">{label}</span>
        <span className="text-xs font-semibold text-slate-900">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer accent-emerald-500 bg-slate-200"
      />
    </div>
  );
}

export function HomeSimulator() {
  const [spend, setSpend] = useState(4000);
  const [invest, setInvest] = useState(1500);
  const [current, setCurrent] = useState(25000);
  const tracked = useRef(false);

  function onInteract<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      if (!tracked.current) {
        tracked.current = true;
        track("home_simulator_used");
      }
    };
  }

  const { years, fiNumber, reached } = yearsToFreedom(spend, invest, current);

  // trajectory visual: steeper climb when freedom is sooner
  const progress = Math.max(0.04, Math.min(1, current / fiNumber));
  const endY =
    reached && years !== null ? Math.max(6, Math.min(58, years * 1.6)) : 56;

  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[2rem] bg-emerald-500/10 blur-3xl" aria-hidden />
      <div className="relative bg-white/80 backdrop-blur-sm border border-white/60 shadow-2xl rounded-3xl p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
            Try it — your freedom estimate
          </p>
          <span className="text-[10px] font-medium text-slate-400">no signup</span>
        </div>

        {/* Headline result */}
        <div>
          <p className="text-xs text-slate-500 mb-0.5">At this pace, you could be financially free in</p>
          {reached && years === 0 ? (
            <div className="text-4xl font-bold text-emerald-600 leading-none">You&rsquo;re there 🎉</div>
          ) : reached && years !== null ? (
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold text-slate-900 leading-none">
                {years < 1 ? "<1" : Math.round(years)}
              </span>
              <span className="text-sm text-slate-500 mb-1">years</span>
            </div>
          ) : (
            <div className="text-2xl font-semibold text-slate-500 leading-snug">
              Add a little monthly investing to start the clock
            </div>
          )}
          <p className="text-xs text-slate-400 mt-1">
            Your freedom number: <span className="font-medium text-slate-600">{fmt(fiNumber)}</span>
          </p>
        </div>

        {/* Live trajectory — gradient area that steepens as freedom gets sooner */}
        <div className="h-20 rounded-xl bg-gradient-to-b from-emerald-50/60 to-white border border-slate-200 relative overflow-hidden">
          <svg viewBox="0 0 300 80" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="simFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="0" y1="40" x2="300" y2="40" stroke="#e2e8f0" strokeWidth="1" />
            <path
              d={`M0,74 C110,${74 - 16 * progress} 200,${endY + 12} 300,${endY} L300,80 L0,80 Z`}
              fill="url(#simFill)"
            />
            <path
              d={`M0,74 C110,${74 - 16 * progress} 200,${endY + 12} 300,${endY}`}
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
            />
          </svg>
          {reached && (
            <span className="absolute right-2 top-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          )}
        </div>

        {/* Sliders */}
        <div className="flex flex-col gap-3.5">
          <Slider
            label="You invest / month"
            value={invest}
            min={0}
            max={6000}
            step={100}
            onChange={onInteract(setInvest)}
            display={`${fmt(invest)}/mo`}
          />
          <Slider
            label="You spend / month"
            value={spend}
            min={1500}
            max={12000}
            step={100}
            onChange={onInteract(setSpend)}
            display={`${fmt(spend)}/mo`}
          />
          <Slider
            label="Invested so far"
            value={current}
            min={0}
            max={500000}
            step={5000}
            onChange={onInteract(setCurrent)}
            display={fmt(current)}
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Sparkles size={12} className="text-emerald-500 shrink-0" />
          Drag your monthly investing up and watch the years drop.
        </div>

        {/* CTA */}
        <Link href="/checkup" className="block">
          <button className="w-full bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white font-semibold text-sm py-3.5 rounded-2xl transition-colors">
            Get your real plan in 5 minutes &rarr;
          </button>
        </Link>
        <p className="text-[10px] text-slate-400 text-center -mt-2">
          Educational estimate · 7% return · free, no account
        </p>
      </div>
    </div>
  );
}
