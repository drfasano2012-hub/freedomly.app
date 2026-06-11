import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  prefix?: string;
  suffix?: string;
  optional?: boolean;
}

export function Input({
  label,
  hint,
  error,
  prefix,
  suffix,
  optional,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-slate-800"
        >
          {label}
        </label>
        {optional && (
          <span className="text-xs text-slate-500">Optional</span>
        )}
      </div>
      {hint && <p className="text-xs text-slate-500 -mt-1">{hint}</p>}
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3.5 text-slate-500 text-sm pointer-events-none select-none">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          className={cn(
            "w-full bg-white/80 border rounded-xl text-slate-800 placeholder:text-slate-400 text-base md:text-sm py-3 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50",
            error ? "border-red-500/60" : "border-slate-200 hover:border-slate-300",
            prefix ? "pl-8" : "pl-4",
            suffix ? "pr-10" : "pr-4",
            className
          )}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3.5 text-slate-500 text-sm pointer-events-none select-none">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
