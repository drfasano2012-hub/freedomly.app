"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Input } from "@/components/ui/Input";
import { calcCompoundGrowth, formatCurrencyFull } from "@/lib/calculations";

interface Props {
  initialStartingAmount?: number;
  initialMonthlyContribution?: number;
}

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const contributed = payload[0]?.value ?? 0;
  const growth = payload[1]?.value ?? 0;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 text-xs shadow-xl">
      <p className="text-slate-500 mb-2 font-medium">Year {label}</p>
      <p className="text-slate-500">Contributed: {formatCurrencyFull(contributed)}</p>
      <p className="text-emerald-600">Growth: {formatCurrencyFull(growth)}</p>
      <p className="text-slate-800 font-semibold mt-1 pt-1 border-t border-slate-200">
        Total: {formatCurrencyFull(contributed + growth)}
      </p>
    </div>
  );
};

export function CompoundGrowthTool({
  initialStartingAmount = 0,
  initialMonthlyContribution = 0,
}: Props) {
  const [starting, setStarting] = useState(String(initialStartingAmount));
  const [monthly, setMonthly] = useState(String(initialMonthlyContribution));
  const [years, setYears] = useState("30");
  const [annualReturn, setAnnualReturn] = useState("7");

  const parse = (s: string) => parseFloat(s) || 0;

  const s = parse(starting);
  const m = parse(monthly);
  const y = Math.min(50, Math.max(1, parse(years)));
  const r = parse(annualReturn) / 100;

  const valid = (s > 0 || m > 0) && y > 0 && r > 0;
  const result = valid ? calcCompoundGrowth(s, m, y, r) : null;

  const chartData = result?.yearlyData.map((d) => ({
    year: d.year,
    contributed: d.contributed,
    growth: Math.max(0, d.value - d.contributed),
  })) ?? [];

  // Show every-5-year ticks if years > 20
  const tickEvery = y > 20 ? 5 : y > 10 ? 2 : 1;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Starting amount"
          type="number"
          min={0}
          placeholder="0"
          prefix="$"
          hint="Current invested balance"
          value={starting}
          onChange={(e) => setStarting(e.target.value)}
        />
        <Input
          label="Monthly contribution"
          type="number"
          min={0}
          placeholder="500"
          prefix="$"
          value={monthly}
          onChange={(e) => setMonthly(e.target.value)}
        />
        <Input
          label="Time horizon"
          type="number"
          min={1}
          max={50}
          placeholder="30"
          suffix="yrs"
          value={years}
          onChange={(e) => setYears(e.target.value)}
        />
        <Input
          label="Annual return"
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

      {result ? (
        <div className="flex flex-col gap-5">
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/60 border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-xs text-slate-600 mb-1">Final value</p>
              <p className="text-lg font-bold text-slate-800">{fmt(result.finalValue)}</p>
            </div>
            <div className="bg-white/60 border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-xs text-slate-600 mb-1">You contributed</p>
              <p className="text-lg font-bold text-slate-500">{fmt(result.totalContributed)}</p>
            </div>
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 text-center">
              <p className="text-xs text-emerald-600 mb-1">Market grew</p>
              <p className="text-lg font-bold text-emerald-700">{fmt(result.interestEarned)}</p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white/60 border border-slate-200 rounded-2xl p-4 sm:p-5">
            <p className="text-xs text-slate-600 mb-4">Portfolio growth over {y} years</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={chartData}
                margin={{ top: 4, right: 4, bottom: 0, left: 0 }}
                barCategoryGap="15%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="year"
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  interval={tickEvery - 1}
                  tickFormatter={(v) => `Yr ${v}`}
                />
                <YAxis
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={fmt}
                  width={48}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                <Bar dataKey="contributed" stackId="a" fill="#94a3b8" radius={[0, 0, 0, 0]} />
                <Bar dataKey="growth" stackId="a" fill="#10b981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-5 mt-3 justify-center">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-slate-400" />
                <span className="text-xs text-slate-600">Contributed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                <span className="text-xs text-slate-600">Growth</span>
              </div>
            </div>
          </div>

          {result.interestEarned > result.totalContributed && (
            <p className="text-xs text-emerald-600 text-center">
              Compound growth contributed more than you did —{" "}
              {((result.interestEarned / result.finalValue) * 100).toFixed(0)}% of the final value is market growth.
            </p>
          )}
        </div>
      ) : (
        <div className="bg-white/30 rounded-2xl p-6 text-center">
          <p className="text-sm text-slate-600">Enter a starting amount or monthly contribution to see your growth.</p>
        </div>
      )}
    </div>
  );
}
