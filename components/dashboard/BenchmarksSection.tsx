import { Badge, savingsRateColor, savingsRateLabel, emergencyFundColor, emergencyFundLabel, fidelityColor, fidelityLabel } from "@/components/ui/Badge";
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

// Rough "% of peers you're ahead of," estimated from the age-group median.
// Net worth is ~log-normal; this approximates the percentile from the median.
function peerPercentile(netWorth: number, median: number): number {
  if (median <= 0) return 50;
  if (netWorth <= 0) return 4;
  const z = Math.log(netWorth / median) / 1.8; // ~SCF within-age spread
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  let tail = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  const cdf = z > 0 ? 1 - tail : tail;
  return Math.round(Math.min(99, Math.max(1, cdf * 100)));
}

export function BenchmarksSection({ metrics, currentAge }: Props) {
  const { fidelityBenchmark, savingsRate, emergencyFundMonths, netWorth } = metrics;
  const fedData = getFedMedian(currentAge);
  const aboveMedian = netWorth >= fedData.median;
  const percentile = peerPercentile(netWorth, fedData.median);

  const srTier = getSavingsRateTier(savingsRate);
  const efTier = getEmergencyFundTier(emergencyFundMonths);

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
      {/* Net worth — simple: total + where you stand vs peers */}
      <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl p-5 sm:p-6">
        <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
          Net Worth Today
        </p>

        <p className={`text-4xl font-bold leading-none mb-3 ${netWorth < 0 ? "text-red-600" : "text-slate-800"}`}>
          {formatCurrencyFull(netWorth)}
        </p>

        <p className="text-sm font-semibold mb-3">
          <span className={aboveMedian ? "text-emerald-600" : "text-blue-600"}>
            Ahead of ~{percentile}% of people your age
          </span>
        </p>

        {/* Peer position bar */}
        <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${percentile}%`, backgroundColor: aboveMedian ? "#10b981" : "#3b82f6" }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
          <span>Behind peers</span>
          <span>Ahead of peers</span>
        </div>

        <p className="text-xs text-slate-500 mt-3">
          Estimated from Federal Reserve data — the median net worth for ages {fedData.ageGroup} is{" "}
          {formatCurrencyFull(fedData.median)}.
        </p>
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
