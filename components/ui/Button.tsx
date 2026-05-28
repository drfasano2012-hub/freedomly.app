import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-40 disabled:cursor-not-allowed",
        {
          "bg-emerald-500 text-white hover:bg-emerald-400 active:bg-emerald-600":
            variant === "primary",
          "bg-white/70 text-slate-700 border border-slate-200 hover:bg-white/90 hover:border-slate-300":
            variant === "secondary",
          "text-slate-500 hover:text-slate-800 hover:bg-white/50":
            variant === "ghost",
          "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100":
            variant === "danger",
        },
        {
          "text-sm px-3 py-1.5 gap-1.5": size === "sm",
          "text-sm px-4 py-2.5 gap-2": size === "md",
          "text-base px-6 py-3.5 gap-2.5": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
