import { cn } from "@/lib/utils";

type BadgeColor = "green" | "amber" | "red" | "blue" | "neutral";

interface BadgeProps {
  label: string;
  color: BadgeColor;
  className?: string;
}

const COLOR_CLASSES: Record<BadgeColor, string> = {
  green: "bg-emerald-100 text-emerald-700 border-emerald-200",
  amber: "bg-amber-100 text-amber-700 border-amber-200",
  red: "bg-red-100 text-red-700 border-red-200",
  blue: "bg-sky-100 text-sky-700 border-sky-200",
  neutral: "bg-slate-100 text-slate-500 border-slate-200",
};

export function Badge({ label, color, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        COLOR_CLASSES[color],
        className
      )}
    >
      {label}
    </span>
  );
}

// Tier → color helpers

export function savingsRateColor(tier: string): BadgeColor {
  switch (tier) {
    case "fire_track": return "blue";
    case "strong": return "green";
    case "average": return "neutral";
    default: return "red";
  }
}

export function savingsRateLabel(tier: string): string {
  switch (tier) {
    case "fire_track": return "FIRE track";
    case "strong": return "Strong";
    case "average": return "Average";
    default: return "Behind";
  }
}

export function emergencyFundColor(tier: string): BadgeColor {
  switch (tier) {
    case "fully_funded": return "blue";
    case "adequate": return "green";
    case "building": return "neutral";
    default: return "red";
  }
}

export function emergencyFundLabel(tier: string): string {
  switch (tier) {
    case "fully_funded": return "Fully funded";
    case "adequate": return "Adequate";
    case "building": return "Building";
    default: return "Critical";
  }
}

export function mndColor(tier: string): BadgeColor {
  switch (tier) {
    case "prodigious": return "blue";
    case "on_track": return "green";
    case "building": return "neutral";
    default: return "red";
  }
}

export function mndLabel(tier: string): string {
  switch (tier) {
    case "prodigious": return "Prodigious";
    case "on_track": return "On track";
    case "building": return "Building";
    default: return "Behind";
  }
}

export function fidelityColor(tier: string): BadgeColor {
  switch (tier) {
    case "on_track": return "green";
    case "close": return "neutral";
    case "behind": return "neutral";
    default: return "red";
  }
}

export function fidelityLabel(tier: string): string {
  switch (tier) {
    case "on_track": return "On track";
    case "close": return "Close";
    case "behind": return "Behind";
    default: return "Well behind";
  }
}
