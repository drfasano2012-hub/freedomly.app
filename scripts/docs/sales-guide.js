/**
 * Freedomly — sales-guide.js
 * Generates Freedomly_Sales_Guide.docx
 *
 * Run:  node scripts/docs/sales-guide.js
 * Or:   npm run update-docs
 *
 * Keep this file in sync with the app:
 *   - Competitor table         → update when new features ship
 *   - Coach portal section     → update when Phase 1/2 features launch
 *   - Roadmap table            → update as phases complete
 *   - Business model section   → update pricing/tiers when decided
 */

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  Header, Footer, PageNumber, LevelFormat, PageBreak
} = require("docx");
const fs   = require("fs");
const path = require("path");
const OUTPUT = path.join(__dirname, "../../Freedomly_Sales_Guide.docx");

// ─── Palette ────────────────────────────────────────────────────
const NAVY      = "0c1836";
const EMERALD   = "0f7a57";
const BLUE      = "1e3a8a";
const SLATE     = "475569";
const LIGHT     = "f0fdf4";
const LIGHTBLUE = "eff6ff";
const LIGHTYELLOW = "fffbeb";
const BORDER    = "e2e8f0";
const MUTED     = "94a3b8";
const RED       = "dc2626";
const AMBER     = "92400e";

const numbering = { config: [
  { reference: "bullets",
    levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } }, run: { color: EMERALD } } }] },
  { reference: "check",
    levels: [{ level: 0, format: LevelFormat.BULLET, text: "✓", alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } }, run: { color: EMERALD } } }] },
  { reference: "cross",
    levels: [{ level: 0, format: LevelFormat.BULLET, text: "✗", alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } }, run: { color: RED } } }] },
]};

const styles = {
  default: { document: { run: { font: "Calibri", size: 22, color: "1e293b" } } },
  paragraphStyles: [
    { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 44, bold: true, font: "Calibri", color: NAVY },
      paragraph: { spacing: { before: 480, after: 160 }, outlineLevel: 0,
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: EMERALD, space: 4 } } } },
    { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 30, bold: true, font: "Calibri", color: NAVY },
      paragraph: { spacing: { before: 320, after: 100 }, outlineLevel: 1 } },
    { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { size: 24, bold: true, font: "Calibri", color: BLUE },
      paragraph: { spacing: { before: 200, after: 60 }, outlineLevel: 2 } },
  ]
};

// ─── Helpers ────────────────────────────────────────────────────
const h1 = t => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)] });
const h2 = t => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] });
const h3 = t => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(t)] });
const p  = (text, opts = {}) => new Paragraph({
  spacing: { after: opts.after ?? 120 },
  children: [new TextRun({ text, size: opts.size, bold: opts.bold, italic: opts.italic, color: opts.color, font: "Calibri" })]
});
const bullet  = text => new Paragraph({ spacing: { after: 80 }, numbering: { reference: "bullets", level: 0 },
  children: [new TextRun({ text, font: "Calibri", size: 22 })] });
const check   = text => new Paragraph({ spacing: { after: 80 }, numbering: { reference: "check", level: 0 },
  children: [new TextRun({ text, font: "Calibri", size: 22 })] });
const cross   = text => new Paragraph({ spacing: { after: 80 }, numbering: { reference: "cross", level: 0 },
  children: [new TextRun({ text, font: "Calibri", size: 22, color: SLATE })] });
const space   = (h = 120) => new Paragraph({ spacing: { after: h }, children: [new TextRun("")] });
const pb      = ()        => new Paragraph({ children: [new PageBreak()] });

function callout(lines, bg = LIGHT, borderColor = EMERALD) {
  const b = { style: BorderStyle.SINGLE, size: 1, color: borderColor };
  const borders = { top: b, bottom: b, left: b, right: b };
  return new Table({
    width: { size: 9360, type: WidthType.DXA }, columnWidths: [9360],
    rows: lines.map((ln, i) => new TableRow({ children: [new TableCell({
      borders, width: { size: 9360, type: WidthType.DXA },
      shading: { fill: bg, type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 200, right: 200 },
      children: [new Paragraph({ spacing: { after: i === lines.length - 1 ? 0 : 80 },
        children: [new TextRun({ text: ln.text, bold: ln.bold, italic: ln.italic,
          color: ln.color || "1e293b", size: ln.size || 22, font: "Calibri" })] })]
    })] }))
  });
}

function tiersTable(headers, rows) {
  const b = { style: BorderStyle.SINGLE, size: 1, color: BORDER };
  const borders = { top: b, bottom: b, left: b, right: b };
  const colCount = headers.length;
  const colW = Math.floor(9360 / colCount);
  const colWidths = Array(colCount).fill(colW);
  return new Table({
    width: { size: 9360, type: WidthType.DXA }, columnWidths: colWidths,
    rows: [headers, ...rows].map((row, ri) => new TableRow({ children: row.map((cell, ci) => {
      const isHeader = ri === 0;
      const val = typeof cell === "object" ? cell : { text: cell, fill: null, color: null, bold: false };
      const fill = isHeader
        ? (ci === 0 ? "1e293b" : ci === 1 ? "166534" : ci === 2 ? "1e3a8a" : ci === 3 ? "7c3aed" : "0f172a")
        : (val.fill || (ri % 2 === 0 ? "ffffff" : "f8fafc"));
      const textColor = isHeader ? "ffffff" : (val.color || (ci === 0 ? NAVY : SLATE));
      const bold = isHeader || val.bold || false;
      return new TableCell({ borders, width: { size: colW, type: WidthType.DXA },
        shading: { fill, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({
          text: val.text || cell, bold, color: textColor, size: isHeader ? 20 : 19, font: "Calibri"
        })] })]
      });
    }) }))
  });
}

function compTable(headers, rows) {
  const b = { style: BorderStyle.SINGLE, size: 1, color: BORDER };
  const borders = { top: b, bottom: b, left: b, right: b };
  const colW = Math.floor(9360 / headers.length);
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: Array(headers.length).fill(colW),
    rows: [headers, ...rows].map((row, ri) => new TableRow({ children: row.map((cell, ci) => {
      const isHeader = ri === 0, isFirst = ci === 0;
      const val = typeof cell === "object" ? cell : { text: cell, mark: null };
      let fill = isHeader ? NAVY : (ri % 2 === 0 ? "ffffff" : "f8fafc");
      let textColor = isHeader ? "ffffff" : (isFirst ? NAVY : SLATE);
      let bold = isHeader || isFirst, displayText = val.text;
      if (val.mark === "yes")     { textColor = EMERALD; bold = true; displayText = "✓  " + val.text; }
      if (val.mark === "no")      { textColor = RED;     displayText = "✗  " + val.text; }
      if (val.mark === "partial") { textColor = "b45309"; displayText = "~  " + val.text; }
      return new TableCell({ borders, width: { size: colW, type: WidthType.DXA },
        shading: { fill, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        children: [new Paragraph({ children: [new TextRun({
          text: displayText, bold, color: textColor, size: isHeader ? 20 : 19, font: "Calibri"
        })] })]
      });
    }) }))
  });
}

const pageProps = { page: { size: { width: 12240, height: 15840 },
  margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } };

const footer = new Footer({ children: [new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [
    new TextRun({ text: "Freedomly  |  freedomly.app  |  Confidential  |  Page ", size: 16, color: MUTED, font: "Calibri" }),
    new TextRun({ children: [PageNumber.CURRENT], size: 16, color: MUTED, font: "Calibri" }),
  ]
})]});

// ══════════════════════════════════════════════════════════════
// DOCUMENT CONTENT
// ══════════════════════════════════════════════════════════════
const children = [

  // ─── COVER ──────────────────────────────────────────────────
  new Paragraph({ spacing: { before: 480, after: 80 },
    children: [new TextRun({ text: "Freedomly", size: 80, bold: true, font: "Calibri", color: NAVY })] }),
  new Paragraph({ spacing: { after: 80 },
    children: [new TextRun({ text: "Market Differentiation, Business Model & Sales Guide", size: 32, bold: true, font: "Calibri", color: EMERALD })] }),
  new Paragraph({ spacing: { after: 80 },
    children: [new TextRun({ text: "Why Freedomly wins — for individuals, financial coaches, and the businesses built around them.", size: 22, font: "Calibri", color: SLATE, italic: true })] }),
  space(240),
  callout([
    { text: "The one-sentence pitch:", bold: true, size: 20, color: NAVY },
    { text: "Freedomly is a financial system that gives you clarity on your money — so you stress less, know exactly where you're headed, and unlock your freedom. It turns scattered numbers into a clear plan in 5 minutes, free, no login required.", size: 22 }
  ], LIGHT, EMERALD),
  space(240), pb(),

  // ─── 1. MARKET OPPORTUNITY ──────────────────────────────────
  h1("1. The Market Opportunity"),
  p("Personal finance is a massive, underserved market — and most tools are solving the wrong problem."),
  space(80),
  compTable(["The Stat", "What It Means"], [
    ["78% of Americans live paycheck to paycheck",             "The vast majority have no plan, no roadmap, no number"],
    ["Only 33% pass a basic financial literacy test",          "The knowledge gap is as big as the money gap"],
    ["$30B+ personal finance software market (2025)",          "Dominated by budgeting and tracking apps — not planning tools"],
    ["Average US savings rate: 3–5%",                          "Well below the 15% needed for financial independence"],
    ["Median retirement savings under 35: $0",                 "A generation hasn't started — and doesn't know where to start"],
    ["Financial coaching market growing 22% YoY",              "Coaches need better tools — spreadsheets and PDFs aren't enough"],
    ["Average financial advisor: $250/hour+",                  "Most people can't afford personalized financial guidance"],
  ]),
  space(160),
  p("The existing market is split between budgeting apps (track spending) and investment platforms (manage money). No tool exists that bridges the gap: showing someone exactly where they stand, benchmarked against real data, and telling them precisely what to do next. That gap is Freedomly."),
  space(), pb(),

  // ─── 2. BUSINESS MODEL ──────────────────────────────────────
  h1("2. Business Model & Revenue Strategy"),
  p("Freedomly is built on a freemium foundation with multiple revenue layers that expand with user depth — from individual subscribers to coaching practices to enterprise licensing."),
  space(160),

  h2("2.1 The Four Revenue Tiers"),
  space(80),
  // ✏️ Update pricing when decided
  tiersTable(
    ["Feature", "Free", "Pro Individual", "Coach", "Enterprise"],
    [
      ["Price",                        "Free forever",   "$12/month",         "$79/month",          "Custom"],
      ["Full financial checkup",       { text: "✓", color: EMERALD, bold: true }, { text: "✓", color: EMERALD, bold: true }, { text: "✓", color: EMERALD, bold: true }, { text: "✓", color: EMERALD, bold: true }],
      ["Complete dashboard",           { text: "✓", color: EMERALD, bold: true }, { text: "✓", color: EMERALD, bold: true }, { text: "✓", color: EMERALD, bold: true }, { text: "✓", color: EMERALD, bold: true }],
      ["3 financial tools",            { text: "✓", color: EMERALD, bold: true }, { text: "✓", color: EMERALD, bold: true }, { text: "✓", color: EMERALD, bold: true }, { text: "✓", color: EMERALD, bold: true }],
      ["11 learning modules",          { text: "✓", color: EMERALD, bold: true }, { text: "✓", color: EMERALD, bold: true }, { text: "✓", color: EMERALD, bold: true }, { text: "✓", color: EMERALD, bold: true }],
      ["Data stored in cloud",         { text: "✗", color: RED },  { text: "✓", color: EMERALD, bold: true }, { text: "✓", color: EMERALD, bold: true }, { text: "✓", color: EMERALD, bold: true }],
      ["Net worth history chart",      { text: "✗", color: RED },  { text: "✓", color: EMERALD, bold: true }, { text: "✓", color: EMERALD, bold: true }, { text: "✓", color: EMERALD, bold: true }],
      ["Milestone badges (20)",        { text: "✗", color: RED },  { text: "✓", color: EMERALD, bold: true }, { text: "✓", color: EMERALD, bold: true }, { text: "✓", color: EMERALD, bold: true }],
      ["Dashboard PDF export",         { text: "✗", color: RED },  { text: "✓", color: EMERALD, bold: true }, { text: "✓", color: EMERALD, bold: true }, { text: "✓", color: EMERALD, bold: true }],
      ["Client invite links",          { text: "✗", color: RED },  { text: "✗", color: RED },  { text: "✓ Unlimited", color: EMERALD, bold: true }, { text: "✓", color: EMERALD, bold: true }],
      ["Coach portal",                 { text: "✗", color: RED },  { text: "✗", color: RED },  { text: "✓", color: EMERALD, bold: true }, { text: "✓", color: EMERALD, bold: true }],
      ["Client dashboard view",        { text: "✗", color: RED },  { text: "✗", color: RED },  { text: "✓", color: EMERALD, bold: true }, { text: "✓", color: EMERALD, bold: true }],
      ["Learning progress per client", { text: "✗", color: RED },  { text: "✗", color: RED },  { text: "✓", color: EMERALD, bold: true }, { text: "✓", color: EMERALD, bold: true }],
      ["Custom branding / white-label",{ text: "✗", color: RED },  { text: "✗", color: RED },  { text: "✗", color: RED },  { text: "✓", color: EMERALD, bold: true }],
      ["API access",                   { text: "✗", color: RED },  { text: "✗", color: RED },  { text: "✗", color: RED },  { text: "✓", color: EMERALD, bold: true }],
    ]
  ),
  space(200),

  h2("2.2 Why Freemium Works Here"),
  p("The free tier is genuinely valuable — not crippled. A free user gets the full checkup, the full dashboard, all tools, and all learning modules. This is intentional:"),
  bullet("Lowers the activation barrier to zero — no email, no card, no commitment"),
  bullet("Creates immediate wow moments that justify upgrading (the FI number, the health score, the benchmarks)"),
  bullet("Drives word-of-mouth — users share their dashboard because it's surprising and personal"),
  bullet("The upgrade hook is clear: losing their data (localStorage only) is the natural push to create a Pro account"),
  space(120),
  callout([
    { text: "The upgrade trigger:", bold: true, color: NAVY, size: 21 },
    { text: "\"Your data is stored in this browser only. Create a free account to save your progress to the cloud and unlock your net worth history chart.\"", italic: true, size: 22, color: "1e293b" },
    { text: "This converts naturally — no heavy sales pitch needed.", color: SLATE, size: 20 }
  ], LIGHTYELLOW, AMBER),
  space(160),

  h2("2.3 The Coaching Revenue Layer"),
  p("The Coach tier is the highest-value segment. A single coach managing 20 clients at $79/month generates more revenue than 132 individual Pro subscribers. The unit economics are strong:"),
  bullet("Coaches have a clear, quantifiable ROI: 2–3 hours saved per client per month × their hourly rate"),
  bullet("Coaches are sticky — once their client roster is in the platform, switching cost is high"),
  bullet("Coaches become distribution channels — every client invite is a new potential user"),
  bullet("Coach satisfaction is directly tied to client outcomes, which Freedomly improves"),
  space(120),

  h2("2.4 Enterprise & CFP Licensing"),
  p("The highest-value tier targets financial practices, RIA firms, and coaching organizations that want to deploy Freedomly at scale:"),
  bullet("White-label — custom branding, custom domain, firm's logo and colors"),
  bullet("API access — integrate Freedomly's calculation engine with existing CRM systems (Salesforce, Redtail, Wealthbox)"),
  bullet("Bulk seat management — onboard 50 coaches across a firm under one contract"),
  bullet("Custom curriculum — replace or supplement the 11 standard learning modules with proprietary content"),
  bullet("Compliance reporting — exportable audit trail for regulated firms (RIAs, broker-dealers)"),
  p("Target buyers: financial coaching certification programs, CFP training organizations, RIA firms, credit unions, and HR departments offering employee financial wellness."),
  space(120),

  h2("2.5 Additional Revenue Angles"),
  p("Beyond direct subscriptions, Freedomly has multiple adjacent revenue opportunities:"),
  space(80),
  compTable(["Revenue Angle", "Mechanism", "Potential"], [
    ["Referral / affiliate partnerships",  "When users are investment-ready, refer to Betterment, Vanguard, Fidelity with affiliate link", "~$50–200 per referred account opened"],
    ["Freedomly Certified Coach program",  "Coaches pay for certification that teaches the Freedomly methodology + gets listed in a coach directory", "One-time fee + annual renewal"],
    ["CE credits for CFPs",                "License educational content as continuing education credit hours for certified planners", "B2B content licensing"],
    ["Financial wellness for employers",   "HR departments buy Pro/Coach access for employees as a benefit — high ACV, low churn", "Per-employee or site license"],
    ["Group coaching cohorts",             "Platform-hosted 8-week cohorts run by Freedomly-certified coaches using the platform", "Revenue share with coaches"],
    ["Data insights (anonymized)",         "Aggregate anonymized financial health trends — sold to researchers, policymakers", "Long-term, requires scale"],
  ]),
  space(), pb(),

  // ─── 3. WHO IT'S FOR ────────────────────────────────────────
  h1("3. Who Freedomly Is For"),

  h2("3.1 The Individual — \"I know I should be doing better, but I don't know where I stand\""),
  p("They have income, some savings, maybe some debt. They're not broke — but they're not on a clear path. They've Googled \"how much should I have saved by 30\" and got contradictory answers. They want the truth about their situation without paying $200/hour."),
  space(120),
  callout([
    { text: "Time savings: what Freedomly replaces", bold: true, color: NAVY, size: 21 },
    { text: "Without Freedomly: 3–5 hours of research across spreadsheets, financial calculators, articles, and Reddit threads — arriving at partial answers with no benchmarks and no plan.", color: SLATE, size: 21 },
    { text: " ", size: 10 },
    { text: "With Freedomly: 5 minutes. Full picture. Sourced benchmarks. Personalized action plan. Done.", bold: true, color: EMERALD, size: 22 }
  ], LIGHT, EMERALD),
  space(160),

  h2("3.2 The Financial Coach — \"I want to add value from minute one, and prove it over time\""),
  p("Independent financial coaches, CFPs, and money mentors who serve clients 1:1 or in groups. They want to be seen as rigorous and data-driven — not just a friendly voice with general advice."),
  space(120),
  callout([
    { text: "Time savings: what Freedomly replaces for coaches", bold: true, color: NAVY, size: 21 },
    { text: "Without Freedomly: 2–3 hours per new client — intake form, follow-up email, manual calculations, building a summary spreadsheet, preparing talking points. Before the first session even starts.", color: SLATE, size: 21 },
    { text: " ", size: 10 },
    { text: "With Freedomly: Send one link. Client completes the checkup in 5 minutes. Walk into the first session already knowing their health score, FI number, biggest liability, and top priority action.", bold: true, color: EMERALD, size: 22 },
    { text: " ", size: 10 },
    { text: "For a coach with 20 active clients, that's 40–60 hours saved per year on intake alone.", italic: true, color: AMBER, size: 21, bold: true }
  ], LIGHT, EMERALD),
  space(160),

  h2("3.3 The Motivated Learner"),
  p("Users who come for the education — the 11 learning modules covering savings, debt, investing, FIRE, and the stock market. They want to understand the math behind their dashboard, not just take a number on faith."),
  space(), pb(),

  // ─── 4. THE FREEDOMLY DIFFERENCE ────────────────────────────
  h1("4. The Freedomly Difference"),
  h2("4.1 Complete Picture vs. Partial View"),
  p("Budgeting apps show you where your money went. Investment platforms help you put money to work. Freedomly answers the questions they don't — where you stand, where you're headed, and what to do next — in one place, calculated instantly."),
  space(80),
  compTable(["", "Mint / YNAB", "Personal Capital", "NerdWallet", "Freedomly"], [
    ["Track spending",           { text: "Yes", mark: "yes" },     { text: "Yes", mark: "yes" },      { text: "Partial", mark: "partial" }, { text: "Not the focus", mark: "no" }],
    ["Financial health score",   { text: "No", mark: "no" },      { text: "No", mark: "no" },        { text: "No", mark: "no" },          { text: "Yes — 0–100", mark: "yes" }],
    ["Freedom age projection",   { text: "No", mark: "no" },      { text: "No", mark: "no" },        { text: "No", mark: "no" },          { text: "Yes — FI Number + years", mark: "yes" }],
    ["Real benchmark data",      { text: "No", mark: "no" },      { text: "Partial", mark: "partial"},{ text: "No", mark: "no" },          { text: "Yes — Fed, Fidelity, BEA", mark: "yes" }],
    ["Personalized action plan", { text: "No", mark: "no" },      { text: "No", mark: "no" },        { text: "No", mark: "no" },          { text: "Yes — top 3 from your data", mark: "yes" }],
    ["No login to start",        { text: "No", mark: "no" },      { text: "No", mark: "no" },        { text: "No", mark: "no" },          { text: "Yes — instant, private", mark: "yes" }],
    ["Coach portal",             { text: "No", mark: "no" },      { text: "No", mark: "no" },        { text: "No", mark: "no" },          { text: "Coming Phase 1", mark: "partial" }],
    ["Built-in education",       { text: "No", mark: "no" },      { text: "No", mark: "no" },        { text: "Articles only", mark: "partial"},{ text: "Yes — 11 guided modules", mark: "yes" }],
  ]),
  space(200),

  h2("4.2 Benchmarks Based on Real Data — Not Invented Targets"),
  bullet("Net worth target — age × income ÷ 10 (widely cited benchmark)"),
  bullet("Retirement savings — Fidelity Investments published milestones by age"),
  bullet("Emergency fund — CFP Board recommendation (3–6 months)"),
  bullet("Savings rate context — Bureau of Economic Analysis (US avg: 3–5%)"),
  bullet("Net worth median — Federal Reserve Survey of Consumer Finances 2023"),
  p("Users don't just get a number. They get a sourced benchmark and know where it comes from. That's what separates education from noise."),
  space(), pb(),

  // ─── 5. CORE BENEFITS ───────────────────────────────────────
  h1("5. Core Benefits — For Individuals"),
  space(80),

  h2("\"I finally know my number — in 5 minutes\""),
  p("What used to require hours across spreadsheets, calculators, and Reddit threads now takes 5 minutes. The Freedom Age card gives every user their FI Number (25× annual spending) and the age at which they'll reach it at 7% annual return. For many people this is the first time they've seen a concrete, sourced answer to \"when can I stop working?\""),
  p("This number becomes an anchor for every financial decision that follows."),
  space(120),

  h2("\"I know if I'm ahead or behind — and why\""),
  p("The Benchmarks section simultaneously compares the user against five published standards. Most users have never seen their situation benchmarked this way. Either way, they now have context — and context is the foundation of motivation."),
  space(120),

  h2("\"I know exactly what to do next — not just 'save more'\""),
  p("The Action Plan generates a prioritized top-3 list from the user's actual data. Example outputs:"),
  bullet("\"Build your emergency fund before investing — you have less than 1 month of coverage\""),
  bullet("\"Pay off your credit card at 24% APR before any other financial goal\""),
  bullet("\"You're on track — increase your retirement contributions to accelerate your freedom date\""),
  space(120),

  h2("\"I understand it — I'm not just trusting a black box\""),
  p("The 11 learning modules give users the context behind every dashboard number. Financial literacy and financial action are tied together — not separated."),
  space(), pb(),

  // ─── 6. THE COACHING ANGLE ──────────────────────────────────
  h1("6. The Coaching Angle — Freedomly as Your Practice Infrastructure"),
  space(80),
  callout([
    { text: "\"Most of my prep time before a session is gathering their information. With Freedomly, I send a link, they complete the checkup, and I walk in already knowing everything.\"", italic: true, size: 22, color: NAVY },
    { text: "— The problem Freedomly is designed to eliminate for coaches", size: 19, color: MUTED }
  ], LIGHTBLUE, BLUE),
  space(160),

  h2("6.1 The Time Savings — By the Numbers"),
  space(80),
  compTable(["Task", "Without Freedomly", "With Freedomly", "Time Saved"], [
    ["New client intake",         "60–90 min (form + follow-up + spreadsheet)",   "5 min (client completes checkup)",         "55–85 min"],
    ["Pre-session prep",          "30–45 min per session",                        "5–10 min (review dashboard)",              "20–35 min per session"],
    ["Calculating FI number",     "15–20 min manually",                           "Instant — auto-calculated",                "15–20 min"],
    ["Benchmark research",        "20–30 min (Fidelity, Fed, CFP)",               "Instant — all sourced benchmarks included","20–30 min"],
    ["Progress tracking",         "Manual spreadsheet update",                    "Auto-updated on every checkup",            "Ongoing hours"],
    ["Client homework tracking",  "Email follow-up, no visibility",               "Learning progress visible in coach portal","Per client per month"],
  ]),
  space(160),
  callout([
    { text: "For a coach with 20 active clients:", bold: true, color: NAVY, size: 22 },
    { text: "Conservative estimate: 3 hours saved per client per month = 60 hours/month = 720 hours/year.", size: 22, color: "1e293b" },
    { text: "At a $150/hour coaching rate, that's $108,000 worth of time freed up annually — time that can be reinvested in more clients, more depth, or more life.", bold: true, color: EMERALD, size: 22 }
  ], LIGHT, EMERALD),
  space(160),

  h2("6.2 How Coaches Use Freedomly Today (MVP)"),
  bullet("Send clients a link to freedomly.app before the first session — 5 minutes to complete"),
  bullet("Client shares their dashboard on a call for a structured, data-driven starting point"),
  bullet("Learning modules serve as homework — \"read these three modules before our next call\""),
  bullet("The coaching framework page provides the theoretical foundation for the coach's methodology"),
  space(120),

  h2("6.3 What the Coach Portal Adds (Phase 1+)"),
  compTable(["Feature", "Coach Benefit", "Time Impact"], [
    ["Invite link flow",          "Generate a link → client signs up → auto-linked to your portal",          "Replaces manual intake process"],
    ["Coach portal (/coach)",     "All clients in one view: health score, last update, net worth trend",     "30-sec status check replaces 20 min of emails"],
    ["Client dashboard view",     "Full read-only client dashboard — exact numbers before every call",       "Prep time: 45 min → 5 min"],
    ["Net worth chart",           "Show clients their trajectory — the most powerful progress motivator",    "Visible ROI of coaching relationship"],
    ["Learning progress",         "See which modules each client has read — built-in accountability",        "Eliminates \"did you do the homework?\" email chain"],
    ["Milestone badges",          "20 achievement badges clients earn — positive reinforcement between sessions","Keeps clients engaged without coach involvement"],
  ]),
  space(160),

  h2("6.4 The Coach Value Proposition in Two Lines"),
  callout([
    { text: "Before Freedomly:", bold: true, color: NAVY, size: 22 },
    { text: "Manual intake forms. Spreadsheet analysis. No shared view of client progress. Sessions spent gathering information. Clients disengage between calls. Proving value is hard.", color: SLATE, size: 21 },
    { text: " ", size: 10 },
    { text: "With Freedomly:", bold: true, color: EMERALD, size: 22 },
    { text: "Client completes checkup in 5 minutes. Coach walks in with full context. Every session spent making decisions, not collecting data. Progress is visible, tracked, and celebrated. Value is undeniable.", color: "1e293b", size: 21 },
  ], LIGHT, EMERALD),
  space(160),

  h2("6.5 The CFP & Professional Certification Angle"),
  p("Freedomly isn't just for independent coaches — it's positioned for the wider professional ecosystem:"),
  bullet("CFP firms: deploy Freedomly as a client onboarding and progress-tracking layer — reduces advisor prep time and improves client engagement scores"),
  bullet("Coaching certification programs: license Freedomly as a required tool in their curriculum — gives graduates a ready-made practice platform on day one"),
  bullet("Credit unions & banks: offer Freedomly as a financial wellness benefit to members/customers — the free tier is a low-cost, high-value member benefit"),
  bullet("HR / benefits teams: offer Freedomly Pro as an employee financial wellness benefit — measurable, privacy-preserving, no employer access to employee data"),
  space(), pb(),

  // ─── 7. WHY NOW ─────────────────────────────────────────────
  h1("7. Why Now"),
  compTable(["Tailwind", "Why It Matters"], [
    ["Post-pandemic financial reset",       "Millions took a hard look at their finances and don't want to return to flying blind"],
    ["FIRE movement mainstream",            "\"FI number\" is in the cultural vocabulary — people want theirs, but don't have it"],
    ["Rise of independent financial coaching","22% YoY growth — coaches need infrastructure, not just hustle"],
    ["AI-native consumer expectations",    "Users expect instant, personalized insights — not generic articles or spreadsheets"],
    ["Distrust of financial institutions", "Free, transparent tools with no sales agenda earn trust fast with younger demographics"],
    ["Remote coaching as the default",     "Coaches and clients work async — a shared live dashboard is the natural infrastructure"],
  ]),
  space(), pb(),

  // ─── 8. OBJECTION HANDLING ──────────────────────────────────
  h1("8. Objection Handling"),
  space(80),
  h3("\"I already use Mint / YNAB for budgeting\""),
  p("Freedomly is not a budgeting replacement — it's the layer above budgeting. Mint tells you where your money went. Freedomly tells you where your life is going financially. Most users will use both."),
  space(120),
  h3("\"I use Personal Capital for investment tracking\""),
  p("Personal Capital tracks your portfolio. Freedomly benchmarks your entire financial situation and gives you a freedom projection. The Freedom Age calculator, health score, and action plan don't exist in Personal Capital."),
  space(120),
  h3("\"Why trust calculations from a free web app?\""),
  p("Every calculation uses industry-standard methods: 4% safe withdrawal rate (Trinity Study), 7% real return (historical S&P 500). Every benchmark is sourced from Fidelity, the Federal Reserve, the CFP Board, and the Bureau of Economic Analysis. The math is transparent — every number links to its source."),
  space(120),
  h3("\"As a coach, I need something more robust\""),
  p("The coach portal is built for professional use: invite links, client roster, full dashboard per client, net worth tracking, and learning progress. Built on Supabase with row-level security — production-grade infrastructure. Coaching is a first-class use case, not an afterthought."),
  space(120),
  h3("\"My clients won't take 5 minutes to fill this out\""),
  p("The checkup has a \"Try sample data\" button that pre-fills everything in one click — useful for demonstrations. For real clients, 5 minutes is less friction than a PDF intake form or a pre-session questionnaire. The output is immediate and visual, which is a strong motivator to complete it."),
  space(), pb(),

  // ─── 9. THE NUMBERS THAT SELL IT ────────────────────────────
  h1("9. The Numbers That Sell It"),
  compTable(["Fact", "Source", "Why It Lands"], [
    ["78% of Americans live paycheck to paycheck",     "CNBC / LendingClub",     "Most people hearing this know they're in it"],
    ["Average American retires with $87K saved",       "Federal Reserve SCF",    "Far below any FI number — creates urgency"],
    ["7% real return doubles money every ~10 years",   "Historical S&P 500",     "Compound growth is the most powerful concept — and most people don't feel it viscerally"],
    ["Cutting $500/month saves $150K+ over 10 years",  "Compound growth math",   "Reframes spending cuts as wealth-building"],
    ["Adding $300/month can cut a decade off freedom", "Freedomly projection",   "Immediately actionable and personal"],
    ["Coaches: 60+ hours saved per month per 20 clients","Freedomly time calc",  "Translates directly to coach ROI and capacity"],
    ["$250+/hour: avg financial advisor cost",         "CFP Board data",         "Makes Freedomly's free tier look extraordinary by comparison"],
  ]),
  space(), pb(),

  // ─── 10. CONVERSATION SCRIPTS ───────────────────────────────
  h1("10. Positioning in a Conversation"),
  space(80),

  h2("For individuals"),
  callout([
    { text: "Opening: \"Do you know your FI number? The exact amount your investments need to reach before you no longer need to work for money?\"", italic: true, size: 22, color: "1e293b" },
    { text: "If they say no — which almost everyone does — the conversation writes itself.", color: SLATE, size: 21 }
  ], LIGHTBLUE, BLUE),
  space(120),
  p("Follow-up: \"In 5 minutes, Freedomly gives you that number, benchmarks your savings and net worth against Federal Reserve and Fidelity data, scores your financial health across 4 dimensions, and tells you the top 3 things that will move the needle most. No login. No email. Free.\""),
  space(160),

  h2("For financial coaches"),
  callout([
    { text: "Opening: \"How long does your new client intake process take — from first contact to being ready to actually coach them?\"", italic: true, size: 22, color: "1e293b" },
    { text: "The answer is always \"longer than it should be.\"", color: SLATE, size: 21 }
  ], LIGHTBLUE, BLUE),
  space(120),
  p("Follow-up: \"Freedomly replaces that entire intake process with a 5-minute checkup. Your client gets a full financial dashboard — health score, FI number, benchmarks, action plan. You walk into session one already knowing everything. And as the platform grows, you'll be able to track their net worth over time, see what they've learned, and watch their financial health score improve. That's coaching that proves its value.\""),
  space(160),

  h2("For CFP firms or coaching program directors"),
  callout([
    { text: "Opening: \"What tools do your coaches currently use to onboard clients and track their progress between sessions?\"", italic: true, size: 22, color: "1e293b" },
    { text: "The answer is usually a mix of Google Forms, spreadsheets, and email — nothing integrated.", color: SLATE, size: 21 }
  ], LIGHTBLUE, BLUE),
  space(120),
  p("Follow-up: \"Freedomly is built to be the operating platform for a coaching practice. Client onboarding in 5 minutes, a structured dashboard both parties can see, learning progress tracking, and net worth history over time. We're exploring white-label and enterprise licensing for firms that want this under their brand.\""),
  space(), pb(),

  // ─── 11. ROADMAP ────────────────────────────────────────────
  h1("11. The Roadmap"),
  compTable(["Phase", "Feature", "Revenue Impact", "Status"], [
    ["MVP",     "Full checkup + dashboard + tools + learn",     "Free → Pro upgrade hook",           "Live"],
    ["Phase 1", "Auth + cloud storage + snapshots",             "Unlocks Pro Individual subscription","Planning"],
    ["Phase 2", "Coach portal + invite links",                  "Unlocks Coach tier subscription",   "Planned"],
    ["Phase 3", "Net worth chart + badge milestones",           "Retention & engagement driver",     "Planned"],
    ["Phase 4", "Learning progress tracking",                   "Coach value proof point",           "Planned"],
    ["Phase 5", "PDF export + progress reports",                "Upsell hook for Pro + Coach",       "Planned"],
    ["Future",  "White-label + API + enterprise licensing",     "Highest ACV tier",                  "Roadmap"],
    ["Future",  "Freedomly Certified Coach program",            "New revenue stream + distribution", "Roadmap"],
  ]),
  space(), pb(),

  // ─── 12. MISSION ────────────────────────────────────────────
  h1("12. The Mission"),
  space(80),
  callout([
    { text: "\"Financial freedom shouldn't require a financial advisor.\"", bold: true, italic: true, size: 28, color: NAVY },
    { text: " ", size: 10 },
    { text: "Freedomly makes the math, the benchmarks, and the plan accessible to everyone — regardless of income, background, or prior financial knowledge.", size: 23, color: "1e293b" },
    { text: " ", size: 10 },
    { text: "That's not a tagline. It's the design constraint behind every feature, every benchmark, every explanation, and every action item in the platform.", size: 22, color: SLATE, italic: true }
  ], LIGHT, EMERALD),
  space(240),
  p("freedomly.app", { bold: true, size: 28, color: EMERALD }),
  space(240),
  p("All financial calculations are educational estimates. Freedomly is not a financial advisor. Benchmarks sourced from Federal Reserve SCF 2023, Fidelity Investments, CFP Board, and Bureau of Economic Analysis.", { color: MUTED, size: 17, italic: true }),
];

const doc = new Document({ numbering, styles, sections: [{ properties: pageProps,
  headers: { default: new Header({ children: [new Paragraph({
    alignment: AlignmentType.RIGHT,
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: EMERALD, space: 1 } },
    children: [new TextRun({ text: "Freedomly  |  Market Differentiation, Business Model & Sales Guide", size: 16, color: MUTED, font: "Calibri" })]
  })]})},
  footers: { default: footer }, children
}]});

Packer.toBuffer(doc)
  .then(buf => { fs.writeFileSync(OUTPUT, buf); console.log("✓ Freedomly_Sales_Guide.docx"); })
  .catch(err => { console.error(err); process.exit(1); });
