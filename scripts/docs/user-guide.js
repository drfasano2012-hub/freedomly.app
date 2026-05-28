/**
 * Freedomly — user-guide.js
 * Generates Freedomly_User_Guide.docx
 *
 * Run:  node scripts/docs/user-guide.js
 * Or:   npm run update-docs
 *
 * Keep this file in sync with the app:
 *   - Checkup steps      → app/checkup/page.tsx
 *   - Dashboard sections → components/dashboard/*
 *   - Tools              → app/tools/page.tsx, components/tools/*
 *   - Learn modules      → content/learn.ts
 *   - Portfolio profiles → components/dashboard/PortfolioAllocation.tsx
 */

const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  BorderStyle, WidthType, Header, Footer, PageNumber, LevelFormat
} = require("docx");
const fs   = require("fs");
const path = require("path");
const OUTPUT = path.join(__dirname, "../../Freedomly_User_Guide.docx");

const NAVY    = "0c1836";
const EMERALD = "10b981";
const BLUE    = "1e3a8a";
const SLATE   = "475569";
const MUTED   = "94a3b8";

const numbering = { config: [{
  reference: "bullets",
  levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
}]};

const styles = {
  default: { document: { run: { font: "Calibri", size: 22 } } },
  paragraphStyles: [
    { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 40, bold: true, font: "Calibri", color: NAVY },
      paragraph: { spacing: { before: 360, after: 120 }, outlineLevel: 0 } },
    { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 28, bold: true, font: "Calibri", color: EMERALD },
      paragraph: { spacing: { before: 280, after: 80 }, outlineLevel: 1 } },
    { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 24, bold: true, font: "Calibri", color: BLUE },
      paragraph: { spacing: { before: 200, after: 60 }, outlineLevel: 2 } },
  ]
};

const h1 = t => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)] });
const h2 = t => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] });
const p  = (text, opts = {}) => new Paragraph({
  spacing: { after: opts.after ?? 120 },
  children: [new TextRun({ text, size: opts.size, bold: opts.bold, italic: opts.italic, color: opts.color, font: "Calibri" })]
});
const bullet = text => new Paragraph({
  spacing: { after: 80 }, numbering: { reference: "bullets", level: 0 },
  children: [new TextRun({ text, font: "Calibri", size: 22 })]
});
const space = () => new Paragraph({ spacing: { after: 120 }, children: [new TextRun("")] });

const pageProps = { page: { size: { width: 12240, height: 15840 },
  margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } };

const footer = new Footer({ children: [new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [
    new TextRun({ text: "Freedomly  |  freedomly.app  |  Page ", size: 16, color: MUTED, font: "Calibri" }),
    new TextRun({ children: [PageNumber.CURRENT], size: 16, color: MUTED, font: "Calibri" }),
  ]
})]});

const children = [
  new Paragraph({ spacing: { before: 720, after: 120 },
    children: [new TextRun({ text: "Freedomly", size: 72, bold: true, font: "Calibri", color: NAVY })] }),
  new Paragraph({ spacing: { after: 80 },
    children: [new TextRun({ text: "How to Use Freedomly", size: 36, bold: true, font: "Calibri", color: EMERALD })] }),
  new Paragraph({ spacing: { after: 80 },
    children: [new TextRun({ text: "Your complete guide to getting started and making the most of the platform.", size: 22, font: "Calibri", color: SLATE })] }),
  space(),

  h1("1. Getting Started — The Financial Checkup"),
  p("The financial checkup is the foundation of everything on Freedomly. It takes about 5 minutes and collects the numbers that power your entire dashboard. You only need to do it once — and can update it anytime."),
  space(),
  h2("Step 1 — Income"),
  bullet("Your age"),
  bullet("Monthly take-home pay (after tax — what actually hits your bank account)"),
  bullet("Annual gross income (before tax — used for benchmarks)"),
  p("Tip: If your income varies month to month, use your average over the last 3 months."),
  space(),
  h2("Step 2 — Spending & Assets"),
  bullet("Monthly spending (total of all recurring expenses)"),
  bullet("Cash savings (checking + savings accounts combined)"),
  bullet("Investment accounts: 401(k)/403(b), Roth IRA, Traditional IRA, Brokerage, Other"),
  p("Tip: An estimate within 10% is good enough to generate accurate insights."),
  space(),
  h2("Step 3 — Debt"),
  p("Add each debt you carry: name, current balance, and interest rate (APR). Common examples: credit card, student loan, car loan, personal loan."),
  p("Tip: High-interest debt (15%+ APR) is flagged prominently in your dashboard."),
  space(),
  h2("Step 4 — Goals"),
  p("Select the financial goals that matter to you, organized by time horizon:"),
  bullet("Short-term (1–3 years): e.g., pay off credit card, build emergency fund"),
  bullet("Medium-term (3–10 years): e.g., buy a home, save for a wedding"),
  bullet("Long-term (10+ years): e.g., retire early, achieve financial independence"),
  space(),
  h2("Step 5 — Risk Tolerance"),
  p("Choose how you think about investment risk:"),
  bullet("Conservative — capital preservation is the priority, prefer stability"),
  bullet("Moderate — comfortable with some market fluctuation for long-term growth"),
  bullet("Aggressive — focused on maximum growth, comfortable with significant volatility"),
  space(),

  h1("2. Your Dashboard"),
  p("After completing the checkup, your dashboard is generated instantly. Here's what each section tells you:"),
  space(),
  h2("Financial Health Score"),
  p("A score from 0–100 measuring your overall financial health across four categories, each shown as X/10:"),
  bullet("Savings Rate — how much of your income you're saving (target: 15%+)"),
  bullet("Emergency Fund — how many months of expenses you have in cash (target: 6 months)"),
  bullet("Debt Situation — whether you carry high-interest debt"),
  bullet("Investing Readiness — whether you're actively investing"),
  p("75+ is strong. 50–74 is progressing. Below 50 needs focused attention."),
  space(),
  h2("Freedom Age Projection"),
  p("The age at which your investment portfolio will permanently cover your living expenses. Key concepts:"),
  bullet("FI Number = 25× your annual spending (funds your life forever at a 4% withdrawal rate)"),
  bullet("Years to Freedom = how long it takes at 7% real annual return, investing your monthly surplus"),
  p("Status meanings:"),
  bullet("Freedom reached — your portfolio already covers your expenses"),
  bullet("No surplus — spending meets or exceeds income; create any positive surplus first"),
  bullet("50+ years out — surplus too small relative to FI Number; grow income or cut spending"),
  bullet("Normal — you have a projected freedom age with years remaining"),
  space(),
  h2("Financial Snapshot"),
  p("Four key numbers at a glance: Net Worth, Savings Rate, Emergency Fund Coverage, Monthly Surplus."),
  space(),
  h2("Benchmarks"),
  bullet("Net Worth Today — hero stat with progress toward your age-income target (age × income ÷ 10)"),
  bullet("Retirement Savings — vs. Fidelity milestone for your age"),
  bullet("Emergency Fund — vs. CFP Board 3–6 month standard"),
  bullet("Federal Reserve Median — your net worth vs. median American in your age group"),
  space(),
  h2("Detail Cards"),
  bullet("Cash Flow — spending breakdown with visual spending vs. income bar"),
  bullet("Debt — all debts sorted by APR; high-interest debt (15%+) flagged"),
  bullet("Savings & Liquidity — emergency fund progress bar"),
  bullet("Investing — investment account breakdown and 3 readiness checks"),
  space(),
  h2("Portfolio Allocation"),
  // ✏️ Update if PortfolioAllocation.tsx profiles change
  p("A recommended asset allocation based on your risk tolerance and age:"),
  bullet("Growth (younger + aggressive) — 90% stocks / 8% bonds / 2% cash"),
  bullet("Balanced (moderate or midlife) — 70% stocks / 25% bonds / 5% cash"),
  bullet("Conservative (near retirement or low risk tolerance) — 40% stocks / 45% bonds / 15% cash"),
  p("Note: This is a general guideline, not personalized financial advice."),
  space(),
  h2("Action Plan"),
  p("A prioritized top-3 action list from your data. Common recommendations: build emergency fund, eliminate high-APR debt, increase savings rate, open or fund an investment account."),
  space(),

  h1("3. Financial Tools"),
  // ✏️ Update if tools are added/removed (see app/tools/page.tsx)
  p("Three standalone calculators, each pre-fillable from your checkup data:"),
  space(),
  h2("Coast FIRE Calculator"),
  p("How much you need invested today to coast to financial independence without additional contributions."),
  bullet("Enter: current age, target retirement age, annual expenses in retirement, current invested amount"),
  bullet("Output: coast number, current gap, monthly amount to close the gap"),
  space(),
  h2("Compound Growth Calculator"),
  p("How your investments grow over time — with a year-by-year bar chart."),
  bullet("Enter: starting amount, monthly contribution, annual return rate, number of years"),
  bullet("Output: final portfolio value, total contributed, total interest earned"),
  space(),
  h2("Emergency Fund Calculator"),
  p("A concrete savings plan to reach your 3–6 month target."),
  bullet("Enter: monthly expenses, current savings, monthly amount you can set aside"),
  bullet("Output: target (3mo and 6mo), current gap, months to reach goal"),
  space(),

  h1("4. Learn"),
  p("11 educational modules covering the concepts behind your dashboard numbers. Filter by topic: Foundation, Debt, Investing, FIRE, Stock Market."),
  bullet("Each module: topic tag, estimated read time, key takeaway highlight"),
  bullet("Recommended order: Foundation first, then Debt and Investing for the highest leverage"),
  space(),

  h1("5. Coaching Framework"),
  p("The Coaching page presents the financial framework behind Freedomly's recommendations — the 4 pillars, 5 core principles, and 4 common mistakes. Read alongside your dashboard or share with a coach."),
  space(),

  h1("6. Updating Your Numbers"),
  p("Update your checkup 1–2 times per year to keep your dashboard accurate as your situation changes."),
  h2("How to update"),
  bullet("Click \"Edit checkup\" in the top navigation bar"),
  bullet("All fields are pre-filled — change only what has changed"),
  bullet("Submit on Step 5 — dashboard recalculates instantly"),
  h2("How to reset"),
  bullet("Click \"Reset\" in the navigation to clear all data and start fresh"),
  bullet("You will be asked to confirm before any data is deleted"),
  space(),
  p("All calculations are educational estimates. Freedomly is not a financial advisor.",
    { color: MUTED, size: 18, italic: true }),
];

const doc = new Document({ numbering, styles, sections: [{
  properties: pageProps,
  headers: { default: new Header({ children: [new Paragraph({
    alignment: AlignmentType.RIGHT,
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: EMERALD, space: 1 } },
    children: [new TextRun({ text: "Freedomly — How to Use", size: 16, color: SLATE, font: "Calibri" })]
  })]})},
  footers: { default: footer },
  children
}]});

Packer.toBuffer(doc)
  .then(buf => { fs.writeFileSync(OUTPUT, buf); console.log("✓ Freedomly_User_Guide.docx"); })
  .catch(err => { console.error(err); process.exit(1); });
