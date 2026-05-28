/**
 * Freedomly — deck.js
 * Generates Freedomly_Deck.pptx (5-slide sales/overview deck)
 *
 * Run:  node scripts/docs/deck.js
 * Or:   npm run update-docs
 *
 * Keep this file in sync with the app:
 *   - Features list (slide 3)  → app/tools/page.tsx, content/learn.ts
 *   - Value blocks (slide 4)   → dashboard sections
 *   - Differentiators (slide 5) → coaching page, any new Phase features
 */

const pptxgen = require("pptxgenjs");
const path = require("path");
const OUTPUT = path.join(__dirname, "../../Freedomly_Deck.pptx");

// ─── Palette ───────────────────────────────────────────────────
const NAVY    = "0c1836";
const WHITE   = "FFFFFF";
const EMERALD = "10b981";
const SLATE   = "94a3b8";
const CARD    = "162040";

let pres = new pptxgen();
pres.layout  = "LAYOUT_16x9";
pres.author  = "Freedomly";
pres.title   = "Freedomly — Map Your Path to Financial Freedom";

// ─── SLIDE 1 — TITLE ───────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: NAVY };

  s.addShape(pres.shapes.OVAL, { x: 7.5, y: -1.5, w: 5, h: 5,
    fill: { color: EMERALD, transparency: 88 }, line: { color: EMERALD, transparency: 88 } });
  s.addShape(pres.shapes.OVAL, { x: -1.5, y: 3.5, w: 4, h: 4,
    fill: { color: "1e3a8a", transparency: 60 }, line: { color: "1e3a8a", transparency: 60 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 0.7, y: 1.95, w: 0.5, h: 0.08,
    fill: { color: EMERALD }, line: { color: EMERALD } });

  s.addText("FINANCIAL FREEDOM PLATFORM", {
    x: 1.3, y: 1.7, w: 7, h: 0.4, fontSize: 9, fontFace: "Calibri",
    bold: true, color: EMERALD, charSpacing: 4, align: "left", margin: 0 });
  s.addText("Freedomly", {
    x: 0.7, y: 2.1, w: 8.6, h: 1.3, fontSize: 72, fontFace: "Calibri",
    bold: true, color: WHITE, align: "left", margin: 0 });
  s.addText("Map Your Path to Financial Freedom", {
    x: 0.7, y: 3.5, w: 8, h: 0.6, fontSize: 22, fontFace: "Calibri",
    color: "a5b4fc", align: "left", margin: 0 });
  s.addText("Know your number.  Build your plan.  Reach freedom.", {
    x: 0.7, y: 4.2, w: 8, h: 0.5, fontSize: 13, fontFace: "Calibri",
    color: SLATE, align: "left", italic: true, margin: 0 });
  s.addText("freedomly.app", {
    x: 7.5, y: 5.1, w: 2.2, h: 0.3, fontSize: 9, fontFace: "Calibri",
    color: "4b5563", align: "right", margin: 0 });
}

// ─── SLIDE 2 — THE PROBLEM ─────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: NAVY };

  s.addText("THE PROBLEM", { x: 0.6, y: 0.3, w: 8.8, h: 0.3, fontSize: 9,
    fontFace: "Calibri", bold: true, color: EMERALD, charSpacing: 4, align: "left", margin: 0 });
  s.addText("Most People Are Flying Blind", { x: 0.6, y: 0.65, w: 8.8, h: 0.75,
    fontSize: 36, fontFace: "Calibri", bold: true, color: WHITE, align: "left", margin: 0 });

  const stats = [
    { stat: "78%",  label: "of Americans live paycheck to paycheck\n— with no plan to change it" },
    { stat: "3–5%", label: "average US personal savings rate\n— a path to working until 70" },
    { stat: "$0",   label: "invested by the median American\nunder 35 in any retirement account" },
  ];
  stats.forEach((st, i) => {
    const x = 0.4 + i * 3.1;
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.6, w: 2.85, h: 2.7,
      fill: { color: CARD }, line: { color: "1e3a8a", width: 1 } });
    s.addShape(pres.shapes.RECTANGLE, { x, y: 1.6, w: 2.85, h: 0.08,
      fill: { color: EMERALD }, line: { color: EMERALD } });
    s.addText(st.stat, { x: x + 0.15, y: 1.7, w: 2.55, h: 1.0,
      fontSize: 48, fontFace: "Calibri", bold: true, color: EMERALD, align: "left", margin: 0 });
    s.addText(st.label, { x: x + 0.15, y: 2.75, w: 2.55, h: 1.35,
      fontSize: 11, fontFace: "Calibri", color: "cbd5e1", align: "left", margin: 0 });
  });

  s.addText("The problem isn't income. It's the absence of a clear picture — and a plan.", {
    x: 0.6, y: 4.65, w: 8.8, h: 0.6, fontSize: 13, fontFace: "Calibri",
    italic: true, color: SLATE, align: "center", margin: 0 });
}

// ─── SLIDE 3 — THE SOLUTION ────────────────────────────────────
// UPDATE THIS when new tools or modules are added
{
  const s = pres.addSlide();
  s.background = { color: NAVY };

  s.addText("THE SOLUTION", { x: 0.6, y: 0.3, w: 8.8, h: 0.3, fontSize: 9,
    fontFace: "Calibri", bold: true, color: EMERALD, charSpacing: 4, align: "left", margin: 0 });
  s.addText("Your Complete Financial Picture in 5 Minutes", { x: 0.6, y: 0.65, w: 8.8, h: 0.75,
    fontSize: 32, fontFace: "Calibri", bold: true, color: WHITE, align: "left", margin: 0 });
  s.addText(
    "Freedomly walks you through a simple financial checkup and generates a personalized dashboard with everything you need to take action.",
    { x: 0.6, y: 1.55, w: 4.2, h: 1.4, fontSize: 13, fontFace: "Calibri",
      color: "cbd5e1", align: "left", margin: 0 });
  s.addText("5-step checkup  →  instant dashboard", {
    x: 0.6, y: 3.1, w: 4.2, h: 0.4, fontSize: 11, fontFace: "Calibri",
    italic: true, color: EMERALD, align: "left", margin: 0 });

  // ✏️ Update this list when tools or modules change
  const features = [
    "Financial Health Score",
    "Freedom Age Projection",
    "Net Worth Benchmarks",
    "Personalized Action Plan",
    "3 Financial Tools",
    "11 Learning Modules",
  ];
  features.forEach((feat, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 5.2 + col * 2.4, y = 1.5 + row * 1.15;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 2.2, h: 0.75,
      fill: { color: CARD }, line: { color: EMERALD, width: 1 } });
    s.addShape(pres.shapes.OVAL, { x: x + 0.18, y: y + 0.26, w: 0.22, h: 0.22,
      fill: { color: EMERALD }, line: { color: EMERALD } });
    s.addText(feat, { x: x + 0.48, y: y + 0.15, w: 1.65, h: 0.45,
      fontSize: 11, fontFace: "Calibri", bold: true, color: WHITE, align: "left", margin: 0 });
  });
}

// ─── SLIDE 4 — THE VALUE ───────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: NAVY };

  s.addText("THE VALUE", { x: 0.6, y: 0.3, w: 8.8, h: 0.3, fontSize: 9,
    fontFace: "Calibri", bold: true, color: EMERALD, charSpacing: 4, align: "left", margin: 0 });
  s.addText("What You Walk Away With", { x: 0.6, y: 0.65, w: 8.8, h: 0.75,
    fontSize: 36, fontFace: "Calibri", bold: true, color: WHITE, align: "left", margin: 0 });

  const blocks = [
    { title: "Your Number",
      body: "Know your FI number, your health score, and exactly how many years away financial freedom is." },
    { title: "Your Benchmarks",
      body: "See how you compare to Federal Reserve medians, Fidelity retirement milestones, and savings rate targets." },
    { title: "Your Next Move",
      body: "A prioritized top-3 action plan based on your actual data — not generic advice." },
    { title: "Your Education",
      body: "11 in-depth learning modules covering savings, debt, investing, FIRE, and the stock market." },
  ];
  blocks.forEach((b, i) => {
    const x = 0.5 + (i % 2) * 4.75, y = 1.6 + Math.floor(i / 2) * 1.65;
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 4.4, h: 1.45,
      fill: { color: CARD }, line: { color: "1e3a8a", width: 1 } });
    s.addShape(pres.shapes.RECTANGLE, { x, y, w: 0.07, h: 1.45,
      fill: { color: EMERALD }, line: { color: EMERALD } });
    s.addText(b.title, { x: x + 0.2, y: y + 0.1, w: 4.1, h: 0.38,
      fontSize: 14, fontFace: "Calibri", bold: true, color: EMERALD, align: "left", margin: 0 });
    s.addText(b.body, { x: x + 0.2, y: y + 0.52, w: 4.1, h: 0.85,
      fontSize: 11, fontFace: "Calibri", color: "cbd5e1", align: "left", margin: 0 });
  });
}

// ─── SLIDE 5 — BUILT DIFFERENT ─────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: NAVY };

  s.addText("DIFFERENTIATION", { x: 0.6, y: 0.3, w: 8.8, h: 0.3, fontSize: 9,
    fontFace: "Calibri", bold: true, color: EMERALD, charSpacing: 4, align: "left", margin: 0 });
  s.addText("Built Different", { x: 0.6, y: 0.65, w: 8.8, h: 0.75,
    fontSize: 36, fontFace: "Calibri", bold: true, color: WHITE, align: "left", margin: 0 });

  const rows = [
    { headline: "Not a budgeting app.",
      body: "Freedomly is a freedom planning platform. We don't track every latte — we show you the path to financial independence." },
    { headline: "Coaching-ready.",
      body: "Built for financial coaches to use with clients. Invite clients, review their numbers together, track progress over time." },
    { headline: "Education-first.",
      body: "Every metric is explained. Every benchmark is sourced. Users don't just see a number — they understand what drives it and how to improve it." },
  ];
  rows.forEach((r, i) => {
    const y = 1.6 + i * 1.08;
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y, w: 8.8, h: 0.9,
      fill: { color: CARD }, line: { color: "1e3a8a", width: 1 } });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y, w: 0.07, h: 0.9,
      fill: { color: EMERALD }, line: { color: EMERALD } });
    s.addText(r.headline, { x: 0.85, y: y + 0.1, w: 2.3, h: 0.35,
      fontSize: 13, fontFace: "Calibri", bold: true, color: WHITE, align: "left", margin: 0 });
    s.addText(r.body, { x: 0.85, y: y + 0.45, w: 8.35, h: 0.38,
      fontSize: 11, fontFace: "Calibri", color: "cbd5e1", align: "left", margin: 0 });
  });

  s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 4.7, w: 8.8, h: 0.65,
    fill: { color: "052e16" }, line: { color: EMERALD, width: 1 } });
  s.addText(
    "Financial freedom shouldn't require a financial advisor. Freedomly makes the math, the benchmarks, and the plan accessible to everyone.",
    { x: 0.8, y: 4.73, w: 8.4, h: 0.55, fontSize: 11, fontFace: "Calibri",
      italic: true, color: EMERALD, align: "center", margin: 0 });
}

pres.writeFile({ fileName: OUTPUT })
  .then(() => console.log("✓ Freedomly_Deck.pptx"))
  .catch(err => { console.error(err); process.exit(1); });
