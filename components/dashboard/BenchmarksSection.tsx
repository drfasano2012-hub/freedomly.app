import { Badge, mndColor, mndLabel, savingsRateColor, savingsRateLabel, emergencyFundColor, emergencyFundLabel, fidelityColor, fidelityLabel } from "@/components/ui/Badge";
import { formatCurrencyFull, formatPercent, getSavingsRateTier, getEmergencyFundTier } from "@/lib/calculations";
import type { FinancialMetrics } from "@/lib/types";

interface Props {
  metrics: FinancialMetrics;
  currentAge: number;
}

// 2023 Federal Reserve Survey of Consumer Finances — median net worth by age
function getFedMedian(age: number): { median: number; ageGroup: string } {
  if (age < 35) return { median: 39_000, ageGroup: "under 35" };
  if (age < 45) return { median: 135_600, ageGroup: "35–44" };
  if (age < 55) return { median: 247_200, ageGroup: "45–54" };
  if (age < 65) return { median: 364_500, ageGroup: "55–64" };
  return { median: 409_900, ageGroup: "65+" };
}

export function BenchmarksSection({ metrics, currentAge }: Props) {
  const { mndBenchmark, fidelityBenchmark, savingsRate, emergencyFundMonths, netWorth, annualIncome } = metrics;
  const fedData = getFedMedian(currentAge);
  const aboveMedian = netWorth >= fedData.median;

  const srTier = getSavingsRateTier(savingsRate);
  const efTier = getEmergencyFundTier(emergencyFundMonths);

  // Net worth vs target
  const target = mndBenchmark.expectedNetWorth;
  const nwProgressPct = target > 0 ? Math.min(100, Math.max(0, (netWorth / target) * 100)) : 0;
  const nwGap = netWorth - target;
  const aboveTarget = nwGap >= 0;

  const benchmarkCards = [
    {
      title: "Savings rate",
      source: "Bureau of Economic Analysis",
      value: formatPercent(savingsRate, 1),
      target: "Target: 15%+ of take-home",
      badge: <Badge label={savingsRateLabel(srTier)} color={savingsRateColor(srTier)} />,
      detail: "US avg personal savings rate: ~3–5%",
      progress: null,
    },
    {
      title: "Retirement savings",
      source: "Fidelity Investments",
      value: formatCurrencyFull(metrics.totalInvestments),
      target: `Target: ${fidelityBenchmark.targetMultiple}× salary (${formatCurrencyFull(fidelityBenchmark.targetAmount)})`,
      badge: <Badge label={fidelityLabel(fidelityBenchmark.tier)} color={fidelityColor(fidelityBenchmark.tier)} />,
      detail: `Fidelity milestone for age ${currentAge}`,
      progress: fidelityBenchmark.targetAmount > 0
        ? Math.min(100, (metrics.totalInvestments / fidelityBenchmark.targetAmount) * 100)
        : null,
    },
    {
      title: "Emergency fund",
      source: "CFP Board",
      value: `${emergencyFundMonths.toFixed(1)} months`,
      target: "Target: 3–6 months of expenses",
      badge: <Badge label={emergencyFundLabel(efTier)} color={emergencyFundColor(efTier)} />,
      detail: "3 months minimum; 6 months recommended",
      progress: Math.min(100, (emergencyFundMonths / 6) * 100),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Net worth hero card */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Net Worth Today
          </p>
          <Badge label={mndLabel(mndBenchmark.tier)} color={mndColor(mndBenchmark.tier)} />
        </div>

        {/* Hero number */}
        <div className="flex flex-col gap-1 mb-4">
          <p className={`text-4xl font-bold leading-none ${netWorth < 0 ? "text-red-600" : "text-slate-800"}`}>
            {formatCurrencyFull(netWorth)}
          </p>
          <p className={`text-sm font-medium ${aboveTarget ? "text-emerald-600" : "text-red-500"}`}>
            {aboveTarget
              ? `+${formatCurrencyFull(nwGap)} above target`
              : `${formatCurrencyFull(Math.abs(nwGap))} below target`}
          </p>
        </div>

        {/* Progress bar: current → target */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-600">Progress to target ({formatCurrencyFull(target)})</span>
            <span className="text-xs font-medium text-slate-700">{nwProgressPct.toFixed(0)}%</span>
          </div>
          <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${nwProgressPct}%`,
                backgroundColor: aboveTarget ? "#10b981" : nwProgressPct >= 60 ? "#3b82f6" : "#ef4444",
              }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1.5">
            Target based on age ({currentAge}) × income ÷ 10 — a widely used net worth benchmark
          </p>
        </div>

        {/* Secondary stats */}
        <div className="border-t border-slate-200 pt-4 flex flex-wrap gap-x-8 gap-y-3">
          <div>
            <p className="text-xs text-slate-500">Age</p>
            <p className="text-sm font-semibold text-slate-800">{currentAge}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Annual income</p>
            <p className="text-sm font-semibold text-slate-800">{formatCurrencyFull(annualIncome)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Fed Reserve median ({fedData.ageGroup})</p>
            <p className={`text-sm font-semibold ${aboveMedian ? "text-emerald-600" : "text-slate-600"}`}>
              {formatCurrencyFull(fedData.median)}{" "}
              <span className="text-xs font-normal text-slate-500">
                — you&rsquo;re {aboveMedian ? "above" : "below"} median
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Other benchmark cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {benchmarkCards.map(({ title, source, value, target: cardTarget, badge, detail, progress }) => (
          <div
            key={title}
            className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl p-5 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-700">{title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{source}</p>
              </div>
              {badge}
            </div>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
            <div className="border-t border-slate-200 pt-3 flex flex-col gap-2">
              <p className="text-xs text-slate-600">{cardTarget}</p>
              {progress !== null && (
                <div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: progress >= 100 ? "#10b981" : progress >= 60 ? "#3b82f6" : "#ef4444",
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{progress.toFixed(0)}% of target</p>
                </div>
              )}
              <p className="text-xs text-slate-400">{detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
