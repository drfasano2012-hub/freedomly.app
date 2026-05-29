/**
 * Freedomly — roadmap.js
 * Generates Freedomly_Roadmap.pptx (2-slide Now / Next / Later roadmap)
 *
 * Run:  node scripts/docs/roadmap.js
 * Or:   npm run update-docs
 *
 * Keep this file in sync with PROCESS.md and the product:
 *   - NOW column   → shipped features (app/, components/)
 *   - NEXT column  → Phase 1–2 plan (auth, cloud, coach portal)
 *   - LATER column → Phase 3+ (Plaid, mobile, licensing, B2B)
 */

const pptxgen = require("pptxgenjs");
const path = require("path");
const OUTPUT = path.join(__dirname, "../../Freedomly_Roadmap.pptx");

// ─── Palette ───────────────────────────────────────────────────
const NAVY    = "0C1836";
const CARD    = "0F2044";
const WHITE   = "FFFFFF";
const EMERALD = "10B981";
const BLUE    = "3B82F6";
const SLATE   = "64748B";

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Freedomly";
pres.title  = "Freedomly Product Roadmap";

// ─── SLIDE 1 — TITLE ───────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: NAVY };

  s.addShape(pres.shapes.OVAL, { x: 7.2, y: -1.8, w: 5.2, h: 5.2,
    fill: { color: EMERALD, transparency: 88 }, line: { color: EMERALD, transparency: 88 } });
  s.addShape(pres.shapes.OVAL, { x: -2.2, y: 3.4, w: 4.5, h: 4.5,
    fill: { color: "1E3A8A", transparency: 75 }, line: { color: "1E3A8A", transparency: 75 } });

  s.addText("PRODUCT ROADMAP", {
    x: 0.65, y: 1.5, w: 5, h: 0.35, fontSize: 9, bold: true, charSpacing: 5,
    color: EMERALD, fontFace: "Calibri", margin: 0 });
  s.addText("Freedomly", {
    x: 0.65, y: 1.88, w: 8.5, h: 1.0, fontSize: 54, bold: true, color: WHITE,
    fontFace: "Calibri", margin: 0 });
  s.addText("What we're building and when", {
    x: 0.65, y: 2.96, w: 7, h: 0.5, fontSize: 18, color: "A5B4FC",
    fontFace: "Calibri", margin: 0 });
  s.addText("freedomly.app", {
    x: 7.8, y: 5.18, w: 1.8, h: 0.28, fontSize: 9, color: "4B5563",
    align: "right", fontFace: "Calibri", margin: 0 });
}

// ─── SLIDE 2 — NOW / NEXT / LATER ──────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: NAVY };

  s.addText("Now  →  Next  →  Later", {
    x: 0.45, y: 0.2, w: 9.1, h: 0.58, fontSize: 26, bold: true, color: WHITE,
    fontFace: "Calibri", margin: 0 });

  const CW = 3.0, CH = 4.2, CY = 0.94;
  const cols = [
    { x: 0.38, accent: EMERALD, label: "SHIPPED", header: "Now", sub: "MVP Live",
      items: [
        "✓  Financial Health Score (0–100)",
        "✓  Freedom Age Projection + spending adjuster",
        "✓  Net Worth Benchmarks (Fed Reserve + Fidelity)",
        "✓  Financial Tools (Coast FIRE, Compound Growth)",
        "✓  Personalized Action Plan",
        "✓  11 Learning Modules",
        "✓  Portfolio Allocation Quiz",
        "✓  Local data persistence",
      ] },
    { x: 3.50, accent: BLUE, label: "NEXT", header: "Foundation + Retention", sub: "Phase 1 · Q3 2025",
      items: [
        "→  User accounts (magic-link auth)",
        "→  Cloud storage + migrate local data",
        "→  Net-worth & metric tracking over time",
        "→  Net-worth TREND CHART (the comeback hook)",
        "→  Milestone badges + monthly check-in email",
        "→  Dashboard export (PDF) — share / coaching",
        "→  Analytics + A/B testing (PostHog)",
        "→  More tools (debt payoff, raise impact)",
      ] },
    { x: 6.62, accent: SLATE, label: "LATER", header: "Coaching + Scale", sub: "Phase 2–3 · 2026",
      items: [
        "○  Coach portal — view client dashboards",
        "○  Comment on / co-fill a client's checkup",
        "○  Client ↔ coach messaging",
        "○  CSV import → auto-extract expenses",
        "○  Plaid bank / account linking",
        "○  Coach licensing (CFPs & RIAs) + white-label",
        "○  Mobile app + milestone social sharing",
        "○  Full statement upload & parsing (if needed)",
      ] },
  ];

  for (const c of cols) {
    s.addShape(pres.shapes.RECTANGLE, { x: c.x, y: CY, w: CW, h: CH,
      fill: { color: CARD }, line: { color: c.accent, width: 1, transparency: 50 } });
    s.addShape(pres.shapes.RECTANGLE, { x: c.x, y: CY, w: CW, h: 0.1,
      fill: { color: c.accent }, line: { color: c.accent, width: 0 } });
    s.addText(c.label, {
      x: c.x + 0.18, y: CY + 0.17, w: CW - 0.36, h: 0.24, fontSize: 7.5, bold: true,
      charSpacing: 2, color: c.accent, fontFace: "Calibri", margin: 0 });
    s.addText(c.header, {
      x: c.x + 0.18, y: CY + 0.44, w: CW - 0.36, h: 0.52, fontSize: 26, bold: true,
      color: WHITE, fontFace: "Calibri", margin: 0 });
    s.addText(c.sub, {
      x: c.x + 0.18, y: CY + 0.98, w: CW - 0.36, h: 0.28, fontSize: 9, color: "94A3B8",
      fontFace: "Calibri", margin: 0 });
    const itemArr = c.items.map((txt, idx) => ({
      text: txt, options: { breakLine: idx < c.items.length - 1 } }));
    s.addText(itemArr, {
      x: c.x + 0.16, y: CY + 1.33, w: CW - 0.3, h: CH - 1.47, fontSize: 8.5,
      color: "CBD5E1", fontFace: "Calibri", margin: 0, valign: "top", paraSpaceAfter: 3 });
  }

  s.addText("Roadmap is directional. Sequence may shift based on user feedback.", {
    x: 0.5, y: 5.3, w: 9, h: 0.22, fontSize: 7.5, color: "4B5563", align: "center",
    fontFace: "Calibri", margin: 0 });
}

// ─── SLIDE 3 — THE BIG BETS (rationale) ────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: NAVY };

  s.addText("The Big Bets — and why, in this order", {
    x: 0.45, y: 0.2, w: 9.1, h: 0.58, fontSize: 24, bold: true, color: WHITE,
    fontFace: "Calibri", margin: 0 });

  const BW = 4.42, BH = 1.86, GX = 0.38, GX2 = 5.1, RY = 0.92, RY2 = 2.92;
  const bets = [
    { x: GX,  y: RY,  accent: EMERALD, n: "1", title: "The Retention Engine",
      body: "account → periodic update → net-worth trend → badge → email nudge → return. A checkup is low-frequency; progress-over-time is what brings people back. Build this first." },
    { x: GX2, y: RY,  accent: BLUE, n: "2", title: "The Coaching Platform",
      body: "Stacked in layers: view client dashboard → comment async → co-fill together → message. The revenue engine. Start with view + comments; messaging comes last." },
    { x: GX,  y: RY2, accent: "A78BFA", n: "3", title: "Frictionless Data Entry",
      body: "Manual entry is the #1 drop-off. Ladder: CSV import → Plaid bank linking → full statement parsing only if Plaid can't cover it. Plaid may make parsing unnecessary." },
    { x: GX2, y: RY2, accent: "F59E0B", n: "4", title: "Learn & Iterate",
      body: "Analytics + A/B testing (PostHog) from day one of Phase 1, so real usage — not guesses — decides which tools and features get built next." },
  ];

  for (const b of bets) {
    s.addShape(pres.shapes.RECTANGLE, { x: b.x, y: b.y, w: BW, h: BH,
      fill: { color: CARD }, line: { color: b.accent, width: 1, transparency: 45 } });
    s.addShape(pres.shapes.RECTANGLE, { x: b.x, y: b.y, w: 0.1, h: BH,
      fill: { color: b.accent }, line: { color: b.accent, width: 0 } });
    s.addText(`${b.n}.  ${b.title}`, {
      x: b.x + 0.28, y: b.y + 0.16, w: BW - 0.5, h: 0.4, fontSize: 15, bold: true,
      color: b.accent, fontFace: "Calibri", margin: 0 });
    s.addText(b.body, {
      x: b.x + 0.28, y: b.y + 0.62, w: BW - 0.5, h: BH - 0.78, fontSize: 10,
      color: "CBD5E1", fontFace: "Calibri", margin: 0, valign: "top" });
  }

  s.addText("Dependency reality: auth + cloud storage unlock everything else — so they come first.", {
    x: 0.45, y: 4.92, w: 9.1, h: 0.3, fontSize: 9, italic: true, color: EMERALD,
    align: "center", fontFace: "Calibri", margin: 0 });
}

pres.writeFile({ fileName: OUTPUT })
  .then(() => console.log("✓ Freedomly_Roadmap.pptx"))
  .catch(err => { console.error(err); process.exit(1); });
