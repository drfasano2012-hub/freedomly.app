"use client";

import { useState } from "react";
import { RefreshCw, ChevronDown, ChevronUp, Check } from "lucide-react";
import type { UserInputs } from "@/lib/types";

interface Props {
  inputs: UserInputs;
  setInputs: (data: UserInputs) => void;
  lastUpdated: Date | null;
}

function daysAgo(date: Date): number {
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
}

export function QuickUpdateCard({ inputs, setInputs, lastUpdated }: Props) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [draft, setDraft] = useState({
    monthlyTakeHome: inputs.monthlyTakeHome,
    monthlySpending: inputs.monthlySpending,
    cashSavings: inputs.cashSavings,
    retirementAccounts: inputs.retirementAccounts + inputs.brokerageAccounts + inputs.hsaAccounts,
  });

  const days = lastUpdated ? daysAgo(lastUpdated) : null;

  // Only show the nudge if numbers are stale (>7 days) or we have no timestamp
  const isStale = days === null || days >= 7;
  if (!isStale) return null;

  const ageLabel =
    days === null
      ? "a while ago"
      : days === 0
      ? "today"
      : days === 1
      ? "yesterday"
      : `${days} days ago`;

  function setField(key: keyof typeof draft, value: string) {
    const num = Math.round(parseFloat(value) || 0);
    setDraft((d) => ({ ...d, [key]: isNaN(num) ? 0 : num }));
  }

  function handleSave() {
    // Distribute combined investments: put delta into retirementAccounts, keep others
    const prevTotal = inputs.retirementAccounts + inputs.brokerageAccounts + inputs.hsaAccounts;
    const delta = draft.retirementAccounts - prevTotal;
    setInputs({
      ...inputs,
      monthlyTakeHome: draft.monthlyTakeHome,
      monthlySpending: draft.monthlySpending,
      cashSavings: draft.cashSavings,
      retirementAccounts: Math.max(0, inputs.retirementAccounts + delta),
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setOpen(false);
    }, 1500);
  }

  const FIELDS: { key: keyof typeof draft; label: string; suffix?: string }[] = [
    { key: "monthlyTakeHome", label: "Take-home", suffix: "/mo" },
    { key: "monthlySpending", label: "Spending", suffix: "/mo" },
    { key: "cashSavings", label: "Cash savings" },
    { key: "retirementAccounts", label: "Investments" },
  ];

  return (
    <div className="bg-white/[0.07] border border-white/15 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 gap-3 text-left"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <RefreshCw size={14} className="text-white/55 shrink-0" />
          <p className="text-sm text-white/70 truncate">
            Numbers from{" "}
            <span className="font-semibold text-white">{ageLabel}</span>
            <span className="text-white/50"> — update to refresh your results</span>
          </p>
        </div>
        {open ? (
          <ChevronUp size={16} className="text-white/45 shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-white/45 shrink-0" />
        )}
      </button>

      {open && (
        <div className="border-t border-white/10 px-5 pb-5 pt-4 flex flex-col gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {FIELDS.map(({ key, label, suffix }) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-xs text-white/60 font-medium">{label}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">
                    $
                  </span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={draft[key] || ""}
                    onChange={(e) => setField(key, e.target.value)}
                    className="w-full bg-white/90 rounded-xl text-slate-800 text-base md:text-sm py-2.5 pl-7 pr-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                  />
                  {suffix && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">
                      {suffix}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="text-xs text-white/45">
              For debts, goals & more — use{" "}
              <span className="text-white/65 font-medium">Edit checkup</span> in the nav
            </p>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shrink-0"
            >
              {saved ? (
                <>
                  <Check size={14} />
                  Updated!
                </>
              ) : (
                "Update numbers"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
