import { TrendingUp, Wallet, Shield, BarChart3 } from "lucide-react";
import { Badge, savingsRateColor, savingsRateLabel, emergencyFundColor, emergencyFundLabel } from "@/components/ui/Badge";
import { formatCurrency, formatPercent, getSavingsRateTier, getEmergencyFundTier, getSurplusTier, getNetWorthTier } from "@/lib/calculations";
import type { FinancialMetrics } from "@/lib/types";

interface Props {
  metrics: FinancialMetrics;
  monthlyTakeHome: number;
}

export function SnapshotCards({ metrics, monthlyTakeHome }: Props) {
  const {
    savingsRate,
    monthlySurplus,
    emergencyFundMonths,
    netWorth,
    annualIncome,
  } = metrics;

  const srTier = getSavingsRateTier(savingsRate);
  const efTier = getEmergencyFundTier(emergencyFundMonths);
  const surplusTier = getSurplusTier(monthlySurplus, monthlyTakeHome);
  const nwTier = getNetWorthTier(netWorth, annualIncome);

  const surplusColor = surplusTier === "healthy" ? "green" : surplusTier === "thin" ? "neutral" : "red";
  const surplusLabel = surplusTier === "healthy" ? "Healthy" : surplusTier === "thin" ? "Thin" : "Deficit";
  const nwColor = nwTier === "strong" ? "green" : nwTier === "positive" ? "neutral" : "red";
  const nwLabel = nwTier === "strong" ? "Strong" : nwTier === "positive" ? "Positive" : "Behind";

  const cards = [
    {
      icon: TrendingUp,
      label: "Savings Rate",
      value: formatPercent(savingsRate, 1),
      badge: <Badge label={savingsRateLabel(srTier)} color={savingsRateColor(srTier)} />,
    },
    {
      icon: Wallet,
      label: "Monthly Surplus",
      value: `${monthlySurplus < 0 ? "-" : "+"}${formatCurrency(Math.abs(monthlySurplus))}`,
      valueColor: monthlySurplus < 0 ? "text-red-600" : "text-slate-800",
      badge: <Badge label={surplusLabel} color={surplusColor} />,
    },
    {
      icon: Shield,
      label: "Emergency Fund",
      value: `${emergencyFundMonths.toFixed(1)} mo`,
      badge: <Badge label={emergencyFundLabel(efTier)} color={emergencyFundColor(efTier)} />,
    },
    {
      icon: BarChart3,
      label: "Net Worth",
      value: formatCurrency(netWorth),
      valueColor: netWorth < 0 ? "text-red-600" : "text-slate-800",
      badge: <Badge label={nwLabel} color={nwColor} />,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ icon: Icon, label, value, valueColor, badge }) => (
        <div
          key={label}
          className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl p-4 sm:p-5 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-600">{label}</p>
            <Icon size={14} className="text-slate-500" aria-hidden="true" />
          </div>
          <p className={`text-2xl font-bold leading-none ${valueColor ?? "text-slate-800"}`}>
            {value}
          </p>
          <div>{badge}</div>
        </div>
      ))}
    </div>
  );
}
