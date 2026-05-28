import type { RiskTolerance, Goal } from "@/lib/types";

interface Props {
  riskTolerance: RiskTolerance;
  currentAge: number;
  goals: Goal[];
}

interface Allocation {
  stocks: number;
  bonds: number;
  cash: number;
  label: string;
  profile: "conservative" | "moderate" | "aggressive";
  description: string;
  rationale: string;
}

function getAllocation(riskTolerance: RiskTolerance, currentAge: number): Allocation {
  // Age-based adjustment: soften aggressive if older, soften conservative if young
  const isYoung = currentAge < 35;
  const isMidlife = currentAge >= 35 && currentAge < 55;
  const isNearRetirement = currentAge >= 55;

  if (riskTolerance === "aggressive") {
    if (isNearRetirement) {
      return {
        stocks: 70, bonds: 25, cash: 5,
        label: "Growth-Oriented",
        profile: "aggressive",
        description: "High equity exposure for long-term compounding.",
        rationale: `At ${currentAge}, a growth tilt still makes sense, but a modest bond allocation reduces sequence-of-returns risk as retirement approaches.`,
      };
    }
    return {
      stocks: 90, bonds: 8, cash: 2,
      label: "Aggressive Growth",
      profile: "aggressive",
      description: "Maximum long-term growth — accepts short-term volatility.",
      rationale: `At ${currentAge} with a long time horizon, high equity exposure maximizes compounding. Short-term dips are buying opportunities, not threats.`,
    };
  }

  if (riskTolerance === "conservative") {
    if (isYoung) {
      return {
        stocks: 55, bonds: 35, cash: 10,
        label: "Balanced-Conservative",
        profile: "conservative",
        description: "Capital preservation with modest growth potential.",
        rationale: `Even with a conservative temperament, at ${currentAge} you have decades of compounding ahead. A meaningful equity slice protects against inflation over time.`,
      };
    }
    return {
      stocks: 35, bonds: 50, cash: 15,
      label: "Conservative",
      profile: "conservative",
      description: "Stability-first — bonds anchor the portfolio against drawdowns.",
      rationale: `With a conservative risk profile${isNearRetirement ? " and proximity to retirement" : ""}, prioritizing capital preservation makes sense. Bonds provide income and cushion volatility.`,
    };
  }

  // Moderate (default)
  if (isYoung) {
    return {
      stocks: 75, bonds: 20, cash: 5,
      label: "Balanced Growth",
      profile: "moderate",
      description: "Growth-leaning balance — equities lead, bonds cushion.",
      rationale: `At ${currentAge} with decades to grow, equities do the heavy lifting. A bond allocation adds resilience without sacrificing too much upside.`,
    };
  }
  if (isMidlife) {
    return {
      stocks: 65, bonds: 30, cash: 5,
      label: "Balanced",
      profile: "moderate",
      description: "A 65/30/5 split balances growth with increasing stability.",
      rationale: `In your mid-career years, a balanced approach keeps compounding working while gradually adding stability as retirement becomes more tangible.`,
    };
  }
  return {
    stocks: 50, bonds: 40, cash: 10,
    label: "Moderate-Conservative",
    profile: "moderate",
    description: "Balanced with a defensive tilt as retirement nears.",
    rationale: `At ${currentAge}, shifting toward a more defensive posture reduces the impact of a market downturn close to when you'd start drawing down.`,
  };
}

function getGoalContext(goals: Goal[]): string | null {
  if (!goals || goals.length === 0) return null;
  const hasFire = goals.some(g => g.label?.toLowerCase().includes("retire") || g.label?.toLowerCase().includes("fire") || g.label?.toLowerCase().includes("financial independence"));
  const hasShortTerm = goals.some(g => g.horizon === "short");
  if (hasFire) return "Your FIRE goal favors equity-heavy growth to accelerate compounding toward financial independence.";
  if (hasShortTerm) return "With short-term goals in your plan, keeping a cash buffer ensures you're not forced to sell equities at a bad time.";
  return null;
}

const PROFILE_COLORS = {
  conservative: { stocks: "bg-sky-400", bonds: "bg-slate-400", cash: "bg-slate-300", tag: "bg-sky-100 text-sky-700 border-sky-200" },
  moderate: { stocks: "bg-emerald-500", bonds: "bg-sky-400", cash: "bg-slate-300", tag: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  aggressive: { stocks: "bg-emerald-500", bonds: "bg-sky-400", cash: "bg-slate-300", tag: "bg-violet-100 text-violet-700 border-violet-200" },
};

export function PortfolioAllocation({ riskTolerance, currentAge, goals }: Props) {
  const allocation = getAllocation(riskTolerance, currentAge);
  const goalContext = getGoalContext(goals);
  const colors = PROFILE_COLORS[allocation.profile];

  const riskLabel = riskTolerance === "aggressive" ? "Aggressive" : riskTolerance === "conservative" ? "Conservative" : "Moderate";

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Portfolio Allocation
        </p>
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${colors.tag}`}>
          {riskLabel} profile
        </span>
      </div>

      {/* Recommendation headline */}
      <div className="flex flex-col gap-1">
        <p className="text-xl font-bold text-slate-800">{allocation.label}</p>
        <p className="text-sm text-slate-600">{allocation.description}</p>
      </div>

      {/* Allocation bar */}
      <div>
        <div className="flex h-7 rounded-xl overflow-hidden gap-px">
          <div
            className={`${colors.stocks} flex items-center justify-center transition-all duration-500`}
            style={{ width: `${allocation.stocks}%` }}
          >
            <span className="text-xs font-bold text-white drop-shadow-sm hidden sm:block">
              {allocation.stocks}%
            </span>
          </div>
          <div
            className={`${colors.bonds} flex items-center justify-center transition-all duration-500`}
            style={{ width: `${allocation.bonds}%` }}
          >
            <span className="text-xs font-bold text-white drop-shadow-sm hidden sm:block">
              {allocation.bonds}%
            </span>
          </div>
          <div
            className={`${colors.cash} flex items-center justify-center transition-all duration-500`}
            style={{ width: `${allocation.cash}%` }}
          >
            <span className="text-xs font-bold text-slate-600 hidden sm:block">
              {allocation.cash}%
            </span>
          </div>
        </div>
        <div className="flex items-center gap-5 mt-2.5">
          {[
            { color: colors.stocks, label: `Stocks`, value: `${allocation.stocks}%` },
            { color: colors.bonds, label: `Bonds`, value: `${allocation.bonds}%` },
            { color: colors.cash, label: `Cash`, value: `${allocation.cash}%` },
          ].map(({ color, label, value }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
              <span className="text-xs text-slate-600 font-medium">{label}</span>
              <span className="text-xs text-slate-400">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rationale */}
      <div className="border-t border-slate-200 pt-4 flex flex-col gap-2">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Why this recommendation</p>
        <p className="text-sm text-slate-600 leading-relaxed">{allocation.rationale}</p>
        {goalContext && (
          <p className="text-sm text-slate-500 leading-relaxed">{goalContext}</p>
        )}
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        This is an educational framework, not investment advice. Consult a financial advisor for personalized guidance.
      </p>
    </div>
  );
}
