export interface Debt {
  id: string;
  name: string;
  balance: number;
  rate: number; // APR as decimal, e.g. 0.22 for 22%
}

export type GoalHorizon = "short" | "mid" | "long";

export interface Goal {
  id: string;
  label: string;
  horizon: GoalHorizon;
}

export type RiskTolerance = "conservative" | "moderate" | "aggressive";

export type EmploymentType = "w2" | "self_employed" | "business_owner" | "not_employed";

export interface UserInputs {
  currentAge: number;
  annualIncome: number; // optional — defaults to monthlyTakeHome * 12
  monthlyTakeHome: number;
  monthlySpending: number;
  cashSavings: number;
  retirementAccounts: number;
  brokerageAccounts: number;
  hsaAccounts: number;
  debts: Debt[];
  goals: Goal[];
  riskTolerance: RiskTolerance;
  employmentType: EmploymentType; // older localStorage records may lack this → default "w2" on read
}

// All derived metrics — never persisted
export interface FinancialMetrics {
  monthlySurplus: number;
  savingsRate: number; // 0–1
  emergencyFundMonths: number;
  totalDebt: number;
  weightedAvgDebtRate: number;
  highInterestDebt: number; // total balance of debts >10% APR
  totalInvestments: number;
  netWorth: number;
  annualIncome: number; // resolved (input or derived)
  healthScore: number; // 0–100
  healthScoreBreakdown: HealthScoreBreakdown;
  freedomAge: FreedomAgeResult;
  mndBenchmark: MNDBenchmarkResult;
  fidelityBenchmark: FidelityBenchmarkResult;
  actionPlan: ActionPlanResult;
  portfolioAllocation: PortfolioAllocationResult;
}

export interface HealthScoreBreakdown {
  savingsRatePoints: number; // /25
  emergencyFundPoints: number; // /25
  debtPoints: number; // /25
  investingPoints: number; // /25
}

export type FreedomAgeStatus = "no_surplus" | "over_50_years" | "normal" | "already_reached";

export interface FreedomAgeResult {
  status: FreedomAgeStatus;
  freedomAge: number | null;
  yearsToFreedom: number | null;
  fiNumber: number;
  monthsToFreedom: number | null;
}

export type MNDTier = "behind" | "building" | "on_track" | "prodigious";

export interface MNDBenchmarkResult {
  expectedNetWorth: number;
  tier: MNDTier;
}

export type FidelityTier = "well_behind" | "behind" | "close" | "on_track";

export interface FidelityBenchmarkResult {
  targetMultiple: number;
  targetAmount: number;
  tier: FidelityTier;
}

export type AllocationProfile = "conservative" | "moderate" | "aggressive";

export interface PortfolioAllocationResult {
  profile: AllocationProfile;
  stocks: number; // percentage
  bonds: number;
  cash: number;
  label: string;
}

export interface ActionItem {
  id: string;
  text: string;
  detail: string;
  impact?: string;
}

export interface ActionPlanResult {
  goingWell: string[];
  needsAttention: string[];
  topActions: ActionItem[];
}

// Savings rate benchmark tiers
export type SavingsRateTier = "behind" | "average" | "strong" | "fire_track";

// Emergency fund tiers
export type EmergencyFundTier = "critical" | "building" | "adequate" | "fully_funded";

// Monthly surplus tiers
export type SurplusTier = "deficit" | "thin" | "healthy";

// Net worth snapshot tiers
export type NetWorthTier = "behind" | "positive" | "strong";
