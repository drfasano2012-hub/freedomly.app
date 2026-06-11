import type { GoalHorizon, RiskTolerance } from "./types";

// Shared between the checkup chat and the dashboard "sharpen your plan" card.

export const GOALS: { id: string; label: string; horizon: GoalHorizon }[] = [
  { id: "emergency_fund", label: "Build emergency fund", horizon: "short" },
  { id: "pay_debt", label: "Pay off debt", horizon: "short" },
  { id: "vacation", label: "Save for vacation / travel", horizon: "short" },
  { id: "buy_home", label: "Buy a home", horizon: "mid" },
  { id: "start_business", label: "Start a business", horizon: "mid" },
  { id: "education", label: "Kids' education fund", horizon: "mid" },
  { id: "retire", label: "Retire comfortably", horizon: "long" },
  { id: "fi", label: "Achieve financial independence", horizon: "long" },
];

export const RISK_OPTIONS: { value: RiskTolerance; label: string; icon: string }[] = [
  { value: "conservative", label: "Conservative", icon: "🛡️" },
  { value: "moderate", label: "Moderate", icon: "⚖️" },
  { value: "aggressive", label: "Aggressive", icon: "🚀" },
];
