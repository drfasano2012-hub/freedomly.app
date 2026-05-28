import type {
  UserInputs,
  FinancialMetrics,
  HealthScoreBreakdown,
  FreedomAgeResult,
  MNDBenchmarkResult,
  FidelityBenchmarkResult,
  PortfolioAllocationResult,
  ActionPlanResult,
  ActionItem,
  SavingsRateTier,
  EmergencyFundTier,
  SurplusTier,
  NetWorthTier,
  MNDTier,
  FidelityTier,
  AllocationProfile,
} from "./types";

// ─── Basic metrics ────────────────────────────────────────────────────────────

export function calcMonthlySurplus(takeHome: number, spending: number): number {
  return takeHome - spending;
}

export function calcSavingsRate(takeHome: number, spending: number): number {
  if (takeHome <= 0) return 0;
  return Math.max(0, (takeHome - spending) / takeHome);
}

export function calcEmergencyFundMonths(cash: number, spending: number): number {
  if (spending <= 0) return 0;
  return cash / spending;
}

export function calcTotalInvestments(inputs: UserInputs): number {
  return (
    inputs.retirementAccounts +
    inputs.brokerageAccounts +
    inputs.hsaAccounts
  );
}

export function calcTotalDebt(inputs: UserInputs): number {
  return inputs.debts.reduce((sum, d) => sum + d.balance, 0);
}

export function calcWeightedAvgDebtRate(inputs: UserInputs): number {
  const total = calcTotalDebt(inputs);
  if (total <= 0) return 0;
  const weighted = inputs.debts.reduce((sum, d) => sum + d.balance * d.rate, 0);
  return weighted / total;
}

export function calcHighInterestDebt(inputs: UserInputs): number {
  return inputs.debts
    .filter((d) => d.rate > 0.1)
    .reduce((sum, d) => sum + d.balance, 0);
}

export function calcNetWorth(inputs: UserInputs): number {
  return (
    inputs.cashSavings +
    calcTotalInvestments(inputs) -
    calcTotalDebt(inputs)
  );
}

export function resolveAnnualIncome(inputs: UserInputs): number {
  return inputs.annualIncome > 0
    ? inputs.annualIncome
    : inputs.monthlyTakeHome * 12;
}

// ─── Health Score (0–100, four 25-point components) ──────────────────────────

export function calcHealthScore(inputs: UserInputs): {
  score: number;
  breakdown: HealthScoreBreakdown;
} {
  const savingsRate = calcSavingsRate(inputs.monthlyTakeHome, inputs.monthlySpending);
  const efMonths = calcEmergencyFundMonths(inputs.cashSavings, inputs.monthlySpending);
  const totalInvested = calcTotalInvestments(inputs);
  const highInterest = calcHighInterestDebt(inputs);
  const avgRate = calcWeightedAvgDebtRate(inputs);
  const surplus = calcMonthlySurplus(inputs.monthlyTakeHome, inputs.monthlySpending);

  // Savings rate: 25 pts — full points at 15%+
  const savingsRatePoints =
    savingsRate >= 0.15 ? 25
    : savingsRate >= 0.08 ? 20
    : savingsRate >= 0.03 ? 13
    : savingsRate > 0 ? 7
    : 0;

  // Emergency fund: 25 pts — full points at 3+ months
  const emergencyFundPoints =
    efMonths >= 3 ? 25
    : efMonths >= 1 ? 18
    : efMonths >= 0.5 ? 10
    : 0;

  // Debt: 25 pts — more credit for low-rate debt
  const debtPoints =
    calcTotalDebt(inputs) === 0 ? 25
    : highInterest === 0 && avgRate < 0.08 ? 22
    : highInterest === 0 ? 17
    : highInterest > 0 && avgRate < 0.15 ? 10
    : 5;

  // Investing: 25 pts — lower threshold for full points
  const isStrongReadiness = efMonths >= 1 && highInterest === 0 && surplus > 0;
  const investingPoints =
    isStrongReadiness && totalInvested >= 25000 ? 25
    : isStrongReadiness && totalInvested > 0 ? 22
    : isStrongReadiness ? 18
    : totalInvested > 0 ? 14
    : surplus > 0 ? 8
    : 0;

  const score = savingsRatePoints + emergencyFundPoints + debtPoints + investingPoints;

  return {
    score,
    breakdown: {
      savingsRatePoints,
      emergencyFundPoints,
      debtPoints,
      investingPoints,
    },
  };
}

// ─── Freedom Age (iterative projection) ──────────────────────────────────────

export function calcFreedomAge(inputs: UserInputs): FreedomAgeResult {
  const annualSpending = inputs.monthlySpending * 12;
  const fiNumber = annualSpending * 25;
  const monthlyRate = 0.07 / 12;
  const surplus = calcMonthlySurplus(inputs.monthlyTakeHome, inputs.monthlySpending);
  const totalInvested = calcTotalInvestments(inputs);
  const startingValue = totalInvested + inputs.cashSavings;

  if (startingValue >= fiNumber) {
    return {
      status: "already_reached",
      freedomAge: inputs.currentAge,
      yearsToFreedom: 0,
      fiNumber,
      monthsToFreedom: 0,
    };
  }

  if (surplus <= 0) {
    return {
      status: "no_surplus",
      freedomAge: null,
      yearsToFreedom: null,
      fiNumber,
      monthsToFreedom: null,
    };
  }

  let fv = startingValue;
  let months = 0;
  const maxMonths = 600; // 50-year cap

  while (fv < fiNumber && months < maxMonths) {
    fv = fv * (1 + monthlyRate) + surplus;
    months++;
  }

  if (months >= maxMonths) {
    return {
      status: "over_50_years",
      freedomAge: null,
      yearsToFreedom: null,
      fiNumber,
      monthsToFreedom: null,
    };
  }

  const yearsToFreedom = months / 12;
  const freedomAge = inputs.currentAge + yearsToFreedom;

  return {
    status: "normal",
    freedomAge: Math.round(freedomAge),
    yearsToFreedom: Math.round(yearsToFreedom * 10) / 10,
    fiNumber,
    monthsToFreedom: months,
  };
}

// ─── Millionaire Next Door benchmark ─────────────────────────────────────────

export function calcMNDBenchmark(
  age: number,
  annualIncome: number,
  netWorth: number
): MNDBenchmarkResult {
  const clampedAge = Math.max(25, Math.min(70, age));
  const expectedNetWorth = (clampedAge * annualIncome) / 10;

  const tier: MNDTier =
    netWorth >= expectedNetWorth * 2 ? "prodigious"
    : netWorth >= expectedNetWorth ? "on_track"
    : netWorth >= expectedNetWorth * 0.5 ? "building"
    : "behind";

  return { expectedNetWorth, tier };
}

// ─── Fidelity retirement milestones ──────────────────────────────────────────

export function calcFidelityBenchmark(
  age: number,
  annualIncome: number,
  retirementAccounts: number
): FidelityBenchmarkResult {
  const milestones: [number, number][] = [
    [30, 1],
    [35, 2],
    [40, 3],
    [45, 4],
    [50, 6],
    [55, 7],
    [60, 8],
    [67, 10],
  ];

  let targetMultiple = 0.5; // under 30
  for (const [milestoneAge, multiple] of milestones) {
    if (age >= milestoneAge) targetMultiple = multiple;
  }

  const targetAmount = annualIncome * targetMultiple;

  const ratio = targetAmount > 0 ? retirementAccounts / targetAmount : 0;
  const tier: FidelityTier =
    ratio >= 1 ? "on_track"
    : ratio >= 0.75 ? "close"
    : ratio >= 0.5 ? "behind"
    : "well_behind";

  return { targetMultiple, targetAmount, tier };
}

// ─── Portfolio allocation ─────────────────────────────────────────────────────

export function calcPortfolioAllocation(score: number): PortfolioAllocationResult {
  if (score <= 6) {
    return { profile: "conservative", stocks: 40, bonds: 40, cash: 20, label: "Conservative — stability-focused" };
  }
  if (score <= 9) {
    return { profile: "moderate", stocks: 60, bonds: 30, cash: 10, label: "Moderate — balanced growth" };
  }
  return { profile: "aggressive", stocks: 80, bonds: 15, cash: 5, label: "Aggressive — long-term growth" };
}

// ─── Action plan ──────────────────────────────────────────────────────────────

export function generateActionPlan(
  inputs: UserInputs,
  metrics: {
    savingsRate: number;
    emergencyFundMonths: number;
    highInterestDebt: number;
    totalInvestments: number;
    monthlySurplus: number;
  }
): ActionPlanResult {
  const goingWell: string[] = [];
  const needsAttention: string[] = [];
  const topActions: ActionItem[] = [];

  const { savingsRate, emergencyFundMonths, highInterestDebt, totalInvestments, monthlySurplus } = metrics;

  // What's going well
  if (savingsRate >= 0.2) goingWell.push("Excellent savings rate — you're building wealth fast");
  else if (savingsRate >= 0.1) goingWell.push("Solid savings rate above 10%");
  if (emergencyFundMonths >= 6) goingWell.push("Fully-funded emergency fund — you're protected");
  else if (emergencyFundMonths >= 3) goingWell.push("Adequate emergency fund in place");
  if (highInterestDebt === 0 && calcTotalDebt(inputs) > 0) goingWell.push("No high-interest debt — your debt is manageable");
  if (calcTotalDebt(inputs) === 0) goingWell.push("Debt-free — a powerful financial position");
  if (totalInvestments > 0) goingWell.push("You're investing — compound growth is working for you");
  if (monthlySurplus > 0) goingWell.push("Positive monthly cash flow — you have room to grow");

  // Needs attention
  if (highInterestDebt > 0) needsAttention.push("High-interest debt is costing you significant returns");
  if (emergencyFundMonths < 3) needsAttention.push("Emergency fund is below the 3-month safety threshold");
  if (savingsRate < 0.1) needsAttention.push("Savings rate below 10% limits long-term wealth building");
  if (totalInvestments === 0 && monthlySurplus > 0) needsAttention.push("No investments yet — idle money loses to inflation");

  // Prioritized top 3 actions
  const candidates: ActionItem[] = [
    {
      id: "high_interest_debt",
      text: "Eliminate high-interest debt",
      detail: `You have ${formatCurrency(highInterestDebt)} in debt above 10% APR. No investment reliably beats 10%+ guaranteed returns from paying this off.`,
    },
    {
      id: "emergency_fund",
      text: "Build your 3-month emergency fund",
      detail: `You currently have ${emergencyFundMonths.toFixed(1)} months covered. Aim for ${inputs.monthlySpending * 3 > inputs.cashSavings ? formatCurrency(inputs.monthlySpending * 3 - inputs.cashSavings) + " more" : "your current target"} to reach 3 months.`,
    },
    {
      id: "savings_rate",
      text: "Push your savings rate to 15%",
      detail: `You're currently saving ${Math.round(savingsRate * 100)}% of take-home. Each extra 1% saved is years off your freedom age.`,
    },
    {
      id: "roth_ira",
      text: "Open a Roth IRA",
      detail: "You have a positive surplus but no investments yet. A Roth IRA grows tax-free — start with even $50/month.",
    },
    {
      id: "max_tax_advantaged",
      text: "Maximize tax-advantaged accounts",
      detail: "Contribute enough to your 401(k) to capture any employer match, then max your Roth IRA ($7,000/year for 2024).",
    },
    {
      id: "audit_expenses",
      text: "Audit your recurring subscriptions",
      detail: "A one-time expense audit typically uncovers $100–300/month in forgotten subscriptions and unused services.",
    },
  ];

  // Apply priority order from PRD §6.2.7
  if (highInterestDebt > 0) topActions.push(candidates[0]);
  if (emergencyFundMonths < 3) topActions.push(candidates[1]);
  if (savingsRate < 0.15) topActions.push(candidates[2]);
  if (totalInvestments === 0 && monthlySurplus > 0) topActions.push(candidates[3]);
  if (totalInvestments > 0) topActions.push(candidates[4]);
  topActions.push(candidates[5]);

  return {
    goingWell: goingWell.slice(0, 5),
    needsAttention: needsAttention.slice(0, 4),
    topActions: topActions.slice(0, 3),
  };
}

// ─── Master metrics calculator ────────────────────────────────────────────────

export function calcAllMetrics(inputs: UserInputs): FinancialMetrics {
  const monthlySurplus = calcMonthlySurplus(inputs.monthlyTakeHome, inputs.monthlySpending);
  const savingsRate = calcSavingsRate(inputs.monthlyTakeHome, inputs.monthlySpending);
  const emergencyFundMonths = calcEmergencyFundMonths(inputs.cashSavings, inputs.monthlySpending);
  const totalDebt = calcTotalDebt(inputs);
  const weightedAvgDebtRate = calcWeightedAvgDebtRate(inputs);
  const highInterestDebt = calcHighInterestDebt(inputs);
  const totalInvestments = calcTotalInvestments(inputs);
  const netWorth = calcNetWorth(inputs);
  const annualIncome = resolveAnnualIncome(inputs);
  const { score: healthScore, breakdown: healthScoreBreakdown } = calcHealthScore(inputs);
  const freedomAge = calcFreedomAge(inputs);
  const mndBenchmark = calcMNDBenchmark(inputs.currentAge, annualIncome, netWorth);
  const fidelityBenchmark = calcFidelityBenchmark(inputs.currentAge, annualIncome, inputs.retirementAccounts);

  const actionPlan = generateActionPlan(inputs, {
    savingsRate,
    emergencyFundMonths,
    highInterestDebt,
    totalInvestments,
    monthlySurplus,
  });

  return {
    monthlySurplus,
    savingsRate,
    emergencyFundMonths,
    totalDebt,
    weightedAvgDebtRate,
    highInterestDebt,
    totalInvestments,
    netWorth,
    annualIncome,
    healthScore,
    healthScoreBreakdown,
    freedomAge,
    mndBenchmark,
    fidelityBenchmark,
    actionPlan,
    portfolioAllocation: calcPortfolioAllocation(6), // default; updated by quiz
  };
}

// ─── Tier helpers ─────────────────────────────────────────────────────────────

export function getSavingsRateTier(rate: number): SavingsRateTier {
  if (rate >= 0.25) return "fire_track";
  if (rate >= 0.15) return "strong";
  if (rate >= 0.05) return "average";
  return "behind";
}

export function getEmergencyFundTier(months: number): EmergencyFundTier {
  if (months >= 6) return "fully_funded";
  if (months >= 3) return "adequate";
  if (months >= 1) return "building";
  return "critical";
}

export function getSurplusTier(surplus: number, takeHome: number): SurplusTier {
  if (surplus < 0) return "deficit";
  if (surplus / takeHome < 0.05) return "thin";
  return "healthy";
}

export function getNetWorthTier(netWorth: number, annualIncome: number): NetWorthTier {
  if (netWorth >= annualIncome) return "strong";
  if (netWorth >= 0) return "positive";
  return "behind";
}

// ─── Coast FIRE calculator ────────────────────────────────────────────────────

export function calcCoastFire(
  currentAge: number,
  retirementAge: number,
  annualRetirementSpending: number,
  currentlyInvested: number,
  annualReturn: number
): {
  fiNumber: number;
  coastFireNumber: number;
  gap: number;
  reached: boolean;
} {
  const fiNumber = annualRetirementSpending * 25;
  const years = retirementAge - currentAge;
  const coastFireNumber = fiNumber / Math.pow(1 + annualReturn, years);
  const gap = Math.max(0, coastFireNumber - currentlyInvested);

  return {
    fiNumber,
    coastFireNumber,
    gap,
    reached: currentlyInvested >= coastFireNumber,
  };
}

// ─── Compound growth calculator ───────────────────────────────────────────────

export function calcCompoundGrowth(
  startingAmount: number,
  monthlyContribution: number,
  years: number,
  annualReturn: number
): {
  finalValue: number;
  totalContributed: number;
  interestEarned: number;
  yearlyData: { year: number; value: number; contributed: number }[];
} {
  const monthlyRate = annualReturn / 12;
  const months = years * 12;
  const totalContributed = startingAmount + monthlyContribution * months;

  let fv = startingAmount;
  const yearlyData: { year: number; value: number; contributed: number }[] = [];

  for (let m = 1; m <= months; m++) {
    fv = fv * (1 + monthlyRate) + monthlyContribution;
    if (m % 12 === 0) {
      const year = m / 12;
      yearlyData.push({
        year,
        value: Math.round(fv),
        contributed: Math.round(startingAmount + monthlyContribution * m),
      });
    }
  }

  return {
    finalValue: Math.round(fv),
    totalContributed: Math.round(totalContributed),
    interestEarned: Math.round(fv - totalContributed),
    yearlyData,
  };
}

// ─── Savings rate impact table ────────────────────────────────────────────────

export function calcSavingsRateImpact(
  monthlyTakeHome: number,
  currentAge: number
): { rate: number; retirementAge: number; yearsToFreedom: number }[] {
  const rates = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

  return rates.map((ratePct) => {
    const rate = ratePct / 100;
    const spending = monthlyTakeHome * (1 - rate);
    const surplus = monthlyTakeHome * rate;
    const annualSpending = spending * 12;
    const fiNumber = annualSpending * 25;
    const monthlyReturn = 0.07 / 12;

    let fv = 0;
    let months = 0;
    while (fv < fiNumber && months < 600) {
      fv = fv * (1 + monthlyReturn) + surplus;
      months++;
    }

    const yearsToFreedom = months >= 600 ? 50 : months / 12;
    const retirementAge = Math.round(currentAge + yearsToFreedom);

    return { rate: ratePct, retirementAge, yearsToFreedom: Math.round(yearsToFreedom) };
  });
}

// ─── Sample data ──────────────────────────────────────────────────────────────

export function getSampleData(): UserInputs {
  return {
    currentAge: 32,
    annualIncome: 75000,
    monthlyTakeHome: 4800,
    monthlySpending: 3200,
    cashSavings: 2000,
    retirementAccounts: 18000,
    brokerageAccounts: 0,
    hsaAccounts: 0,
    debts: [
      { id: "d1", name: "Student loan", balance: 22000, rate: 0.06 },
    ],
    goals: [
      { id: "g1", label: "Pay off debt", horizon: "short" },
      { id: "g2", label: "Buy a home", horizon: "mid" },
      { id: "g3", label: "Retire comfortably", horizon: "long" },
    ],
    riskTolerance: "moderate",
  };
}

// ─── Formatting utilities ────────────────────────────────────────────────────

export function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return `$${Math.round(value).toLocaleString()}`;
}

export function formatCurrencyFull(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number, decimals = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}
