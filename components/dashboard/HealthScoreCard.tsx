import { formatPercent } from "@/lib/calculations";
import type { HealthScoreBreakdown } from "@/lib/types";

interface Props {
  score: number;
  breakdown: HealthScoreBreakdown;
  potentialScore?: number;
}

function getScoreColor(score: number): string {
  if (score >= 75) return "#10b981"; // emerald
  if (score >= 50) return "#3b82f6"; // blue
  return "#ef4444"; // red
}

function getScoreLabel(score: number): string {
  if (score >= 75) return "Strong";
  if (score >= 50) return "Getting there";
  return "Needs work";
}

function getScoreDescription(score: number): string {
  if (score >= 90) return "Outstanding financial health — you're ahead of the vast majority of your peers.";
  if (score >= 75) return "You're in great financial shape. Keep optimizing and stay consistent.";
  if (score >= 50) return "You're making real progress. Focused effort will accelerate your journey.";
  if (score >= 25) return "You have some foundations, but there are important gaps to address.";
  return "Your finances need significant attention — start with the action plan below.";
}

function CircularGauge({ score }: { score: number }) {
  const radius = 52;
  const strokeWidth = 9;
  const cx = 64;
  const cy = 64;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - score / 100);
  const color = getScoreColor(score);

  return (
    <svg
      width="128"
      height="128"
      viewBox="0 0 128 128"
      className="-rotate-90"
      aria-hidden="true"
    >
      {/* Track */}
      <circle
        cx={cx} cy={cy} r={radius}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth={strokeWidth}
      />
      {/* Progress */}
      <circle
        cx={cx} cy={cy} r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
      />
    </svg>
  );
}

const BREAKDOWN_ITEMS = [
  { key: "savingsRatePoints" as const, label: "Savings rate" },
  { key: "emergencyFundPoints" as const, label: "Emergency fund" },
  { key: "debtPoints" as const, label: "Debt situation" },
  { key: "investingPoints" as const, label: "Investing readiness" },
];

export function HealthScoreCard({ score, breakdown, potentialScore }: Props) {
  const color = getScoreColor(score);
  const label = getScoreLabel(score);
  const scoreDelta = potentialScore !== undefined ? potentialScore - score : 0;

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl p-6 flex flex-col gap-5">
      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
        Financial Health Score
      </p>

      {/* Gauge + score */}
      <div className="flex items-center gap-5">
        <div className="relative shrink-0">
          <CircularGauge score={score} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-3xl font-bold leading-none"
              style={{ color }}
            >
              {score}
            </span>
            <span className="text-xs text-slate-500 mt-0.5">/100</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 min-w-0">
          <span
            className="text-sm font-semibold"
            style={{ color }}
          >
            {label}
          </span>
          <p className="text-xs text-slate-500 leading-relaxed">
            {getScoreDescription(score)}
          </p>
          {scoreDelta >= 5 && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5 w-fit mt-0.5">
              ↑ {potentialScore} possible with open Next Moves
            </span>
          )}
        </div>
      </div>

      {/* Breakdown */}
      <div className="border-t border-slate-200 pt-4 flex flex-col gap-2.5">
        {BREAKDOWN_ITEMS.map(({ key, label: itemLabel }) => {
          const pts = breakdown[key];
          const display = Math.round((pts / 25) * 10);
          const pct = (pts / 25) * 100;
          const barColor = display >= 8 ? "#10b981" : display >= 4 ? "#3b82f6" : "#ef4444";
          return (
            <div key={key} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">{itemLabel}</span>
                <span className="text-xs font-medium text-slate-600">
                  {display}/10
                </span>
              </div>
              <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: barColor,
                    transition: "width 0.6s ease-out",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
