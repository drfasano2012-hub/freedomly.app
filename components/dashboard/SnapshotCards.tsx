import { TrendingUp, BarChart3 } from "lucide-react";
import { Badge, savingsRateColor, savingsRateLabel } from "@/components/ui/Badge";
import {
  formatCurrency,
  formatPercent,
  getSavingsRateTier,
  getNetWorthTier,
  getFedMedian,
  peerPercentile,
} from "@/lib/calculations";
import type { FinancialMetrics } from "@/lib/types";

interface Props {
  metrics: FinancialMetrics;
  currentAge: number;
}

export function SnapshotCards({ metrics, currentAge }: Props) {
  const { savingsRate, netWorth, annualIncome } = metrics;

  const srTier = getSavingsRateTier(savingsRate);
  const nwTier = getNetWorthTier(netWorth, annualIncome);

  const nwColor = nwTier === "strong" ? "green" : nwTier === "positive" ? "neutral" : "red";
  const nwLabel = nwTier === "strong" ? "Strong" : nwTier === "positive" ? "Positive" : "Behind";

  const fed = getFedMedian(currentAge);
  const percentile = peerPercentile(netWorth, fed.median);

  const cards = [
    {
      icon: BarChart3,
      label: "Net Worth",
      value: formatCurrency(netWorth),
      valueColor: netWorth < 0 ? "text-red-600" : "text-slate-800",
      badge: <Badge label={nwLabel} color={nwColor} />,
      sub: `Ahead of ~${percentile}% of people your age`,
    },
    {
      icon: TrendingUp,
      label: "Savings Rate",
      value: formatPercent(savingsRate, 1),
      badge: <Badge label={savingsRateLabel(srTier)} color={savingsRateColor(srTier)} />,
      sub: null,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {cards.map(({ icon: Icon, label, value, valueColor, badge, sub }) => (
        <div
          key={label}
          className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl p-4 sm:p-5 flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-600">{label}</p>
            <Icon size={14} className="text-slate-500" aria-hidden="true" />
          </div>
          <p className={`text-2xl font-bold leading-none ${valueColor ?? "text-slate-800"}`}>
            {value}
          </p>
          <div className="mt-auto flex flex-col gap-1">
            <div>{badge}</div>
            {sub && <p className="text-xs text-slate-600 leading-tight">{sub}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
