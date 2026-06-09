import { Badge, fidelityColor, fidelityLabel } from "@/components/ui/Badge";
import { formatCurrencyFull } from "@/lib/calculations";
import type { FinancialMetrics } from "@/lib/types";

interface Props {
  metrics: FinancialMetrics;
  currentAge: number;
}

// Retirement vs. Fidelity milestone — the one peer benchmark not already shown
// in the consolidated snapshot (net worth, savings rate, emergency fund live there).
export function BenchmarksSection({ metrics, currentAge }: Props) {
  const { fidelityBenchmark, totalInvestments } = metrics;
  const progress =
    fidelityBenchmark.targetAmount > 0
      ? Math.min(100, (totalInvestments / fidelityBenchmark.targetAmount) * 100)
      : null;

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-700">Retirement savings</p>
          <p className="text-xs text-slate-500 mt-0.5">Fidelity milestone for age {currentAge}</p>
        </div>
        <Badge label={fidelityLabel(fidelityBenchmark.tier)} color={fidelityColor(fidelityBenchmark.tier)} />
      </div>
      <p className="text-2xl font-bold text-slate-800">{formatCurrencyFull(totalInvestments)}</p>
      <div className="border-t border-slate-200 pt-3 flex flex-col gap-2">
        <p className="text-xs text-slate-600">
          Target: {fidelityBenchmark.targetMultiple}× salary ({formatCurrencyFull(fidelityBenchmark.targetAmount)})
        </p>
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
      </div>
    </div>
  );
}
