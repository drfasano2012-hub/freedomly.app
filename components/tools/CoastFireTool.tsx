"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { calcCoastFire, formatCurrencyFull, formatPercent } from "@/lib/calculations";

interface Props {
  initialAge?: number;
  initialInvested?: number;
}

export function CoastFireTool({ initialAge = 30, initialInvested = 0 }: Props) {
  const [currentAge, setCurrentAge] = useState(String(initialAge));
  const [retirementAge, setRetirementAge] = useState("65");
  const [annualSpending, setAnnualSpending] = useState("60000");
  const [invested, setInvested] = useState(String(initialInvested));
  const [annualReturn, setAnnualReturn] = useState("7");

  const parse = (s: string) => parseFloat(s) || 0;

  const ca = parse(currentAge);
  const ra = parse(retirementAge);
  const sp = parse(annualSpending);
  const inv = parse(invested);
  const ret = parse(annualReturn) / 100;

  const valid = ca > 0 && ra > ca && sp > 0 && ret > 0;
  const result = valid ? calcCoastFire(ca, ra, sp, inv, ret) : null;

  const progressPct = result
    ? Math.min(100, (inv / result.coastFireNumber) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Current age"
          type="number"
          min={18}
          max={80}
          placeholder="30"
          value={currentAge}
          onChange={(e) => setCurrentAge(e.target.value)}
        />
        <Input
          label="Target retirement age"
          type="number"
          min={30}
          max={80}
          placeholder="65"
          value={retirementAge}
          onChange={(e) => setRetirementAge(e.target.value)}
        />
        <Input
          label="Annual spending in retirement"
          type="number"
          min={0}
          placeholder="60,000"
          prefix="$"
          value={annualSpending}
          onChange={(e) => setAnnualSpending(e.target.value)}
        />
        <Input
          label="Currently invested"
          type="number"
          min={0}
          placeholder="0"
          prefix="$"
          hint="Retirement + brokerage + HSA"
          value={invested}
          onChange={(e) => setInvested(e.target.value)}
        />
        <Input
          label="Expected annual return"
          type="number"
          min={1}
          max={20}
          step={0.5}
          placeholder="7"
          suffix="%"
          value={annualReturn}
          onChange={(e) => setAnnualReturn(e.target.value)}
        />
      </div>

      {/* Results */}
      {result ? (
        <div className="flex flex-col gap-4">
          {result.reached ? (
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 flex items-start gap-3">
              <CheckCircle2 size={18} className="text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-700 mb-1">
                  You&rsquo;ve reached Coast FIRE!
                </p>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Your current investments of {formatCurrencyFull(inv)} will grow to your freedom number of{" "}
                  {formatCurrencyFull(result.fiNumber)} by age {retirementAge} at {formatPercent(ret, 0)} annual
                  return — without any additional contributions.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white/50 border border-slate-200 rounded-2xl p-5 flex flex-col gap-4">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Results</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <ResultCard
                  label="Freedom number"
                  value={formatCurrencyFull(result.fiNumber)}
                  hint={`25× $${sp.toLocaleString()} annual spending`}
                />
                <ResultCard
                  label="Coast FIRE number"
                  value={formatCurrencyFull(result.coastFireNumber)}
                  hint={`Needed now to coast to FI by ${retirementAge}`}
                  highlight
                />
                <ResultCard
                  label="Gap to invest"
                  value={formatCurrencyFull(result.gap)}
                  hint="Additional lump sum needed today"
                  negative={result.gap > 0}
                />
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-600">Progress toward Coast FIRE</span>
                  <span className="text-xs font-medium text-slate-600">{progressPct.toFixed(0)}%</span>
                </div>
                <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          <p className="text-xs text-slate-400 leading-relaxed">
            Coast FIRE = (Annual Spending × 25) ÷ (1 + r)^years to retirement.
            Once you hit this number, compound growth alone carries you to FI — no further contributions needed.
          </p>
        </div>
      ) : (
        <div className="bg-white/30 rounded-2xl p-6 text-center">
          <p className="text-sm text-slate-600">Fill in the inputs above to see your Coast FIRE number.</p>
        </div>
      )}
    </div>
  );
}

function ResultCard({
  label,
  value,
  hint,
  highlight,
  negative,
}: {
  label: string;
  value: string;
  hint?: string;
  highlight?: boolean;
  negative?: boolean;
}) {
  return (
    <div className={`rounded-xl p-4 border ${highlight ? "bg-emerald-50/80 border-emerald-200" : "bg-white/60 border-slate-200"}`}>
      <p className="text-xs text-slate-600 mb-1">{label}</p>
      <p className={`text-xl font-bold ${negative ? "text-amber-600" : highlight ? "text-emerald-700" : "text-slate-800"}`}>
        {value}
      </p>
      {hint && <p className="text-xs text-slate-500 mt-1 leading-snug">{hint}</p>}
    </div>
  );
}
