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

/** Years to financial freedom under a hypothetical plan — same 7%/4%, 25× model as calcFreedomAge. */
export function yearsToFreedomGiven(p: {
  monthlyInvestment: number;
  monthlySpending: number;
  startingValue: number;
}): number | null {
  const fiNumber = p.monthlySpending * 12 * 25;
  const r = 0.07 / 12;
  if (p.startingValue >= fiNumber) return 0;
  if (p.monthlyInvestment <= 0) return null;
  let fv = p.startingValue;
  let m = 0;
  while (fv < fiNumber && m < 600) {
    fv = fv * (1 + r) + p.monthlyInvestment;
    m++;
  }
  return m >= 600 ? null : m / 12;
}

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
  const { savingsRate, emergencyFundMonths, highInterestDebt, totalInvestments, monthlySurplus } = metrics;
  const emp = inputs.employmentType ?? "w2";
  const selfEmployed = emp === "self_employed" || emp === "business_owner";

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

  // ── FI-impact action engine: rank moves by years off the freedom date ──
  const startingValue = totalInvestments + inputs.cashSavings;
  const baseYears = yearsToFreedomGiven({
    monthlyInvestment: monthlySurplus,
    monthlySpending: inputs.monthlySpending,
    startingValue,
  });
  const projectedAge = baseYears !== null ? inputs.currentAge + baseYears : null;

  type Cand = ActionItem & { tier: number; impactYears?: number; eligible: boolean };
  const cands: Cand[] = [];

  // Tier 0 — risk-gated to the top
  if (highInterestDebt > 0) {
    const annualInterest = inputs.debts
      .filter((d) => d.rate >= 0.1)
      .reduce((s, d) => s + d.balance * d.rate, 0);
    cands.push({
      tier: 0, eligible: true, id: "high_interest_debt",
      text: "Eliminate high-interest debt",
      detail: `You have ${formatCurrency(highInterestDebt)} above 10% APR. No investment reliably beats that — paying it off is a guaranteed return.`,
      impact: `${formatCurrency(annualInterest)}/yr in interest — a guaranteed return`,
    });
  }
  if (emergencyFundMonths < 3) {
    const gap = inputs.monthlySpending * 3 - inputs.cashSavings;
    cands.push({
      tier: 0, eligible: true, id: "emergency_floor",
      text: "Build a 3-month safety floor",
      detail: `You have ${emergencyFundMonths.toFixed(1)} months covered. ${gap > 0 ? `Set aside ${formatCurrency(gap)} more` : "You're nearly there"} to reach 3 months — enough to protect your plan without over-hoarding cash you could be investing.`,
      impact: "Protects your plan from a setback",
    });
  }

  // Tier 1 — prerequisites & free money
  if (monthlySurplus <= 0) {
    cands.push({
      tier: 1, eligible: true, id: "create_surplus",
      text: "Create a positive monthly surplus",
      detail: "Your spending meets or exceeds your take-home, so there's nothing to invest yet. Freeing up even $200/month — by trimming expenses or raising income — starts your path to freedom.",
      impact: "The first step — starts the clock",
    });
  }
  if (emp === "w2") {
    cands.push({
      tier: 1, eligible: true, id: "capture_match",
      text: "Capture your full employer match",
      detail: "If your employer matches 401(k) contributions, put in at least enough to get all of it — an instant 50–100% return you can't get anywhere else.",
      impact: "Instant 50–100% return — free money",
    });
  }

  // Tier 2 — the FI engine (ranked by years off your freedom date)
  if (monthlySurplus > 0) {
    const cut = Math.max(200, Math.round((inputs.monthlySpending * 0.1) / 50) * 50);
    const cutYears = yearsToFreedomGiven({
      monthlyInvestment: monthlySurplus + cut,
      monthlySpending: Math.max(0, inputs.monthlySpending - cut),
      startingValue,
    });
    const cutDelta = baseYears !== null && cutYears !== null ? baseYears - cutYears : undefined;
    cands.push({
      tier: 2, eligible: true, id: "cut_spending",
      text: `Trim ${formatCurrency(cut)}/mo from your spending`,
      detail: `Cutting ${formatCurrency(cut)}/mo does double duty — it frees ${formatCurrency(cut)} more to invest AND lowers your freedom number by ${formatCurrency(cut * 12 * 25)} (you need 25× less).`,
      impact: cutDelta !== undefined && cutDelta >= 0.5 ? `Free ~${Math.round(cutDelta)} yr${Math.round(cutDelta) !== 1 ? "s" : ""} sooner` : "Lowers your freedom number",
      impactYears: cutDelta,
    });

    const more = Math.max(200, Math.round((inputs.monthlyTakeHome * 0.05) / 50) * 50);
    const moreYears = yearsToFreedomGiven({
      monthlyInvestment: monthlySurplus + more,
      monthlySpending: inputs.monthlySpending,
      startingValue,
    });
    const moreDelta = baseYears !== null && moreYears !== null ? baseYears - moreYears : undefined;
    cands.push({
      tier: 2, eligible: true, id: "invest_more",
      text: `Invest ${formatCurrency(more)} more each month`,
      detail: `Adding ${formatCurrency(more)}/mo to what you invest compounds at 7% and pulls your freedom date closer.`,
      impact: moreDelta !== undefined && moreDelta >= 0.5 ? `Free ~${Math.round(moreDelta)} yr${Math.round(moreDelta) !== 1 ? "s" : ""} sooner` : "Speeds up your timeline",
      impactYears: moreDelta,
    });
  }

  if (totalInvestments === 0 && monthlySurplus > 0) {
    cands.push({
      tier: 2, eligible: true, id: "start_investing",
      text: selfEmployed ? "Open a Solo 401(k) or brokerage and start investing" : "Open a Roth IRA or brokerage and start investing",
      detail: selfEmployed
        ? "You have a surplus but nothing invested. Idle cash earns ~0% and loses to inflation; invested at 7% it starts the clock toward freedom."
        : "You have a surplus but nothing invested. A Roth IRA (contributions stay accessible) or a taxable brokerage puts that money to work — even $50/month starts compounding.",
      impact: "Idle cash earns ~7%/yr vs 0%",
      impactYears: (baseYears ?? 50) + 1, // top tier-2 move when you're not yet investing
    });
  }

  // FI-first accessibility: freedom well before 59½ but money is locked in retirement accounts
  const retirementHeavy = inputs.retirementAccounts > inputs.brokerageAccounts + inputs.hsaAccounts;
  if (totalInvestments > 0 && projectedAge !== null && projectedAge < 59.5 && retirementHeavy) {
    cands.push({
      tier: 2, eligible: true, id: "accessible_investing",
      text: "Build money you can use before 59½",
      detail: "You're on track to reach freedom before 59½, but most of your investments sit in retirement accounts locked until then. After any employer match, route extra into a taxable brokerage or Roth (contributions are always withdrawable) so your money is reachable when you're free — a Roth conversion ladder or 72(t) can bridge the rest.",
      impact: "Keeps your freedom money reachable",
      impactYears: 0.4,
    });
  }

  // Tier 3 — optimize
  cands.push({
    tier: 3, eligible: true, id: "optimize_allocation",
    text: "Right-size your investment mix",
    detail: "Match your stock/bond split to your risk tolerance and timeline, keep fees low with broad index funds, and avoid sitting in more cash than you need.",
    impact: "Tune for steady long-term growth",
  });

  const topActions: ActionItem[] = cands
    .filter((c) => c.eligible)
    .sort((a, b) => {
      if (a.tier !== b.tier) return a.tier - b.tier;
      if (a.tier === 2) return (b.impactYears ?? -1) - (a.impactYears ?? -1);
      return 0;
    })
    .slice(0, 3)
    .map(({ id, text, detail, impact }) => ({ id, text, detail, impact }));

  return {
    goingWell: goingWell.slice(0, 5),
    needsAttention: needsAttention.slice(0, 4),
    topActions,
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
    employmentType: "w2",
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

// ─── Peer comparison (Federal Reserve SCF 2023 median net worth by age) ──────────
export function getFedMedian(age: number): { median: number; ageGroup: string } {
  if (age < 35) return { median: 39_000, ageGroup: "under 35" };
  if (age < 45) return { median: 135_600, ageGroup: "35–44" };
  if (age < 55) return { median: 247_200, ageGroup: "45–54" };
  if (age < 65) return { median: 364_500, ageGroup: "55–64" };
  return { median: 409_900, ageGroup: "65+" };
}

/** Rough "% of peers you're ahead of," estimated from the age-group median (log-normal). */
export function peerPercentile(netWorth: number, median: number): number {
  if (median <= 0) return 50;
  if (netWorth <= 0) return 4;
  const z = Math.log(netWorth / median) / 1.8; // ~SCF within-age spread
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const tail = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  const cdf = z > 0 ? 1 - tail : tail;
  return Math.round(Math.min(99, Math.max(1, cdf * 100)));
}
