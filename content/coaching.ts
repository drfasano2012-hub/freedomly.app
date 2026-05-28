export interface InsightCard {
  quote: string;
  principle: string;
  expansion: string;
}

export interface FrameworkPillar {
  number: number;
  title: string;
  description: string;
}

export interface Principle {
  number: string; // "01" – "05"
  title: string;
  content: string;
}

export interface CommonMistake {
  title: string;
  content: string;
}

export const INSIGHT_CARDS: InsightCard[] = [
  {
    quote: "The best budget is the one you'll actually use.",
    principle: "Find your system, not the 'right' system",
    expansion:
      "Zero-based budgeting, the 50/30/20 rule, envelope budgeting — they all work if you stick with them. They all fail if you don't. Stop searching for the perfect system and start building the habit of awareness. The methodology is secondary to the consistency.",
  },
  {
    quote: "Save what's left at the end of the month and nothing will be left.",
    principle: "Pay yourself first. Automate it.",
    expansion:
      "Reverse the order. The moment your paycheck hits, move your savings to a separate account automatically. What remains is what you spend. This isn't discipline — it's design. Remove the decision entirely and the behavior follows.",
  },
  {
    quote: "You can't gain with the S&P 500 while taking on less risk.",
    principle: "Participation beats prediction",
    expansion:
      "Trying to time the market — moving to cash when things look bad, buying back in when they look good — consistently underperforms simply staying invested. The price of equity returns is volatility. Accept the volatility, collect the returns. Staying in is the strategy.",
  },
];

export const FRAMEWORK_PILLARS: FrameworkPillar[] = [
  {
    number: 1,
    title: "Defense first",
    description:
      "Before you optimize returns, protect what you have. Emergency fund fully funded. High-interest debt eliminated. Insurance in place. A financial life without a foundation is one bad month away from collapse.",
  },
  {
    number: 2,
    title: "Then offense",
    description:
      "Once your defense is solid, go on offense. Max tax-advantaged accounts. Increase your savings rate. Invest consistently in low-cost index funds. Let compound growth work. Offense without defense is gambling.",
  },
  {
    number: 3,
    title: "Optimize the gap",
    description:
      "The gap between income and expenses is the only number that matters. Grow it from both sides — earning more and spending less. Each dollar added to the gap is a dollar building your future. The gap is the game.",
  },
  {
    number: 4,
    title: "Buy back time",
    description:
      "Money is a tool. The goal is optionality — the ability to choose how you spend your hours. Use your accumulating wealth to gradually reduce obligations, buy flexibility, and eventually make work optional. Freedom, not just retirement.",
  },
];

export const PRINCIPLES: Principle[] = [
  {
    number: "01",
    title: "Pay yourself first",
    content:
      "Savings should never be what's left over — they should be the first line item. Automate a transfer to savings and investments the moment your paycheck arrives. What remains is your spending budget. This single habit has more impact than any budgeting system, investment strategy, or financial optimization. It removes the decision entirely.",
  },
  {
    number: "02",
    title: "The FI number is just math",
    content:
      "Financial independence isn't a dream — it's arithmetic. Your FI number is 25× your annual spending. Your timeline to FI is determined by your savings rate. These are variables you control directly. The sooner you treat FI as a math problem rather than a distant aspiration, the sooner you can build a concrete path to it.",
  },
  {
    number: "03",
    title: "Simple beats sophisticated",
    content:
      "The optimal portfolio for most people is boring: a total US market fund, an international fund, and a bond fund. Three funds, rebalanced annually. This portfolio has matched or beaten the vast majority of sophisticated strategies over 20+ year periods. Complexity in investing usually serves the advisor's interests, not yours. Simple, low-cost, consistent beats clever.",
  },
  {
    number: "04",
    title: "The enemy is lifestyle inflation",
    content:
      "Every raise is an opportunity to increase your savings rate — or an opportunity to increase your spending. Most people, unconsciously, do the latter. The car gets nicer. The apartment gets bigger. The restaurants get fancier. And somehow there's never more money to invest. Guard your savings rate with each income increase. Let your lifestyle follow your net worth, not your gross income.",
  },
  {
    number: "05",
    title: "Behavior matters more than knowledge",
    content:
      "Every financially literate person knows they should save more, pay off high-interest debt, and invest in index funds. Knowing isn't the bottleneck — doing is. Build systems that make the right behavior automatic: automate savings, auto-invest monthly, set up automatic debt payoff. Reduce the number of financial decisions you make manually. The goal is to make good choices the default.",
  },
];

export const COMMON_MISTAKES: CommonMistake[] = [
  {
    title: "Waiting to invest until you 'have enough'",
    content:
      "There is no threshold of financial readiness after which you should start investing. The cost of waiting is real and compounding: every year you delay is a year of compound growth you never recover. Starting with $50/month beats waiting five years to start with $500/month. The best investors aren't the ones who invested the most — they're the ones who started earliest.",
  },
  {
    title: "Keeping too much in cash 'just in case'",
    content:
      "An emergency fund of 3–6 months of expenses is essential. Anything beyond that is a drag on your net worth. Cash loses 3–4% per year to inflation in real terms. A $50,000 emergency fund that should be $15,000 means $35,000 is slowly being eroded by inflation instead of compounding in the market. Fund the emergency fund, then deploy the rest.",
  },
  {
    title: "Paying off low-interest debt before investing",
    content:
      "If your debt is below 7% APR — most mortgages, federal student loans — the math of investing first is clear. A 3% mortgage while the market historically returns 7% means every extra dollar toward your mortgage has a 4% opportunity cost over time. Make minimum payments on low-rate debt. Invest the difference. This isn't comfortable advice, but it's mathematically sound.",
  },
  {
    title: "Treating net worth like a personality flaw",
    content:
      "Many people avoid looking at their financial picture because they're afraid of what they'll find. This avoidance is the most expensive financial mistake of all. You cannot change what you don't measure. A clear picture — even a bad one — is the first step to a better one. Freedomly was built because clarity, not perfection, is what changes behavior.",
  },
];
