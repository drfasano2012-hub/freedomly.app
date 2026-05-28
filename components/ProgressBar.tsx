interface ProgressBarProps {
  current: number;
  total: number;
  labels?: string[];
}

export function ProgressBar({ current, total, labels }: ProgressBarProps) {
  const pct = Math.round(((current - 1) / (total - 1)) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-white/50">
          Step {current} of {total}
        </span>
        {labels && (
          <span className="text-xs font-medium text-emerald-400">
            {labels[current - 1]}
          </span>
        )}
      </div>
      <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={1}
          aria-valuemax={total}
        />
      </div>
    </div>
  );
}
