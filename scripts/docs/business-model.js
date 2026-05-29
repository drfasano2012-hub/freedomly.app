/**
 * Freedomly — business-model.js
 * Generates Freedomly_Business_Model.pptx (5-slide phased revenue model)
 *
 * Run:  node scripts/docs/business-model.js
 * Or:   npm run update-docs
 *
 * Keep this file in sync with pricing & strategy:
 *   - Revenue streams (slide 2)  → consumer / coach / B2B phases
 *   - Free vs Pro (slide 3)      → app feature gating
 *   - Coach math (slide 4)       → coach pricing assumptions
 *   - Journey (slide 5)          → MRR targets / milestones
 */

const pptxgen = require("pptxgenjs");
const path = require("path");
const OUTPUT = path.join(__dirname, "../../Freedomly_Business_Model.pptx");

// ─── Palette ───────────────────────────────────────────────────
const NAVY    = "0C1836";
const LIGHT   = "F8FAFC";
const WHITE   = "FFFFFF";
const EMERALD = "10B981";
const BLUE    = "3B82F6";
const SLATE   = "64748B";

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Freedomly";
pres.title  = "How Freedomly Makes Money";

// ─── SLIDE 1 — TITLE (dark) ────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: NAVY };

  s.addShape(pres.shapes.OVAL, { x: 7.5, y: -1.5, w: 4.5, h: 4.5,
    fill: { color: EMERALD, transparency: 88 }, line: { color: EMERALD, transparency: 88 } });
  s.addShape(pres.shapes.OVAL, { x: -1.5, y: 3.5, w: 4.2, h: 4.2,
    fill: { color: "1E3A8A", transparency: 75 }, line: { color: "1E3A8A", transparency: 75 } });

  s.addText("BUSINESS MODEL", {
    x: 0.65, y: 1.5, w: 4.5, h: 0.35, fontSize: 9, bold: true, charSpacing: 5,
    color: EMERALD, fontFace: "Calibri", margin: 0 });
  s.addText("How Freedomly Makes Money", {
    x: 0.65, y: 1.88, w: 8.5, h: 1.0, fontSize: 38, bold: true, color: WHITE,
    fontFace: "Calibri", margin: 0 });
  s.addText("A phased revenue model built on user value", {
    x: 0.65, y: 2.96, w: 7.5, h: 0.5, fontSize: 17, color: "A5B4FC",
    fontFace: "Calibri", margin: 0 });
  s.addText("freedomly.app", {
    x: 7.8, y: 5.18, w: 1.8, h: 0.28, fontSize: 9, color: "4B5563",
    align: "right", fontFace: "Calibri", margin: 0 });
}

// ─── SLIDE 2 — THREE REVENUE STREAMS (light) ───────────────────
{
  const s = pres.addSlide();
  s.background = { color: LIGHT };

  s.addText("Three Revenue Streams, Three Phases", {
    x: 0.5, y: 0.26, w: 9, h: 0.56, fontSize: 26, bold: true, color: "0F172A",
    fontFace: "Calibri", margin: 0 });

  const SW = 2.9, SH = 3.95, SY = 1.02;
  const streams = [
    { x: 0.42, num: "01", numColor: EMERALD, phase: "Phase 1 · Now", label: "Consumer SaaS",
      desc: "Free tier drives adoption. Premium unlocks progress tracking, coaching features, and badge milestones.",
      rev: "~$9–19 / mo per paid user" },
    { x: 3.55, num: "02", numColor: BLUE, phase: "Phase 2 · Next 12 months", label: "Coach Licensing",
      desc: "Financial coaches, CFPs, and RIAs pay for a portal with client dashboards, progress tracking, and invite management.",
      rev: "~$49–99 / mo per coach seat" },
    { x: 6.68, num: "03", numColor: SLATE, phase: "Phase 3 · 2026", label: "B2B & White-Label",
      desc: "Employers and advisory firms license Freedomly as a financial wellness benefit or white-labeled client platform.",
      rev: "$500–5,000 / mo per org" },
  ];

  for (const st of streams) {
    s.addShape(pres.shapes.RECTANGLE, { x: st.x, y: SY, w: SW, h: SH,
      fill: { color: WHITE }, line: { color: "E2E8F0", width: 1 },
      shadow: { type: "outer", blur: 8, offset: 2, angle: 135, color: "000000", opacity: 0.06 } });
    s.addShape(pres.shapes.RECTANGLE, { x: st.x, y: SY, w: SW, h: 0.09,
      fill: { color: st.numColor }, line: { color: st.numColor, width: 0 } });
    s.addText(st.num, {
      x: st.x + 0.22, y: SY + 0.2, w: SW - 0.44, h: 0.62, fontSize: 34, bold: true,
      color: st.numColor, fontFace: "Calibri", margin: 0 });
    s.addText(st.phase, {
      x: st.x + 0.22, y: SY + 0.86, w: SW - 0.44, h: 0.28, fontSize: 8.5, color: "94A3B8",
      fontFace: "Calibri", margin: 0 });
    s.addText(st.label, {
      x: st.x + 0.22, y: SY + 1.16, w: SW - 0.44, h: 0.46, fontSize: 16, bold: true,
      color: "0F172A", fontFace: "Calibri", margin: 0 });
    s.addText(st.desc, {
      x: st.x + 0.22, y: SY + 1.68, w: SW - 0.44, h: 1.5, fontSize: 10.5, color: "475569",
      fontFace: "Calibri", margin: 0, valign: "top" });
    s.addText(st.rev, {
      x: st.x + 0.22, y: SY + 3.27, w: SW - 0.44, h: 0.36, fontSize: 11, bold: true,
      color: st.numColor, fontFace: "Calibri", margin: 0 });
  }
}

// ─── SLIDE 3 — FREE vs PAID (light) ────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: LIGHT };

  s.addText("Consumer Tier: Free to Start, Premium to Grow", {
    x: 0.5, y: 0.26, w: 9, h: 0.56, fontSize: 24, bold: true, color: "0F172A",
    fontFace: "Calibri", margin: 0 });

  const COLH = 4.12, COL_W = 4.16, CYY = 0.98;

  // Free card
  s.addShape(pres.shapes.RECTANGLE, { x: 0.42, y: CYY, w: COL_W, h: COLH,
    fill: { color: WHITE }, line: { color: "E2E8F0", width: 1 },
    shadow: { type: "outer", blur: 8, offset: 2, angle: 135, color: "000000", opacity: 0.06 } });
  s.addText("Free Forever", {
    x: 0.62, y: CYY + 0.2, w: COL_W - 0.4, h: 0.44, fontSize: 20, bold: true,
    color: "0F172A", fontFace: "Calibri", margin: 0 });
  s.addText("$0", {
    x: 0.62, y: CYY + 0.67, w: COL_W - 0.4, h: 0.5, fontSize: 30, bold: true,
    color: "64748B", fontFace: "Calibri", margin: 0 });
  s.addText([
    { text: "•  Full financial checkup", options: { breakLine: true } },
    { text: "•  Dashboard with all 10 sections", options: { breakLine: true } },
    { text: "•  All 4 financial tools", options: { breakLine: true } },
    { text: "•  11 learning modules", options: { breakLine: true } },
    { text: "•  Local data (no account required)", options: { breakLine: true } },
    { text: "•  One-time snapshot" },
  ], { x: 0.62, y: CYY + 1.26, w: COL_W - 0.4, h: COLH - 1.42, fontSize: 12,
    color: "475569", fontFace: "Calibri", margin: 0, valign: "top", paraSpaceAfter: 7 });

  // Pro card
  s.addShape(pres.shapes.RECTANGLE, { x: 5.42, y: CYY, w: COL_W, h: COLH,
    fill: { color: "ECFDF5" }, line: { color: EMERALD, width: 2 },
    shadow: { type: "outer", blur: 10, offset: 3, angle: 135, color: "000000", opacity: 0.08 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 5.42, y: CYY, w: COL_W, h: 0.09,
    fill: { color: EMERALD }, line: { color: EMERALD, width: 0 } });
  s.addText("Freedomly Pro", {
    x: 5.62, y: CYY + 0.2, w: COL_W - 0.4, h: 0.44, fontSize: 20, bold: true,
    color: "065F46", fontFace: "Calibri", margin: 0 });
  s.addText("$9–19 / mo", {
    x: 5.62, y: CYY + 0.67, w: COL_W - 0.4, h: 0.5, fontSize: 30, bold: true,
    color: EMERALD, fontFace: "Calibri", margin: 0 });
  s.addText([
    { text: "✓  Everything in Free", options: { breakLine: true } },
    { text: "✓  User account + cloud sync", options: { breakLine: true } },
    { text: "✓  Net worth chart (progress over time)", options: { breakLine: true } },
    { text: "✓  20 milestone badges", options: { breakLine: true } },
    { text: "✓  Learning progress tracking", options: { breakLine: true } },
    { text: "✓  Coach connection (if invited)", options: { breakLine: true } },
    { text: "✓  Monthly check-in reminders", options: { breakLine: true } },
    { text: "✓  Scenario modeling (spending adjuster)" },
  ], { x: 5.62, y: CYY + 1.26, w: COL_W - 0.4, h: COLH - 1.42, fontSize: 12,
    color: "065F46", fontFace: "Calibri", margin: 0, valign: "top", paraSpaceAfter: 5 });

  s.addText("Free tier is permanent — it’s how we build trust. Paid is for people committed to the journey.", {
    x: 0.5, y: 5.2, w: 9, h: 0.28, fontSize: 9, color: "94A3B8", align: "center",
    italic: true, fontFace: "Calibri", margin: 0 });
}

// ─── SLIDE 4 — COACH REVENUE ENGINE (light) ────────────────────
{
  const s = pres.addSlide();
  s.background = { color: LIGHT };

  s.addText("The Coaching Revenue Engine", {
    x: 0.5, y: 0.26, w: 9, h: 0.56, fontSize: 26, bold: true, color: "0F172A",
    fontFace: "Calibri", margin: 0 });
  s.addText("Coaches are the multiplier.", {
    x: 0.5, y: 1.04, w: 5.6, h: 0.5, fontSize: 20, bold: true, color: "0F172A",
    fontFace: "Calibri", margin: 0 });
  s.addText("A single coach license at $79/mo brings 5–20 clients onto the platform. Each client is a potential Pro subscriber. The coach gets a professional tool suite. Clients get accountability. Freedomly earns on both sides.", {
    x: 0.5, y: 1.62, w: 5.6, h: 1.7, fontSize: 13, color: "475569",
    fontFace: "Calibri", margin: 0, valign: "top" });
  s.addText("Target: CFPs, fee-only financial coaches, FIRE community coaches, and financial therapists.", {
    x: 0.5, y: 4.88, w: 5.6, h: 0.5, fontSize: 9.5, color: "94A3B8",
    fontFace: "Calibri", margin: 0, italic: true });

  // Dark math card
  s.addShape(pres.shapes.RECTANGLE, { x: 6.44, y: 0.96, w: 3.18, h: 4.28,
    fill: { color: NAVY }, line: { color: "1E3A8A", width: 1 } });
  s.addShape(pres.shapes.RECTANGLE, { x: 6.44, y: 0.96, w: 3.18, h: 0.09,
    fill: { color: EMERALD }, line: { color: EMERALD, width: 0 } });

  const mathRows = [
    { label: "1 coach license", val: "$79/mo" },
    { label: "× 10 coaches", val: "$790/mo" },
    { label: "+ 50 client Pro upgrades", val: "$450/mo" },
  ];
  let mY = 1.16;
  for (const row of mathRows) {
    s.addText(row.label, {
      x: 6.62, y: mY, w: 1.9, h: 0.34, fontSize: 10.5, color: "94A3B8",
      fontFace: "Calibri", margin: 0 });
    s.addText(row.val, {
      x: 8.5, y: mY, w: 1.0, h: 0.34, fontSize: 10.5, bold: true, color: EMERALD,
      align: "right", fontFace: "Calibri", margin: 0 });
    mY += 0.38;
  }
  s.addShape(pres.shapes.LINE, { x: 6.62, y: mY + 0.05, w: 2.88, h: 0,
    line: { color: "1E3A8A", width: 1.5 } });
  s.addText("= $1,240/mo per 10 coaches", {
    x: 6.62, y: mY + 0.2, w: 2.88, h: 0.42, fontSize: 12, bold: true, color: WHITE,
    fontFace: "Calibri", margin: 0 });
  const extY = mY + 0.78;
  s.addShape(pres.shapes.RECTANGLE, { x: 6.62, y: extY, w: 2.88, h: 0.85,
    fill: { color: "0F2044" }, line: { color: EMERALD, width: 1 } });
  s.addText([
    { text: "100 coaches + 500 clients", options: { breakLine: true } },
    { text: "= $12,400–$18,000/mo" },
  ], { x: 6.72, y: extY + 0.1, w: 2.68, h: 0.65, fontSize: 10.5, bold: true,
    color: EMERALD, fontFace: "Calibri", margin: 0 });
}

// ─── SLIDE 5 — THE JOURNEY (dark) ──────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: NAVY };

  s.addShape(pres.shapes.OVAL, { x: 8.5, y: -1.2, w: 4.2, h: 4.2,
    fill: { color: EMERALD, transparency: 90 }, line: { color: EMERALD, transparency: 90 } });

  s.addText("The Path to Sustainable Revenue", {
    x: 0.5, y: 0.2, w: 9, h: 0.58, fontSize: 26, bold: true, color: WHITE,
    fontFace: "Calibri", margin: 0 });

  const PW = 2.14, PH = 3.5, PY5 = 0.98;
  const PX = [0.38, 2.74, 5.10, 7.46];
  const phases = [
    { time: "Month 0–6", label: "Traction", accent: EMERALD,
      items: ["Launch free tier", "1,000+ users", "Validate retention", "50 coaches onboarded"] },
    { time: "Month 6–12", label: "Monetize", accent: BLUE,
      items: ["Launch Pro tier", "5–10% free-to-paid", "Coach portal live", "$5K–15K MRR"] },
    { time: "Year 2", label: "Scale", accent: "A78BFA",
      items: ["100+ coaches", "B2B pilots", "White-label v1", "$50K+ MRR"] },
    { time: "Year 3+", label: "Platform", accent: "F59E0B",
      items: ["Employer partnerships", "API licensing", "Advisor marketplace", "$200K+ MRR"] },
  ];

  for (let i = 0; i < phases.length; i++) {
    const ph = phases[i];
    const px = PX[i];
    s.addShape(pres.shapes.RECTANGLE, { x: px, y: PY5, w: PW, h: PH,
      fill: { color: "0F2044" }, line: { color: ph.accent, width: 1, transparency: 40 } });
    s.addShape(pres.shapes.RECTANGLE, { x: px, y: PY5, w: PW, h: 0.1,
      fill: { color: ph.accent }, line: { color: ph.accent, width: 0 } });
    s.addText(ph.time, {
      x: px + 0.16, y: PY5 + 0.18, w: PW - 0.32, h: 0.28, fontSize: 8.5, color: "94A3B8",
      fontFace: "Calibri", margin: 0 });
    s.addText(ph.label, {
      x: px + 0.16, y: PY5 + 0.48, w: PW - 0.32, h: 0.52, fontSize: 22, bold: true,
      color: ph.accent, fontFace: "Calibri", margin: 0 });
    const itemArr = ph.items.map((txt, idx) => ({
      text: txt, options: { breakLine: idx < ph.items.length - 1 } }));
    s.addText(itemArr, {
      x: px + 0.16, y: PY5 + 1.1, w: PW - 0.3, h: PH - 1.25, fontSize: 11,
      color: "CBD5E1", fontFace: "Calibri", margin: 0, valign: "top", paraSpaceAfter: 8 });
    if (i < 3) {
      s.addShape(pres.shapes.LINE, { x: px + PW + 0.08, y: PY5 + PH / 2, w: 0.06, h: 0,
        line: { color: "334155", width: 2 } });
    }
  }

  s.addText("“We win when users reach financial freedom. That alignment is the moat.”", {
    x: 0.5, y: 4.88, w: 9, h: 0.45, fontSize: 12, italic: true, bold: true,
    color: EMERALD, align: "center", fontFace: "Calibri", margin: 0 });
}

pres.writeFile({ fileName: OUTPUT })
  .then(() => console.log("✓ Freedomly_Business_Model.pptx"))
  .catch(err => { console.error(err); process.exit(1); });
