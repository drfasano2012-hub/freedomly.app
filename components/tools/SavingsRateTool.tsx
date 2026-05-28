"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { calcSavingsRateImpact } from "@/lib/calculations";

interface Props {
  initialMonthlyTakeHome?: number;
  initialAge?: number;
}

function rowColor(retirementAge: number): {
  row: string;
  age: string;
  badge: string;
  badgeBg: string;
} {
  if (retirementAge <= 55)
    return {
      row: "hover:bg-emerald-50/60",
      age: "text-emerald-700",
      badge: "FIRE",
      badgeBg: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
  if (retirementAge <= 65)
    return {
      row: "hover:bg-amber-50/60",
      age: "text-amber-600",
      badge: "Standard",
      badgeBg: "bg-amber-100 text-amber-700 border-amber-200",
    };
  return {
    row: "hover:bg-slate-100/60",
    age: "text-slate-500",
    badge: "Late",
    badgeBg: "bg-slate-100 text-slate-500 border-slate-200",
  };
}

export function SavingsRateTool({
  initialMonthlyTakeHome = 0,
  initialAge = 30,
}: Props) {
  const [takeHome, setTakeHome] = useState(String(initialMonthlyTakeHome));
  const [age, setAge] = useState(String(initialAge));

  const parse = (s: string) => parseFloat(s) || 0;
  const th = parse(takeHome);
  const a = parse(age);
  const valid = th > 0 && a > 0;

  const rows = valid ? calcSavingsRateImpact(th, a) : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Monthly take-home"
          type="number"
          min={1}
          placeholder="4,800"
          prefix="$"
          value={takeHome}
          onChange={(e) => setTakeHome(e.target.value)}
        />
        <Input
          label="Current age"
          type="number"
          min={18}
          max={70}
          placeholder="30"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
      </div>

      {valid ? (
        <div className="flex flex-col gap-4">
          {/* Legend */}
          <div className="flex flex-wrap gap-3">
            {[
              { color: "bg-emerald-500", label: "FIRE (retire ≤ 55)" },
              { color: "bg-amber-500", label: "Standard (retire ≤ 65)" },
              { color: "bg-slate-400", label: "Late (retire > 65)" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-xs text-slate-600">{label}</span>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-sm" aria-label="Savings rate impact table">
              <thead>
                <tr className="border-b border-slate-200 bg-white/70">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Savings rate
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Monthly saved
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Retire at age
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Years to freedom
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ rate, retirementAge, yearsToFreedom }) => {
                  const { row, age: ageColor, badge, badgeBg } = rowColor(retirementAge);
                  const monthlySaved = (th * rate) / 100;
                  return (
                    <tr
                      key={rate}
                      className={`border-b border-slate-200/60 transition-colors ${row}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-700">{rate}%</span>
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full border ${badgeBg}`}
                          >
                            {badge}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        ${Math.round(monthlySaved).toLocaleString()}
                      </td>
                      <td className={`px-4 py-3 font-bold ${ageColor}`}>
                        {retirementAge}
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-xs">
                        {yearsToFreedom} yrs
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Assumes 7% real annual return and starting from $0 invested. FI number = 25× annual spending.
            Each row shows: at this savings rate, how many years until your portfolio covers 25× your spending.
          </p>
        </div>
      ) : (
        <div className="bg-white/30 rounded-2xl p-6 text-center">
          <p className="text-sm text-slate-600">
            Enter your monthly take-home and age to see how savings rate impacts your retirement timeline.
          </p>
        </div>
      )}
    </div>
  );
}
