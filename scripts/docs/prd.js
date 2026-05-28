/**
 * Freedomly — prd.js
 * Generates Freedomly_PRD.docx
 *
 * Run:  node scripts/docs/prd.js
 * Or:   npm run update-docs
 *
 * Keep this file in sync with the app:
 *   - Core Features section   → components/dashboard/*, app/tools/page.tsx
 *   - Learning Modules list   → content/learn.ts
 *   - Calculation Methodology → lib/calculations.ts
 *   - Planned Features        → .claude/plans/wild-cuddling-ladybug.md
 *   - Tech stack table        → package.json
 */

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  Header, Footer, PageNumber, LevelFormat, PageBreak
} = require("docx");
const fs   = require("fs");
const path = require("path");
const OUTPUT = path.join(__dirname, "../../Freedomly_PRD.docx");

// ─── Shared helpers ────────────────────────────────────────────
const NAVY    = "0c1836";
const EMERALD = "0f7a57";
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
      run: { size: 28, bold: true, font: "Calibri", color: NAVY },
      paragraph: { spacing: { before: 280, after: 80 }, outlineLevel: 1 } },
    { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 24, bold: true, font: "Calibri", color: BLUE },
      paragraph: { spacing: { before: 200, after: 60 }, outlineLevel: 2 } },
  ]
};

const h1 = t => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)] });
const h2 = t => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] });
const h3 = t => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(t)] });
const p  = (text, opts = {}) => new Paragraph({
  spacing: { after: opts.after ?? 120 },
  children: [new TextRun({ text, size: opts.size, bold: opts.bold, italic: opts.italic, color: opts.color, font: "Calibri" })]
});
const bullet = (text, bold = false) => new Paragraph({
  spacing: { after: 80 }, numbering: { reference: "bullets", level: 0 },
  children: [new TextRun({ text, bold, font: "Calibri", size: 22 })]
});
const space = () => new Paragraph({ spacing: { after: 120 }, children: [new TextRun("")] });

function twoColTable(rows, col1W = 2520, col2W = 6840) {
  const border = { style: BorderStyle.SINGLE, size: 1, color: "e2e8f0" };
  const borders = { top: border, bottom: border, left: border, right: border };
  return new Table({
    width: { size: 9360, type: WidthType.DXA }, columnWidths: [col1W, col2W],
    rows: rows.map(([c1, c2], idx) => new TableRow({ children: [
      new TableCell({ borders, width: { size: col1W, type: WidthType.DXA },
        shading: { fill: idx === 0 ? "e2e8f0" : "f8fafc", type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: c1, bold: idx === 0, size: 18, font: "Calibri" })] })] }),
      new TableCell({ borders, width: { size: col2W, type: WidthType.DXA },
        shading: { fill: idx === 0 ? "e2e8f0" : "ffffff", type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({ text: c2, bold: idx === 0, size: 18, font: "Calibri" })] })] }),
    ]}))
  });
}

const pageProps = { page: { size: { width: 12240, height: 15840 },
  margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } };

const footer = new Footer({ children: [new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [
    new TextRun({ text: "Freedomly  |  freedomly.app  |  Page ", size: 16, color: MUTED, font: "Calibri" }),
    new TextRun({ children: [PageNumber.CURRENT], size: 16, color: MUTED, font: "Calibri" }),
  ]
})]});

// ─── Document content ──────────────────────────────────────────
const children = [
  new Paragraph({ spacing: { before: 720, after: 120 },
    children: [new TextRun({ text: "Freedomly", size: 72, bold: true, font: "Calibri", color: NAVY })] }),
  new Paragraph({ spacing: { after: 80 },
    children: [new TextRun({ text: "Product Requirements Document", size: 32, font: "Calibri", color: BLUE })] }),
  new Paragraph({ spacing: { after: 80 },
    children: [new TextRun({ text: "Version 1.0  |  May 2026", size: 20, font: "Calibri", color: SLATE, italic: true })] }),
  new Paragraph({ spacing: { after: 80 },
    children: [new TextRun({ text: "Status: MVP Complete — Phase 1 Planning", size: 20, font: "Calibri", color: SLATE, italic: true })] }),
  space(),

  h1("1. Executive Summary"),
  p("Freedomly is a financial freedom planning platform that helps individuals understand their financial health, benchmark their progress against data-driven standards, and build a personalized action plan to reach financial independence."),
  p("The MVP is a fully client-side application — no backend, no auth, all calculations run in the browser with data persisted in localStorage. Users complete a 5-step financial checkup and receive a comprehensive dashboard including a health score, freedom age projection, net worth benchmarks, portfolio allocation recommendation, and a prioritized action plan."),
  p("The platform also includes 3 financial calculators (Coast FIRE, Compound Growth, Emergency Fund) and 11 educational learning modules covering savings, debt, investing, FIRE principles, and the stock market."),
  space(),

  h1("2. Problem Statement"),
  p("Most individuals lack a clear picture of their financial health and no structured path to financial independence. Specific gaps:"),
  bullet("No single tool shows all financial dimensions (savings, debt, investing, net worth) in one place"),
  bullet("Benchmarks are scattered across multiple sources (Fidelity, Fed Reserve, CFP Board)"),
  bullet("Generic financial advice fails to account for individual circumstances"),
  bullet("Financial coaching is inaccessible — expensive, jargon-heavy, and not personalized"),
  bullet("People don't know their \"FI number\" — the portfolio size that permanently replaces their income"),
  space(),

  h1("3. Mission & Vision"),
  p("Mission: Financial freedom shouldn't require a financial advisor. Freedomly makes the math, the benchmarks, and the plan accessible to everyone."),
  p("Vision: A world where every person knows their number, understands where they stand, and has a clear path forward — regardless of income, wealth, or financial background."),
  space(),

  h1("4. Target Users"),
  h2("4.1 Primary — Individual Users"),
  bullet("Ages 25–50, working professionals with some disposable income"),
  bullet("Awareness that they should be investing but uncertain where they stand"),
  bullet("Motivated by financial independence but overwhelmed by complexity"),
  bullet("Not currently working with a financial advisor"),
  h2("4.2 Secondary — Financial Coaches"),
  bullet("Independent financial coaches, certified financial planners (CFPs)"),
  bullet("Use Freedomly to onboard clients, visualize their situation, and track progress over time"),
  bullet("Need a tool to review client data before and during coaching sessions"),
  space(),

  h1("5. Core Features (MVP)"),
  h2("5.1 Financial Checkup Wizard"),
  p("A 5-step guided input flow:"),
  bullet("Step 1 — Income: age, monthly take-home pay, annual gross income"),
  bullet("Step 2 — Spending & Assets: monthly spending, cash savings, 5 investment account buckets (401k, Roth IRA, Traditional IRA, Brokerage, Other)"),
  bullet("Step 3 — Debt: dynamic add/remove debt items with balance and APR"),
  bullet("Step 4 — Goals: multi-select financial goals by time horizon (short, medium, long-term)"),
  bullet("Step 5 — Risk tolerance: Conservative, Moderate, or Aggressive"),
  p("Features: \"Try sample data\" button pre-fills all fields with a realistic test persona (Age 32, $75K income). Supports back navigation with state preservation."),
  space(),
  h2("5.2 Financial Dashboard"),
  p("A comprehensive single-page dashboard with 7 sections:"),
  bullet("Financial Health Score — circular gauge (0–100), 4-category breakdown (Savings Rate, Emergency Fund, Debt, Investing), each shown as X/10"),
  bullet("Freedom Age Projection — FI number (25× annual spending), years to freedom at 7% real return, status-specific guidance for all 4 states"),
  bullet("Financial Snapshot — 4 key metrics: net worth, savings rate, emergency fund coverage, monthly surplus"),
  bullet("Benchmarks — Net worth hero stat with progress bar toward target; Fidelity retirement milestone; CFP emergency fund standard"),
  bullet("Detail Cards — Cash flow, debt sorted by APR, liquidity analysis, investing readiness"),
  bullet("Portfolio Allocation — Static recommendation based on risk tolerance and age tier (young <35, midlife 35–55, near retirement 55+)"),
  bullet("Action Plan — Top 3 prioritized actions generated from user data"),
  space(),
  h2("5.3 Financial Tools"),
  // ✏️ Update this table when tools are added/removed (see app/tools/page.tsx)
  twoColTable([
    ["Tool", "Description"],
    ["Coast FIRE", "How much you need invested today to coast to FI without additional contributions"],
    ["Compound Growth", "Visualize investment growth over time with Recharts bar chart"],
    ["Emergency Fund", "Target fund size, current gap, months to goal with progress bar"],
  ]),
  space(),
  h2("5.4 Learning Modules (11 Modules)"),
  // ✏️ Update this list when modules are added/removed (see content/learn.ts)
  p("Expandable topic cards with tag, read time, and key takeaway highlight. Topics:"),
  bullet("Foundation: The 50/30/20 Rule, Emergency Funds Explained, How Investing Works"),
  bullet("Debt: The Debt Avalanche Method, Good Debt vs. Bad Debt"),
  bullet("Investing: Index Funds & ETFs Explained, Why Time in the Market Beats Timing the Market"),
  bullet("FIRE: The FIRE Movement Explained, Coast FIRE"),
  bullet("Stock Market: Origin Story of the Stock Market, The Major Indexes (S&P 500, Dow, NASDAQ, Russell), Why the Stock Market Is the Individual Investor's Greatest Advantage"),
  space(),
  h2("5.5 Coaching Framework Page"),
  p("A static educational page featuring: coach insight cards, the 4-pillar financial framework, 5 core principles, and 4 common mistakes to avoid."),
  space(),

  h1("6. Planned Features (Phase 1+)"),
  h2("6.1 Phase 1 — Auth & Server-Side Storage"),
  bullet("Supabase Auth with magic link (passwordless) sign-in"),
  bullet("PostgreSQL database with row-level security (RLS)"),
  bullet("One-click migration of existing localStorage data on sign-up"),
  bullet("Auto-snapshot on every checkup submit (financial_snapshots table)"),
  h2("6.2 Phase 2 — Coach Portal & Invite Links"),
  bullet("Invite link flow: coach generates 6-char code → client signs up via /join?code=XXXXX → auto-linked"),
  bullet("/coach portal: all clients with health score badge, last update, net worth trend"),
  bullet("/coach/client/[userId]: full read-only client dashboard (RLS enforced)"),
  h2("6.3 Phase 3 — Net Worth Chart"),
  bullet("Recharts line chart on dashboard showing net worth per snapshot date"),
  h2("6.4 Phase 4 — Learning Progress Tracking"),
  bullet("Mark module read (expand + 20-second read timer), progress bar, coach visibility"),
  h2("6.5 Phase 5 — Milestone Badges (20 badges)"),
  p("Badge categories: Getting Started, Emergency Fund, Debt, Investing, Net Worth, Health Score, Savings Rate, Progress."),
  space(),

  h1("7. Technical Architecture"),
  h2("7.1 MVP Stack"),
  twoColTable([
    ["Layer", "Technology"],
    ["Framework", "Next.js 14 (App Router)"],
    ["Language", "TypeScript"],
    ["Styling", "Tailwind CSS"],
    ["Components", "shadcn/ui (Radix UI)"],
    ["Charts", "Recharts"],
    ["State", "React Context + localStorage hook"],
    ["Deployment", "Vercel (static export)"],
  ]),
  space(),
  h2("7.2 Phase 1+ Stack Additions"),
  twoColTable([
    ["Layer", "Technology"],
    ["Auth", "Supabase Auth (magic link)"],
    ["Database", "Supabase PostgreSQL with RLS"],
    ["Real-time", "Supabase Realtime"],
    ["Client", "Supabase JS SDK"],
  ]),
  space(),
  h2("7.3 Key Architecture Decisions"),
  bullet("Client-side only for MVP: zero infrastructure, instant deployment, no GDPR complexity"),
  bullet("Pure functions in /lib/calculations.ts: all financial logic is testable and framework-agnostic"),
  bullet("localStorage hook: hydration-safe, SSR-compatible, supports pre-filling checkup"),
  bullet("Glassmorphism design system: bg-white/70 cards on deep navy gradient"),
  space(),

  h1("8. Financial Calculation Methodology"),
  h2("8.1 Health Score (0–100)"),
  p("Four components × 25 points = 100 total. Each displayed as X/10:"),
  bullet("Savings Rate: 25%+ = 25pts, 15–24% = 18pts, 5–14% = 10pts, 0–4% = 4pts, negative = 0"),
  bullet("Emergency Fund: 6+ months = 25pts, 3–5.9mo = 18pts, 1–2.9mo = 10pts, <1mo = 4pts"),
  bullet("Debt: no debt = 25pts, low-debt = 18pts, moderate no high-APR = 12pts, high-APR = 0"),
  bullet("Investing: has investments = 25pts, some = 15pts, none = 0"),
  h2("8.2 Freedom Age Projection"),
  bullet("FI Number = 25× annual spending (4% safe withdrawal rate)"),
  bullet("7% real annual return; monthly surplus invested until FI Number reached"),
  bullet("4 states: already_reached, no_surplus, over_50_years (>600 months), normal"),
  h2("8.3 Benchmarks"),
  bullet("Net worth target: age × annual income ÷ 10"),
  bullet("Fidelity milestones: 1× salary by 30, 3× by 40, 6× by 50, 8× by 60"),
  bullet("Emergency fund target: 6 months of monthly expenses (CFP Board)"),
  bullet("Federal Reserve median: 2023 Survey of Consumer Finances by age group"),
  space(),

  h1("9. Success Metrics"),
  twoColTable([
    ["Metric", "Target"],
    ["Checkup completion rate", "60%+ of visitors who start complete all 5 steps"],
    ["Dashboard return rate", "40%+ return within 30 days to update numbers"],
    ["Learning engagement", "30%+ read at least 3 modules"],
    ["Tool usage", "50%+ interact with at least 1 financial tool"],
    ["Phase 1 conversion", "25%+ create an account when auth is available"],
  ], 3000, 6360),
  space(),

  h1("10. Design Principles"),
  bullet("Clarity over completeness — every number is explained, every benchmark sourced"),
  bullet("Education-first — users should understand their situation, not just see it"),
  bullet("Honest benchmarking — real data from Fed Reserve, Fidelity, BEA — not invented targets"),
  bullet("Actionable output — every section leads to a specific next step"),
  bullet("Accessible by default — no financial advisor required to understand the dashboard"),
  space(),
  p("All calculations are educational estimates. Freedomly is not a financial advisor. Assumptions: 7% real annual return, 4% safe withdrawal rate.",
    { color: MUTED, size: 18, italic: true }),
];

const doc = new Document({ numbering, styles, sections: [{
  properties: pageProps,
  headers: { default: new Header({ children: [new Paragraph({
    alignment: AlignmentType.RIGHT,
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: NAVY, space: 1 } },
    children: [new TextRun({ text: "Freedomly — Product Requirements Document", size: 16, color: SLATE, font: "Calibri" })]
  })]})},
  footers: { default: footer },
  children
}]});

Packer.toBuffer(doc)
  .then(buf => { fs.writeFileSync(OUTPUT, buf); console.log("✓ Freedomly_PRD.docx"); })
  .catch(err => { console.error(err); process.exit(1); });
