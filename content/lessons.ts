import type { Track, Lesson } from "@/lib/types";

export const TRACKS: Track[] = [
  {
    id: "savings-rate",
    title: "Savings Rate",
    description: "Why the gap between income and spending is your most powerful lever",
    pillarKey: "savingsRatePoints",
    badge: "💰",
  },
  {
    id: "emergency-fund",
    title: "Emergency Fund",
    description: "Build the cushion that keeps one bad month from setting you back years",
    pillarKey: "emergencyFundPoints",
    badge: "🛡️",
  },
  {
    id: "debt",
    title: "Debt",
    description: "Not all debt is equal — learn what to kill first and when to stop",
    pillarKey: "debtPoints",
    badge: "✂️",
  },
  {
    id: "investing",
    title: "Investing",
    description: "Put time on your side with the most accessible wealth-building tool ever created",
    pillarKey: "investingPoints",
    badge: "📈",
  },
];

export const LESSONS: Lesson[] = [
  // ─── Savings Rate ────────────────────────────────────────────────────────────
  {
    id: "sr-1",
    trackId: "savings-rate",
    order: 1,
    title: "Why the gap between income and spending is everything",
    xp: 50,
    relatedActionId: "cut_spending",
    cards: [
      {
        heading: "It's not how much you earn",
        body: "Your savings rate — the percentage of take-home pay you keep — determines more about your financial future than your income, your job title, or your investment picks. A high earner who spends everything they make will never be financially free. Someone earning less who keeps 20% gets there.",
      },
      {
        heading: "A double accelerant",
        body: "Raising your savings rate does two things at once: it grows your wealth faster (more money compounding) and shrinks the portfolio you need to retire (lower spending = smaller FI number). When you go from 5% to 20%, the math isn't 4× better — it's dramatically more powerful because both forces compound.",
      },
      {
        heading: "The numbers don't lie",
        body: "At a 10% savings rate, most people need about 43 years to reach financial independence. At 25%, that drops to ~25 years. At 50%, under 17 years. This isn't linear — it's exponential. Every percentage point you gain buys back years of your life.",
      },
      {
        heading: "Small moves, huge outcomes",
        body: "Most Americans save 3–5% of income — a path to working until your late 60s and hoping Social Security covers the rest. But small, sustained improvements compound into radically different outcomes. Going from 5% to 10% is enormous. Going from 10% to 15% is enormous again.",
      },
    ],
    quickCheck: {
      question: "What makes the savings rate a 'double accelerant' for financial freedom?",
      options: [
        "It earns a higher interest rate than other strategies",
        "It grows your wealth faster AND lowers the nest egg you need",
        "It reduces your taxes automatically",
      ],
      correctIndex: 1,
      explanation:
        "Saving more means you're investing more AND your annual spending is lower — which means your FI number (25× spending) shrinks at the same time. Both forces pull the finish line toward you.",
    },
  },
  {
    id: "sr-2",
    trackId: "savings-rate",
    order: 2,
    title: "Finding your 3% without a budget",
    xp: 50,
    relatedActionId: "audit_expenses",
    cards: [
      {
        heading: "Budgets fail most people",
        body: "Tracking every dollar is exhausting, and most people quit within weeks. The good news: you don't need a full budget to raise your savings rate. You need to find where money is leaking — not account for every drop.",
      },
      {
        heading: "The subscription audit",
        body: "Open your last two months of bank or credit card statements. Highlight every recurring charge. Most people find 3–5 things they forgot about or barely use. Canceling $60/month of dead subscriptions is a 3% savings rate boost on a $2,000 take-home — and it took 20 minutes.",
      },
      {
        heading: "The 'version down' move",
        body: "In every major spending category, find one downgrade you won't really notice. Not deprivation — just one level down. Premium streaming bundle → one service. Next car → same model, one year older. Restaurant weekly → takeout instead. Each decision is low-friction and adds up fast.",
      },
      {
        heading: "1% at a time",
        body: "You don't need to find 15% overnight. Raise your savings rate by 1% and give yourself a month to adjust. You'll adapt faster than you expect. Do it again the next month. Six months of this and you're in a fundamentally different financial position — without ever feeling deprived.",
      },
    ],
    quickCheck: {
      question: "What's the most effective first step to raise your savings rate without budgeting?",
      options: [
        "Cut all discretionary spending immediately",
        "Audit recurring charges to eliminate things you barely use",
        "Increase your income before reducing spending",
      ],
      correctIndex: 1,
      explanation:
        "Recurring charges are the easiest win — they're automatic drains you've stopped thinking about. Eliminating them takes one decision and permanently raises your savings rate. Cutting all discretionary spending at once usually leads to burnout.",
    },
  },
  {
    id: "sr-3",
    trackId: "savings-rate",
    order: 3,
    title: "Make it automatic before you spend it",
    xp: 50,
    relatedActionId: "savings_rate",
    cards: [
      {
        heading: "Willpower has a daily limit",
        body: "You will not consistently choose saving over spending by relying on discipline every single month. Life happens. Willpower is a finite resource. The solution is to remove the choice entirely — automate your savings before you ever see the money.",
      },
      {
        heading: "Pay yourself first",
        body: "On the same day your paycheck arrives, a pre-set transfer moves money to savings or investing — before you see it, before you can spend it. What's left in your checking account is your spending money. This is called 'paying yourself first,' and it works because it reverses the default order.",
      },
      {
        heading: "The setup is a one-time 20 minutes",
        body: "Most employers let you split your direct deposit — send X% to savings, the rest to checking. If not, schedule an automatic transfer from your bank for the day after payday. Set the amount at what's uncomfortable but doable. Then forget it. The system runs without you.",
      },
      {
        heading: "Raises that disappear into savings",
        body: "Every raise that never hits your checking account permanently increases your savings rate. When you get a pay increase, raise your automatic savings transfer before lifestyle inflation claims it. This single habit, maintained over a working life, outperforms almost every other financial move.",
      },
    ],
    quickCheck: {
      question: "Why does automation work better than willpower for saving consistently?",
      options: [
        "Automated savings accounts earn higher interest",
        "It removes the decision entirely so you never have to choose",
        "Banks prioritize automated transfers over manual ones",
      ],
      correctIndex: 1,
      explanation:
        "Every time you rely on willpower to save, you're fighting your brain's preference for immediate reward. Automation makes the choice once, then makes the default outcome savings — not spending. You adapt to the new 'available' amount within weeks.",
    },
  },

  // ─── Emergency Fund ──────────────────────────────────────────────────────────
  {
    id: "ef-1",
    trackId: "emergency-fund",
    order: 1,
    title: "What happens when you don't have a cushion",
    xp: 50,
    relatedActionId: "emergency_floor",
    cards: [
      {
        heading: "Every unexpected expense becomes a crisis",
        body: "Without cash reserves, a $800 car repair, an unexpected medical bill, or a slow month of income doesn't stay in its lane — it becomes a credit card event. Which becomes an interest payment. Which becomes a setback that takes months to recover from.",
      },
      {
        heading: "High-interest debt usually starts here",
        body: "Most credit card debt isn't from reckless spending — it's from people who had no buffer when something went wrong. The emergency fund that never got built cost them years of interest payments. Building it is the highest-return investment most people can make right now.",
      },
      {
        heading: "It's insurance, not a savings account",
        body: "An emergency fund isn't there to earn interest. Its job is to exist when everything else fails. Think of it as protection for your financial plan: without it, one bad month can undo years of progress by forcing you into debt or raiding retirement accounts.",
      },
      {
        heading: "What you're actually protecting",
        body: "The target is 3–6 months of essential expenses — housing, food, utilities, minimum debt payments. Not your full spending, just what keeps you housed and fed. For most people, that's $3,000–$15,000. It sounds like a lot. We'll show you how to start smaller.",
      },
    ],
    quickCheck: {
      question: "What is the most important purpose of an emergency fund?",
      options: [
        "To earn interest while keeping money accessible",
        "To prevent unexpected expenses from becoming debt",
        "To serve as a retirement account backup",
      ],
      correctIndex: 1,
      explanation:
        "An emergency fund is financial insurance — its job is to absorb shocks before they reach your credit cards, retirement accounts, or investment plan. The interest it earns is irrelevant. The protection it provides is everything.",
    },
  },
  {
    id: "ef-2",
    trackId: "emergency-fund",
    order: 2,
    title: "Start smaller than you think",
    xp: 50,
    relatedActionId: "emergency_fund",
    cards: [
      {
        heading: "Three months feels like forever. Start with $1,000.",
        body: "The 3-month target is real and worth having, but it stops most people before they start. The first milestone isn't 3 months — it's $1,000. Why $1,000? Because most genuine emergencies — a car repair, a medical co-pay, a broken appliance — cost under $1,000.",
      },
      {
        heading: "The $1,000 breaks the cycle",
        body: "Having $1,000 in cash immediately interrupts the pattern of small surprises becoming credit card debt. That single change is worth more than almost any other financial move for someone just getting started. The first $1,000 is the hardest. After that, you're adding to something real.",
      },
      {
        heading: "The account matters as much as the amount",
        body: "Keep your emergency fund in a high-yield savings account (HYSA), completely separate from your checking account. 'Separate' is the key word — you need a small amount of friction to keep yourself from dipping in for non-emergencies. Ally, Marcus, and Capital One 360 are popular options paying ~4–5% APY.",
      },
      {
        heading: "The psychological shift is real",
        body: "Once you have $1,000 set aside and feel the difference of having a real cushion, the path to 1 month → 3 months becomes clear. You're no longer starting from zero. You're building on something that exists. The path to 3 months is shorter than you think once the account exists.",
      },
    ],
    quickCheck: {
      question: "Why is $1,000 a useful first milestone for an emergency fund?",
      options: [
        "It's enough to cover most genuine emergencies",
        "It's the IRS-recommended minimum",
        "It earns the best interest rate at most banks",
      ],
      correctIndex: 0,
      explanation:
        "Most real emergencies — car repairs, medical bills, appliance replacements — cost under $1,000. Having this amount breaks the cycle where small surprises become credit card debt. It's a real, achievable milestone that changes your financial default behavior.",
    },
  },
  {
    id: "ef-3",
    trackId: "emergency-fund",
    order: 3,
    title: "From starter to solid: reaching 3 months",
    xp: 50,
    relatedActionId: "emergency_floor",
    cards: [
      {
        heading: "Calculate your actual target",
        body: "Three months of 'essential expenses' — not your full spending, just what keeps you housed and current on obligations. Add up: rent/mortgage, food, utilities, minimum debt payments, transportation. Multiply by 3. That's your number. Write it down. Name it.",
      },
      {
        heading: "Automate the path there",
        body: "Set up an automatic transfer to your HYSA every payday — even $50 biweekly. When you get a tax refund, a bonus, or sell something you no longer need, send it directly to the emergency fund until you hit the target. Don't give it a chance to become spending money.",
      },
      {
        heading: "Windfalls belong here first",
        body: "Until your emergency fund is full, every unexpected dollar goes there. Tax refund? Emergency fund. Client bonus? Emergency fund. Sold something on Facebook Marketplace? Emergency fund. This isn't deprivation — it's the fastest path to the freedom of knowing you're protected.",
      },
      {
        heading: "Then stop — and redirect",
        body: "Once you hit 3 months, stop. Don't keep building past this unless your income is variable or you're self-employed (in which case 6 months is wise). Extra cash beyond 3 months belongs in investments earning 7% per year — not sitting in a 4% HYSA. Your emergency fund is a floor, not a vault.",
      },
    ],
    quickCheck: {
      question: "Once you reach a 3-month emergency fund, what should you do with additional savings?",
      options: [
        "Keep adding until you have 12 months",
        "Redirect to investments earning higher long-term returns",
        "Put it in a CD for higher interest",
      ],
      correctIndex: 1,
      explanation:
        "A 3-month emergency fund is the floor — enough protection against most disruptions. Beyond that, your money earns more in a diversified investment portfolio (~7% real return) than in a savings account (~4%). The emergency fund is insurance, not a savings strategy.",
    },
  },

  // ─── Debt ────────────────────────────────────────────────────────────────────
  {
    id: "d-1",
    trackId: "debt",
    order: 1,
    title: "Not all debt is the same",
    xp: 50,
    relatedActionId: "high_interest_debt",
    cards: [
      {
        heading: "The interest rate is what matters",
        body: "A 3% mortgage on a growing asset is fundamentally different from a 24% credit card balance. Treating them the same — either panicking about all debt or ignoring all debt — is one of the most common financial mistakes people make. The interest rate tells you which category you're in.",
      },
      {
        heading: "Above 10% is a financial emergency",
        body: "Any debt with an APR above 10% should be your top financial priority — not investing, not building savings beyond your emergency fund. Why? Because paying off a 22% credit card is a guaranteed, risk-free 22% return on your money. No index fund, no savings account, nothing else in a normal year reliably beats that.",
      },
      {
        heading: "The dangerous middle: 7–10% APR",
        body: "Debts in this range sit in a gray zone. The long-term stock market return (~7% real) roughly matches the guaranteed return of paying off debt in this range. Whether to pay down or invest is a judgment call. For most people, the stress of carrying debt is worth paying it off — when in doubt, eliminate it.",
      },
      {
        heading: "Below 7%: the math favors investing",
        body: "Most mortgages and some student loans fall here. A 3% loan costs you 3%, but money invested in a diversified portfolio has historically returned ~7%. Every extra dollar toward a 3% mortgage has an opportunity cost. Make the minimums; invest the difference.",
      },
    ],
    quickCheck: {
      question: "What APR threshold turns debt into a financial emergency that should take priority over investing?",
      options: [
        "5% APR",
        "10% APR",
        "20% APR",
      ],
      correctIndex: 1,
      explanation:
        "Debt above 10% APR should take priority over investing because paying it off is a guaranteed return equal to the interest rate. No investment strategy reliably beats a 10–25% guaranteed return. Below 7%, the math often favors investing over accelerated payoff.",
    },
  },
  {
    id: "d-2",
    trackId: "debt",
    order: 2,
    title: "The method that saves the most — and the one that keeps you going",
    xp: 50,
    relatedActionId: "high_interest_debt",
    cards: [
      {
        heading: "Two approaches, different psychology",
        body: "The two most common debt payoff strategies are the Avalanche (highest interest rate first) and the Snowball (smallest balance first). Both work. They feel completely different. Understanding when to use each is worth your time.",
      },
      {
        heading: "The Avalanche: maximum math",
        body: "Pay minimums on everything, throw every extra dollar at the debt with the highest APR. Once it's gone, attack the next highest. Mathematically, this saves the most money — you're eliminating the most expensive debt first. For people with high-APR debt, this is the right framework.",
      },
      {
        heading: "The Snowball: maximum momentum",
        body: "Pay minimums on everything, throw every extra dollar at the smallest balance regardless of APR. Your first debt goes to zero faster. You cross it off the list. For many people, this psychological win is what keeps them going when the Avalanche feels endless and demoralizing.",
      },
      {
        heading: "The practical hybrid",
        body: "Avalanche anything above 15% APR — these are true emergencies and math wins here. Snowball debts in the 7–15% range to maintain momentum. This maximizes both the financial savings of the Avalanche and the motivational engine of the Snowball. Most people stick with this hybrid longer than either method alone.",
      },
    ],
    quickCheck: {
      question: "Which debt payoff method saves the most money mathematically?",
      options: [
        "Snowball — paying smallest balances first",
        "Avalanche — paying highest interest rate first",
        "Paying equal amounts to all debts simultaneously",
      ],
      correctIndex: 1,
      explanation:
        "The Avalanche method saves the most money because you're eliminating your most expensive debt fastest, reducing the total interest paid. The Snowball provides faster psychological wins that keep people motivated, but at a higher total cost in interest.",
    },
  },
  {
    id: "d-3",
    trackId: "debt",
    order: 3,
    title: "When to stop paying extra and start investing",
    xp: 50,
    relatedActionId: "invest_more",
    cards: [
      {
        heading: "The debt vs. investing question",
        body: "Most people swing to one extreme — paying off all debt before investing, or investing while ignoring debt. Both miss the point. The right answer depends entirely on the interest rate. There's a crossover point where the math flips.",
      },
      {
        heading: "The rule of thumb: ~7% APR",
        body: "If your debt rate is higher than your expected investment return (~7% real), extra dollars go to debt first. If your debt rate is lower, extra dollars generally go to investing — because that money earns more in the market than it saves in interest. The crossover is roughly 7%.",
      },
      {
        heading: "One exception: always capture your employer match first",
        body: "Before paying any extra debt, capture your full 401(k) employer match. A 50% match is a 50% guaranteed instant return — nothing else comes close. That match is free money you can't get back once you miss it. After that: pay high-interest debt (>10%), build the emergency fund, then invest.",
      },
      {
        heading: "The sequence that works",
        body: "401(k) match → pay off debt above 10% APR → build 3-month emergency fund → invest. This order optimizes for guaranteed wins first (match, high-interest payoff) and long-term compounding second. Don't skip the match. Don't leave high-interest debt alive while investing. After that, the order is flexible.",
      },
    ],
    quickCheck: {
      question: "When does the math favor investing over paying down extra debt?",
      options: [
        "Never — always pay off all debt first",
        "When your debt's interest rate is below your expected investment return (~7%)",
        "Only after you're completely debt-free",
      ],
      correctIndex: 1,
      explanation:
        "If your debt costs 3% (a typical mortgage), paying it off earns you a 3% guaranteed return. But investing that same money in a diversified portfolio has historically returned ~7%. The 4% difference means investing wins mathematically. Above ~7–10% APR, paying off debt wins.",
    },
  },

  // ─── Investing ───────────────────────────────────────────────────────────────
  {
    id: "i-1",
    trackId: "investing",
    order: 1,
    title: "Why time in market beats everything else",
    xp: 50,
    relatedActionId: "start_investing",
    cards: [
      {
        heading: "The market's 100-year track record",
        body: "The US stock market has returned roughly 10% per year nominally — about 7% after adjusting for inflation — over the past century. This includes the Great Depression, World War II, 2008, and a global pandemic. Through every crisis, the long-term line goes up.",
      },
      {
        heading: "Compound interest in action",
        body: "You earn returns on your returns. $10,000 invested at 7% real return for 30 years doesn't become $31,000 (3 × $10,000 × 10%). It becomes $76,000. Each year, the base grows, and the returns grow with it. The math becomes genuinely hard to believe until you see the chart.",
      },
      {
        heading: "The Rule of 72",
        body: "Divide 72 by your expected return to find how long it takes to double your money. At 7%, your money doubles every ~10 years. $10,000 at 25 → $20K at 35 → $40K at 45 → $80K at 55 → $160K at 65. That's four doublings on the original investment — without adding another dollar.",
      },
      {
        heading: "Time is the one thing you can't buy back",
        body: "Starting at 25 versus 35 isn't a 10-year gap in wealth at retirement — it's roughly a 2× gap. Those extra 10 years at the end of the compounding curve are the most powerful ones. Procrastination has a direct, measurable dollar cost. The second-best time to start is today.",
      },
    ],
    quickCheck: {
      question: "At a 7% annual return, roughly how long does it take for your money to double?",
      options: [
        "5 years",
        "10 years",
        "20 years",
      ],
      correctIndex: 1,
      explanation:
        "The Rule of 72: divide 72 by the return rate to find the doubling time. 72 ÷ 7 = ~10 years. This means $10,000 becomes $20,000 in a decade, $40,000 in two decades, $80,000 in three. The doubling accelerates in real terms as the base grows.",
    },
  },
  {
    id: "i-2",
    trackId: "investing",
    order: 2,
    title: "Index funds in plain English",
    xp: 50,
    relatedActionId: "optimize_allocation",
    cards: [
      {
        heading: "Own the whole market, not individual stocks",
        body: "An index fund is a fund that owns every stock in a market index — like all 500 companies in the S&P 500. Instead of trying to pick winners, you own everything. The result: market return, minus a tiny fee. This sounds boring. It is, in the best possible way.",
      },
      {
        heading: "Why stock picking almost always loses",
        body: "Over any 15–20 year period, roughly 85–90% of professional fund managers — with research teams, decades of experience, and Bloomberg terminals — underperform their benchmark index. If professionals who do this full-time can't beat it, the math isn't in your favor either.",
      },
      {
        heading: "Fees compound against you",
        body: "An actively managed fund charging 1% per year vs. an index fund at 0.03% doesn't sound like much. On $100,000 invested over 30 years, that difference is over $200,000 in final wealth. Fees compound just like returns do — just in the wrong direction.",
      },
      {
        heading: "What to actually buy",
        body: "A total US market index fund (like VTSAX, VTI, or FXAIX) gives you ownership in every public company in America for practically nothing. For most people starting out, one fund is enough. Look for an expense ratio under 0.10%. Automate contributions. That's the strategy.",
      },
    ],
    quickCheck: {
      question: "What percentage of professional fund managers beat their benchmark index over 15+ years?",
      options: [
        "About 50% — it's roughly even",
        "About 10–15% — most underperform",
        "About 75% — professionals generally win",
      ],
      correctIndex: 1,
      explanation:
        "Research consistently shows that 85–90% of actively managed funds underperform their benchmark index over 15–20 year periods. The main reasons: higher fees (which compound against you) and the near-impossibility of consistently predicting which individual stocks will outperform.",
    },
  },
  {
    id: "i-3",
    trackId: "investing",
    order: 3,
    title: "The accounts you should open first",
    xp: 50,
    relatedActionId: "capture_match",
    cards: [
      {
        heading: "The order matters enormously",
        body: "The US tax code gives investors special accounts that shelter money from taxes. Using them in the right order adds hundreds of thousands of dollars to your lifetime wealth — not through better returns, but by keeping more of what you earn. The order is counterintuitive for most people.",
      },
      {
        heading: "First: 401(k) up to the employer match",
        body: "If your employer matches 401(k) contributions, put in at least enough to get every dollar of match. A 50% match is a 50% guaranteed instant return. This is always the first move. After capturing the match, there are better places for your next dollars — the Roth IRA.",
      },
      {
        heading: "Second: Roth IRA ($7,000/year)",
        body: "In a Roth IRA, you pay taxes on money going in, but all future growth and withdrawals are completely tax-free. For most people under 50, this beats a traditional IRA. Open one at Fidelity, Vanguard, or Schwab — it takes 15 minutes. Your Roth IRA contributions (not earnings) can be withdrawn anytime without penalty.",
      },
      {
        heading: "Third: back to the 401(k)",
        body: "After maxing the Roth IRA, return to your 401(k) and contribute up to the annual max ($23,000 for 2024). If you max all of this and still have money to invest, open a taxable brokerage account — no contribution limits, no restrictions on withdrawals, just regular capital gains taxes.",
      },
    ],
    quickCheck: {
      question: "After capturing your full employer 401(k) match, what account should you prioritize next?",
      options: [
        "Go back to the 401(k) and max it out first",
        "Open and max a Roth IRA",
        "Open a regular savings account",
      ],
      correctIndex: 1,
      explanation:
        "After the employer match (which is a guaranteed return you can't beat), the Roth IRA is the priority for most people. Its tax-free growth is most powerful when you have a long runway — and the ability to withdraw contributions without penalty adds flexibility. Max the 401(k) after the Roth.",
    },
  },
];

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

export function getLessonsByTrack(trackId: string): Lesson[] {
  return LESSONS.filter((l) => l.trackId === trackId).sort((a, b) => a.order - b.order);
}

export function getTrackById(id: string): Track | undefined {
  return TRACKS.find((t) => t.id === id);
}

/** Returns the next lesson after the given one — continuing in the same track,
 *  then spilling into the first lesson of the next track. */
export function getNextLesson(lessonId: string): Lesson | undefined {
  const current = getLessonById(lessonId);
  if (!current) return undefined;

  const trackLessons = getLessonsByTrack(current.trackId);
  const idx = trackLessons.findIndex((l) => l.id === lessonId);
  if (idx !== -1 && idx < trackLessons.length - 1) {
    return trackLessons[idx + 1];
  }

  // Spill into the first lesson of the next track
  const trackIdx = TRACKS.findIndex((t) => t.id === current.trackId);
  if (trackIdx !== -1 && trackIdx < TRACKS.length - 1) {
    const nextTrack = TRACKS[trackIdx + 1];
    return getLessonsByTrack(nextTrack.id)[0];
  }

  return undefined;
}
