export type LearnTag = "Foundation" | "Debt" | "Investing" | "FIRE";

export interface LearnModule {
  id: string;
  title: string;
  tag: LearnTag;
  readTime: number; // minutes
  paragraphs: string[];
  keyTakeaway: string;
}

export const LEARN_MODULES: LearnModule[] = [
  {
    id: "savings-rate",
    title: "The Savings Rate: Your #1 Number",
    tag: "Foundation",
    readTime: 4,
    paragraphs: [
      "Your savings rate is the percentage of your take-home pay that you keep and invest. It is not how much you earn — it's how much you keep. This single number determines more about your financial future than almost anything else, including your income.",
      "Here's why it's a double accelerant: a higher savings rate simultaneously grows your wealth faster (more money compounding) and shrinks the portfolio you need to retire (lower spending means a smaller FI number). When you go from saving 5% to 20%, you're not just investing four times more — you're also reducing your required nest egg. The effect is multiplicative.",
      "The math is clarifying. At a 10% savings rate, most people need roughly 43 years to reach financial independence starting from zero. At 25%, that drops to about 25 years. At 50%, under 17 years. This isn't linear — it's exponential. Every percentage point gained at higher savings rates buys you dramatically more time.",
      "Most Americans save 3–5% of income. That is a path to working until your late sixties and hoping Social Security covers the difference. It doesn't have to be yours. The goal isn't perfection. Going from 5% to 10% is enormous. Going from 10% to 15% is enormous again. Small, sustained improvements compound into radically different outcomes.",
    ],
    keyTakeaway:
      "Increase your savings rate by 1% per month until it's uncomfortable, then back off 1%. You'll find your sustainable rate without deprivation — and you'll be miles ahead of where you started.",
  },
  {
    id: "emergency-fund",
    title: "Emergency Fund: Your Financial Defense",
    tag: "Foundation",
    readTime: 3,
    paragraphs: [
      "The emergency fund is not an investment. It's insurance. Its job is to prevent one bad event — a job loss, a medical bill, a car breakdown — from destroying years of financial progress. Without it, every unexpected expense becomes a crisis that forces you into debt or forces you to raid retirement accounts.",
      "The standard target is 3–6 months of essential expenses. Three months is the floor — enough to handle most short-term disruptions. Six months is the goal — enough to weather a job loss or major life change. If you're self-employed, have variable income, or are a single-income household, 9–12 months is appropriate.",
      "Where you keep it matters as much as how much you have. This money needs to be liquid (accessible in 1–3 business days) and safe (not subject to market risk). A high-yield savings account is the standard vehicle — currently yielding 4–5% APY, FDIC insured, and accessible without penalty. Do not invest your emergency fund in stocks, index funds, or anything that can drop 30% right when you need it most.",
      "Build your emergency fund before investing beyond your employer 401(k) match. The math on this is clear: a 50% employer match is an instant 50% return on investment. That beats almost everything. But after capturing that match, the emergency fund comes next — because without it, one bad month can undo years of disciplined investing.",
    ],
    keyTakeaway:
      "3 months of essential expenses in a high-yield savings account, separate from your checking account. Fund this before investing anywhere else beyond your employer match. Treat it as insurance, not a savings account.",
  },
  {
    id: "debt-operations",
    title: "The Debt Order of Operations",
    tag: "Debt",
    readTime: 5,
    paragraphs: [
      "Not all debt is equal. A 3% mortgage on a growing asset is fundamentally different from a 24% credit card balance. Treating them the same is one of the most common and costly financial mistakes people make. The order in which you pay off debt matters enormously.",
      "The framework is straightforward: attack by interest rate. Any debt above 10% APR is a financial emergency. No investment strategy reliably beats 10–24% guaranteed returns. Paying off a 22% credit card is a risk-free 22% return on your money — better than any index fund in any normal year. These debts come first, always.",
      "Between 7–10% APR sits a gray zone. Whether to pay off or invest depends on your personal psychology and risk tolerance. Mathematically, long-term stock market returns (~7% real) roughly match this rate. Behaviorally, carrying debt stresses most people and disrupts their investing consistency. When in doubt, pay it off.",
      "Below 7% — most mortgages, some student loans, car loans — the math generally favors investing over accelerated payoff. A 3% mortgage while the market historically returns 7% means every extra dollar toward the mortgage has an opportunity cost. Minimum payments here; invest the difference.",
      "The Dave Ramsey 'snowball' (smallest balance first) and the 'avalanche' (highest rate first) are the two most common frameworks. The avalanche saves the most money mathematically. The snowball provides faster psychological wins. For most people, the avalanche for high-interest debt and the snowball for everything else is optimal — attack the expensive debt hard, then pick off smaller balances for momentum.",
    ],
    keyTakeaway:
      "Rank your debts by interest rate. Anything above 10% APR is an emergency — eliminate it before investing. 7–10% is a judgment call. Below 7%, make minimums and invest the difference.",
  },
  {
    id: "coast-fire",
    title: "Coast FIRE: The Freedom Milestone",
    tag: "FIRE",
    readTime: 5,
    paragraphs: [
      "Coast FIRE is one of the most underrated milestones in personal finance. It's the point at which you have enough invested that — even if you never contribute another dollar — your portfolio will grow to your full FI number by a target retirement age. You can stop 'rowing' and let the market carry you to shore.",
      "The calculation works backward from your FI number. Your FI number is your annual spending in retirement multiplied by 25 (the 4% rule). To find your Coast FIRE number, discount that FI number back to today at your expected rate of return over the years until retirement. The result is how much you need invested right now to coast.",
      "For example: a 35-year-old planning to retire at 65 who needs $50,000/year in retirement has an FI number of $1.25 million. Their Coast FIRE number at 7% return over 30 years is about $164,000. If they have $164,000 invested today, they never need to invest another penny — compound growth does the rest.",
      "Why does this matter psychologically? Once you hit Coast FIRE, the pressure to maximize your savings rate shifts dramatically. You can take a less stressful job, work part-time, pursue something meaningful, or simply relax knowing the retirement math is handled. Many people discover that reaching Coast FIRE changes their relationship with work more than reaching full FI.",
      "The practical implication: front-loading your investing in your 20s and early 30s creates the most powerful compounding runway. Every year earlier you invest has an exponential effect on your Coast FIRE number. A dollar invested at 25 has 40 years to compound; the same dollar at 45 has only 20 years — and those extra 20 years are the most powerful ones.",
    ],
    keyTakeaway:
      "Coast FIRE = your FI number discounted back to today at your expected return. Once you hit it, compound growth handles retirement — you're free to work for reasons other than financial necessity.",
  },
  {
    id: "index-funds",
    title: "Index Fund Investing: Own the Market",
    tag: "Investing",
    readTime: 4,
    paragraphs: [
      "An index fund is a fund that owns every stock in a market index — like all 500 companies in the S&P 500. Rather than trying to pick winners, you own everything. The result is a market return, minus a tiny management fee. This sounds boring. It is, in the best possible way.",
      "The case for index funds starts with the data. Over any 15–20 year period, roughly 85–90% of actively managed funds underperform their benchmark index. These are professionals with research teams, Bloomberg terminals, and decades of experience — and they still lose to the index most of the time. The reason is structural: active management has higher costs, and costs compound just like returns do.",
      "The S&P 500 index fund (like VTSAX, FXAIX, or SPY) gives you ownership in 500 of the largest US companies. Total market funds add mid and small cap exposure. International funds add diversification across global economies. A simple three-fund portfolio — US total market, international, bonds — has matched or beaten most professional portfolios over time.",
      "The most important word in investing is 'consistent.' The investors who win aren't the ones with the best picks — they're the ones who stayed invested through every crash: 2000, 2008, 2020. The S&P 500 has recovered from every single downturn in its history and gone on to new highs. The risk of a diversified index fund isn't that it goes to zero — it's that it drops 30% and you panic sell.",
    ],
    keyTakeaway:
      "Pick a low-cost total market index fund (expense ratio under 0.10%). Automate monthly contributions. Reinvest dividends. Don't watch it daily. That's it. That's the strategy that beats most professionals.",
  },
  {
    id: "4-percent-rule",
    title: "The 4% Rule & Your FI Number",
    tag: "FIRE",
    readTime: 4,
    paragraphs: [
      "The 4% rule is the foundation of financial independence math. It states that you can withdraw 4% of your portfolio per year in retirement and, historically, your portfolio will last 30+ years without running out. The research behind this comes from William Bengen's 1994 study of US market and inflation data going back to 1926.",
      "The math: if you spend $50,000 per year, divide by 4% (or multiply by 25). You need $1.25 million invested. At $80,000/year spending, you need $2 million. This is your FI number — the portfolio size at which you're financially independent. Work becomes optional.",
      "Important nuances: the 4% rule assumes a 30-year retirement and a 50/50 stock/bond portfolio. If you're targeting early retirement at 40 with 50+ years ahead, a 3–3.5% withdrawal rate (multiply by 28–33) is more conservative. If you have Social Security, a pension, or rental income, your required portfolio shrinks accordingly.",
      "Your annual spending number is the most powerful variable in this equation. Reducing your spending by $10,000/year doesn't just reduce your annual withdrawal — it reduces your FI number by $250,000. That's why the financial independence community focuses so heavily on lifestyle design: every dollar of recurring spending you can cut permanently reduces the finish line by 25x.",
    ],
    keyTakeaway:
      "Your FI number = annual spending × 25. Reduce spending, and the finish line moves toward you — every $100/month in recurring expenses cut permanently reduces your required nest egg by $30,000.",
  },
  {
    id: "tax-advantaged",
    title: "Tax-Advantaged Accounts: The Order",
    tag: "Investing",
    readTime: 5,
    paragraphs: [
      "The US tax code gives investors several tools that dramatically accelerate wealth building. The key insight: money in tax-advantaged accounts compounds on the full balance — you're not losing 20–37% to taxes every year on gains. Over decades, this makes an enormous difference. The question isn't whether to use these accounts — it's the order.",
      "Step 1: Contribute to your 401(k) enough to capture any employer match. A 50% match is a guaranteed 50% instant return. This is always the first dollar to deploy. Never leave free money on the table.",
      "Step 2: Max your Health Savings Account (HSA) if you have a high-deductible health plan. The HSA is the most tax-advantaged account in existence — contributions are pre-tax, growth is tax-free, and withdrawals for medical expenses are tax-free. After 65, it functions like a traditional IRA. Triple tax advantage. Max it every year.",
      "Step 3: Max your Roth IRA. The 2024 limit is $7,000 ($8,000 if 50+). In a Roth, you pay taxes now but all future growth and withdrawals are tax-free. For most people under 50, this is the superior choice over traditional IRA. The earlier you start, the more powerful the tax-free compounding.",
      "Step 4: Return to your 401(k) and contribute up to the annual maximum ($23,000 for 2024). Step 5: If you've maxed tax-advantaged accounts and still have more to invest, open a taxable brokerage account. This has no contribution limits and no restrictions on withdrawals — it's just less tax-efficient than the steps above.",
    ],
    keyTakeaway:
      "Order: 401(k) to match → HSA max → Roth IRA max → 401(k) max → taxable brokerage. Each step uses a more tax-efficient vehicle before moving to the next. Following this order strictly can add hundreds of thousands of dollars to your lifetime wealth.",
  },
  {
    id: "stock-market-origin",
    title: "The Stock Market: What It Is and Why It Exists",
    tag: "Foundation",
    readTime: 5,
    paragraphs: [
      "The stock market is not a casino, a lottery, or an abstraction. It is a marketplace where people buy and sell fractional ownership in real businesses — companies with employees, products, customers, and profits. When you buy a share of stock, you become a part-owner of that company. You are entitled to a proportional share of its future earnings, its assets, and its growth.",
      "The origin of the modern stock market traces back to Amsterdam in 1602. The Dutch East India Company (VOC) needed to fund enormously expensive voyages to Asia — ships, crews, cargo, years of risk. No individual investor had enough capital. So the company did something radical: it divided itself into shares and offered them to the public. Anyone could buy in. In exchange, they'd receive a portion of the profits when the ships returned. This was the world's first initial public offering (IPO), and within days, shares were trading between investors in Amsterdam's Beurs — the world's first stock exchange.",
      "The core idea that emerged has never changed. Companies need capital to grow — to build factories, hire people, develop products, enter new markets. Going public is how they raise that capital efficiently. In exchange for funding, they offer investors equity: a claim on the future earnings and value of the business. The stock market is simply the organized system through which those ownership stakes are created, priced, and transferred.",
      "Stock prices change every day because millions of investors are constantly reassessing the future earnings potential of every company. When a company's prospects improve — better earnings, new products, expanding markets — investors bid the price up. When prospects deteriorate, they sell. This constant repricing is called price discovery, and it means the market is always reflecting the collective judgment of every participant about the value of every company in it.",
      "For most of human history, only the wealthy could access this system. You needed connections, a broker, and significant capital. Today, anyone with a smartphone and $1 can own a piece of the 500 largest companies in America. That democratization is one of the most significant financial developments in modern history — and most people still aren't using it.",
    ],
    keyTakeaway:
      "Buying stock = buying fractional ownership in a real business. The stock market is where that ownership is created and traded. It has existed for over 400 years because it solves a real problem: connecting people who need capital with people who have it.",
  },
  {
    id: "market-indexes",
    title: "The Major Indexes: The Market's Scoreboard",
    tag: "Investing",
    readTime: 5,
    paragraphs: [
      "A market index is a curated basket of stocks designed to represent a segment of the market. Instead of tracking 4,000 individual stocks, you track the index. Its price going up or down tells you whether 'the market' is rising or falling. Indexes are the scoreboard — and understanding the major ones tells you exactly what game is being played.",
      "The S&P 500 is the most important index for investors. It tracks 500 of the largest US companies by market capitalization — companies like Apple, Microsoft, Amazon, Google, and JPMorgan. It is market-cap weighted, meaning larger companies have more influence on the index's value. The S&P 500 represents roughly 80% of all US stock market value. When people say 'the market went up 1% today,' they almost always mean the S&P 500. It is the benchmark everything else is measured against.",
      "The Dow Jones Industrial Average (DJIA), commonly called 'the Dow,' is the oldest major index — created in 1896 by Charles Dow. It tracks just 30 large, established companies, selected by editors at the Wall Street Journal. Unlike the S&P 500, the Dow is price-weighted, meaning a $500 stock has more influence than a $50 stock regardless of the company's actual size. For this reason, professional investors consider the Dow a poor representation of the market — but it gets enormous media coverage because it's the oldest and most recognizable.",
      "The NASDAQ Composite tracks all stocks listed on the NASDAQ exchange — roughly 3,700 companies, heavily weighted toward technology. Apple, Microsoft, Meta, and Nvidia are examples. When tech thrives, the NASDAQ outperforms. When tech falls, it falls harder than the S&P 500. The NASDAQ 100 is a subset — the 100 largest non-financial companies on NASDAQ — and is what funds like QQQ track. If you watch financial news and hear about 'the tech-heavy NASDAQ,' this is what they mean.",
      "The Russell 2000 tracks 2,000 smaller companies — the small-cap segment of the US market. It represents companies with market caps roughly between $300M and $2B. Small-cap stocks are riskier but have historically offered higher long-term returns than large caps. The Russell 2000 is the standard benchmark for small-cap performance. Broader still, the Russell 3000 attempts to cover approximately 98% of all investable US equities.",
      "Why does this matter for your portfolio? Because index funds are built on indexes. When you buy a total market index fund like VTSAX or VTI, you own the entire US stock market weighted by size. When you buy an S&P 500 fund, you own the 500 largest companies. When financial news talks about market performance, now you know exactly which slice of the market they're describing — and why the S&P 500 is the number that actually matters.",
    ],
    keyTakeaway:
      "S&P 500 = 500 largest US companies, the real benchmark. Dow Jones = 30 old companies, mostly media noise. NASDAQ = tech-heavy, higher volatility. Russell 2000 = small caps. The index fund you invest in should track the broadest, lowest-cost version — for most people, that's a total US market fund.",
  },
  {
    id: "individual-investor-advantage",
    title: "Why the Stock Market Is the Individual Investor's Greatest Advantage",
    tag: "Investing",
    readTime: 5,
    paragraphs: [
      "The US stock market has returned roughly 10% per year nominally — about 7% after adjusting for inflation — over the past century. This includes the Great Depression, World War II, the 2000 dot-com crash, the 2008 financial crisis, a global pandemic, and dozens of recessions. Through all of it, the long-term line goes up. No other asset class has matched this combination of return, liquidity, and accessibility over such a long period.",
      "Here is what that means in practice. $10,000 invested in a total market index fund and left alone for 30 years at 7% real return becomes approximately $76,000 in today's purchasing power — without a single additional contribution. Add $500 per month over those 30 years and the result is close to $600,000. The mechanism is compound growth: you earn returns on your returns, year after year, until the gains dwarf the original investment.",
      "The individual investor has one enormous structural advantage over professionals: time horizon. A mutual fund manager has to report returns quarterly. They get fired if they underperform for two or three years, even if their strategy is sound. They cannot hold through drawdowns the way a private investor can. You have no quarterly review, no client calls, no board to answer to. Your only job is to stay invested. That is an enormous edge — and most people give it away by watching their portfolio too closely.",
      "The second advantage is access to the same compounding engine that built the great fortunes of the 20th century, at near-zero cost. For most of history, investing required connections and capital. Today, a Vanguard S&P 500 fund charges 0.03% per year in fees — three cents per $100 invested. That is practically free. Fifty years ago, actively managed funds charged 1–2% annually. At $100,000 invested over 30 years, the difference between a 0.03% fee and a 1% fee is over $200,000 in final wealth. Low costs compound in your favor just as surely as returns do.",
      "The psychological trap is volatility. The market drops 30% in a bad year and it feels permanent — but it never has been. The S&P 500 has recovered from every single drawdown in its history and gone on to new all-time highs. Every crash in retrospect looks like a buying opportunity. The investor who stayed in through 2008–2009 and didn't sell turned the worst financial crisis in 80 years into the best buying opportunity of a generation. Volatility is not the risk — panic is.",
      "The simplest and most powerful investing strategy in history requires no stock picking, no market timing, no financial news, and no meetings with a broker: put money in a low-cost total market index fund every month, reinvest dividends, and don't touch it. This strategy has beaten the majority of professional fund managers over any 20-year period. It is available to every person with $1 and a phone. Most people just don't use it.",
    ],
    keyTakeaway:
      "The market returns ~7% per year in real terms over the long run. Your edge as an individual is time horizon — no quarterly reviews, no pressure to sell. Combined with low-cost index funds and automatic contributions, the stock market is the most accessible wealth-building tool ever created.",
  },
  {
    id: "compound-interest",
    title: "Compound Interest: The 8th Wonder",
    tag: "Foundation",
    readTime: 3,
    paragraphs: [
      "Compound interest is earning returns on your returns. In year one, you earn interest on your principal. In year two, you earn interest on your principal plus last year's interest. Each year, the base grows — and so does the return. Over long periods, this creates exponential growth that is genuinely difficult to internalize until you see it.",
      "The Rule of 72 gives you a quick mental model: divide 72 by your expected annual return to find how many years it takes to double your money. At 7% returns, your money doubles roughly every 10 years. $10,000 at 25 becomes $20,000 at 35, $40,000 at 45, $80,000 at 55, $160,000 at 65 — without adding another dollar. That's the power of four doublings.",
      "The critical variable is time. Not timing the market — time in the market. Starting at 25 vs. 35 isn't a 10-year difference in wealth — it's roughly a 2× difference in final balance at the same savings rate. The first dollars you invest are your most valuable dollars, because they compound the longest. Procrastination has a direct, measurable dollar cost.",
    ],
    keyTakeaway:
      "The best time to start investing was yesterday. The second best time is today. Even $50/month started at 25 dramatically outperforms $500/month started at 45 — because time is the multiplier that money can't buy back.",
  },
];
