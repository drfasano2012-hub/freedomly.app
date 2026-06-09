import Link from "next/link";
import { TrendingUp, MapPin, Compass, Target, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";
import { HomeSimulator } from "@/components/HomeSimulator";

/* ───────────────────────── small building blocks ───────────────────────── */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 border border-emerald-400/30 bg-emerald-400/10 rounded-full px-4 py-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      <span className="text-xs text-emerald-300 font-medium tracking-wide">
        {children}
      </span>
    </div>
  );
}

function SectionHeading({
  kicker,
  title,
  subtitle,
  center = true,
}: {
  kicker?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div className={center ? "text-center max-w-2xl mx-auto" : "max-w-2xl"}>
      {kicker && (
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">
          {kicker}
        </p>
      )}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base text-white/55 leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}

/* ───────────────────────────── the page ────────────────────────────────── */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 flex items-center max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
            <TrendingUp size={15} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-base font-bold tracking-tight text-white">Freedomly</span>
          <span className="text-xs text-emerald-400 font-medium border border-emerald-400/30 rounded px-1.5 py-0.5 bg-emerald-400/10">
            beta
          </span>
        </div>
      </header>

      {/* ───────────── 1. HERO ───────────── */}
      <main className="px-6 pt-8 sm:pt-12 pb-14 sm:pb-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
            <Eyebrow>Financial clarity &rarr; financial independence</Eyebrow>
            <h1 className="mt-7 text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.1] max-w-xl">
              Clarity on your money.{" "}
              <span className="text-emerald-400">Freedom in your life.</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-white/60 max-w-xl leading-relaxed">
              Freedomly turns your finances into a clear path to financial independence —
              and the freedom to choose how you work, live, and spend your time. See where
              you stand in 5 minutes, free.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-center gap-3">
              <Link href="/checkup">
                <Button
                  size="lg"
                  className="text-base font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-black/30"
                >
                  See where you stand &rarr;
                </Button>
              </Link>
            </div>
            <p className="mt-5 text-xs text-white/40 max-w-md">
              No account or bank linking required &middot; Benchmarked against Federal
              Reserve &amp; Fidelity data &middot; Free to start
            </p>
          </div>

          {/* Right: interactive simulator */}
          <HomeSimulator />
        </div>
      </main>

      {/* ───────────── 2. PROBLEM ───────────── */}
      <section className="px-6 py-14 sm:py-20 border-t border-white/10">
        <SectionHeading
          kicker="The problem"
          title={<>You&rsquo;re doing fine. But are you doing <span className="text-emerald-400">well?</span></>}
          subtitle="You earn well, you save, you invest — and you still can't shake the question. The anxiety isn't your spending. It's not knowing."
        />
        <div className="mt-10 max-w-3xl mx-auto flex flex-wrap justify-center gap-3">
          {[
            "Am I doing enough?",
            "Am I behind?",
            "When could I actually be free?",
            "What's the smartest next move?",
            "Am I wasting money somewhere?",
            "Could I work less someday?",
          ].map((q) => (
            <span
              key={q}
              className="bg-white/5 border border-white/15 rounded-full px-4 py-2 text-sm text-white/70"
            >
              &ldquo;{q}&rdquo;
            </span>
          ))}
        </div>
      </section>

      {/* ───────────── 3. WHY CURRENT TOOLS FAIL ───────────── */}
      <section className="px-6 py-14 sm:py-20 border-t border-white/10 bg-white/[0.03]">
        <SectionHeading
          kicker="Why current tools fail"
          title="More financial data won't fix this"
          subtitle="The tools you've tried answer the wrong question."
        />
        <div className="mt-12 max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              tool: "Budgeting apps",
              answers: "What you already spent",
              gap: "Backward-looking. The past, not the path.",
            },
            {
              tool: "Net-worth trackers",
              answers: "A number on a dashboard",
              gap: "A figure — not whether it's enough, or what to do.",
            },
            {
              tool: "Advisors & robo-advisors",
              answers: "Money you hand over",
              gap: "They manage assets. They don't make you fluent.",
            },
          ].map(({ tool, answers, gap }) => (
            <div
              key={tool}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-2"
            >
              <h3 className="text-base font-semibold text-white">{tool}</h3>
              <p className="text-xs uppercase tracking-wider text-white/40">Answers</p>
              <p className="text-sm text-white/70">{answers}</p>
              <p className="text-sm text-white/45 mt-2 leading-relaxed">{gap}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-white/50 max-w-xl mx-auto">
          The gap none of them close:{" "}
          <span className="text-white font-medium">
            where you&rsquo;re headed
          </span>{" "}
          and{" "}
          <span className="text-white font-medium">what to do next.</span>
        </p>
      </section>

      {/* ───────────── 4. THE FREEDOMLY DIFFERENCE ───────────── */}
      <section className="px-6 py-14 sm:py-20 border-t border-white/10">
        <SectionHeading
          kicker="The Freedomly difference"
          title="Three questions. One clear answer."
          subtitle="Freedomly is built around the questions that actually matter. Most tools answer the first. Freedomly answers all three."
        />
        <div className="mt-12 max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              icon: MapPin,
              n: "01",
              q: "Where am I?",
              d: "Your true financial position — health score, net worth, savings rate — benchmarked against people like you.",
            },
            {
              icon: Compass,
              n: "02",
              q: "Where am I going?",
              d: "Your trajectory to financial independence, projected from your real numbers. See the year you could be free.",
            },
            {
              icon: Target,
              n: "03",
              q: "What's my next move?",
              d: "The highest-impact action for your situation, ranked — with the effect of each on your freedom date.",
            },
          ].map(({ icon: Icon, n, q, d }) => (
            <div
              key={q}
              className="bg-white/[0.06] border border-white/12 rounded-2xl p-6 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center">
                  <Icon size={18} className="text-emerald-400" />
                </div>
                <span className="text-sm font-bold text-white/25">{n}</span>
              </div>
              <h3 className="text-lg font-semibold text-white">{q}</h3>
              <p className="text-sm text-white/55 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────── 5. SNAPSHOT EXAMPLE ───────────── */}
      <section className="px-6 py-14 sm:py-20 border-t border-white/10 bg-white/[0.03]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <SectionHeading
            center={false}
            kicker="Where am I?"
            title="Where you stand — in one glance"
            subtitle="Your real position, benchmarked against people your age and income. No spreadsheets, no manual math."
          />
          <div className="bg-white/80 backdrop-blur-sm border border-white/60 shadow-2xl rounded-3xl p-6 flex flex-col gap-5">
            {/* Health score donut + peer context */}
            <div className="flex items-center gap-5">
              <div className="relative w-24 h-24 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="9" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray="264"
                    strokeDashoffset="58"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-slate-900 leading-none">78</span>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider">/ 100</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                  Financial Health Score
                </p>
                <span className="inline-flex w-fit items-center text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">
                  Strong
                </span>
                <p className="text-xs text-slate-500">
                  Ahead of <span className="font-semibold text-slate-700">72%</span> of peers your age
                </p>
              </div>
            </div>

            {/* Net worth hero stat */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-end justify-between">
              <div>
                <p className="text-xs text-slate-500">Net worth today</p>
                <p className="text-2xl font-bold text-slate-900 leading-tight">$168,000</p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 mb-1">+38% vs. median</span>
            </div>

            {/* Benchmark bars */}
            <div className="flex flex-col gap-3">
              {[
                { label: "Net worth vs. Fed Reserve median", pct: 72, val: "+38% ahead" },
                { label: "Savings rate", pct: 60, val: "18% / mo" },
                { label: "Retirement vs. Fidelity target", pct: 84, val: "On track" },
              ].map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-600">{b.label}</span>
                    <span className="font-semibold text-slate-800">{b.val}</span>
                  </div>
                  <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                      style={{ width: `${b.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── 6. TRAJECTORY & FI ───────────── */}
      <section className="px-6 py-14 sm:py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* visual first on lg */}
          <div className="order-2 lg:order-1 bg-white/80 backdrop-blur-sm border border-white/60 shadow-2xl rounded-3xl p-6">
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                  Financially free at
                </p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-slate-900 leading-none">52</span>
                  <span className="text-xs text-slate-400 mb-1">years old</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                3 yrs sooner with one change
              </span>
            </div>

            {/* Engaging gradient area chart */}
            <div className="relative h-44 rounded-xl bg-gradient-to-b from-emerald-50/50 to-white border border-slate-200 overflow-hidden">
              <svg viewBox="0 0 400 160" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="fillG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.30" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* grid */}
                <line x1="0" y1="120" x2="400" y2="120" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="0" y1="80" x2="400" y2="80" stroke="#e2e8f0" strokeWidth="1" />
                <line x1="0" y1="40" x2="400" y2="40" stroke="#e2e8f0" strokeWidth="1" />
                {/* filled growth area */}
                <path d="M0,150 C130,142 240,96 400,16 L400,160 L0,160 Z" fill="url(#fillG)" />
                {/* faster path (one change) */}
                <path d="M0,150 C120,126 220,72 400,30" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 5" />
                {/* main growth line */}
                <path d="M0,150 C130,142 240,96 400,16" fill="none" stroke="#10b981" strokeWidth="3" />
              </svg>
              {/* overlays (HTML, so they don't distort) */}
              <span className="absolute left-3 bottom-2 text-[10px] font-medium text-slate-400">Today</span>
              <span className="absolute right-2 top-2 text-[10px] font-semibold text-emerald-700 bg-white/90 border border-emerald-200 rounded-full px-2 py-0.5 shadow-sm">
                Free at 52
              </span>
              <span className="absolute right-3 top-[14%] w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
              <Sparkles size={12} className="text-emerald-500" />
              Drag your savings up and watch the date move closer.
            </div>
          </div>
          <SectionHeading
            center={false}
            kicker="Where am I going?"
            title={<>See the year you could be <span className="text-emerald-400">free</span></>}
            subtitle="Freedomly projects your freedom age from your real numbers — then lets you test 'what if I saved $300 more?' and watch the date move. Freedom isn't a bigger number — it's options: work you choose, time with people who matter, room to take a risk."
          />
        </div>
      </section>

      {/* ───────────── 7. DECISION ENGINE ───────────── */}
      <section className="px-6 py-14 sm:py-20 border-t border-white/10 bg-white/[0.03]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <SectionHeading
            center={false}
            kicker="What's my next move?"
            title="Your highest-impact move, ranked"
            subtitle="Not generic advice — a prioritized plan built from your numbers. Freedomly weighs your situation and surfaces the moves that change your trajectory most."
          />
          <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-xl rounded-3xl p-6 flex flex-col gap-3">
            {[
              { n: 1, move: "Clear your 22% APR credit card", impact: "+$1,900/yr · freedom 14 mo sooner" },
              { n: 2, move: "Raise 401(k) to the full match", impact: "Free money — don't leave it" },
              { n: 3, move: "Move idle cash into investing", impact: "Freedom 8 mo sooner" },
            ].map(({ n, move, impact }) => (
              <div key={n} className="flex items-start gap-3 border-b border-slate-200 last:border-0 pb-3 last:pb-0">
                <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">{n}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 leading-snug">{move}</p>
                  <p className="text-xs text-emerald-700 font-medium mt-0.5">{impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── 8. HOW IT WORKS ───────────── */}
      <section className="px-6 py-14 sm:py-20 border-t border-white/10">
        <SectionHeading kicker="How it works" title="Five minutes to clarity" />
        <div className="mt-12 max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { n: "1", t: "Answer a few questions", d: "Income, savings, debt, goals. No bank linking, no account required." },
            { n: "2", t: "See where you stand & where you're headed", d: "Your position, your trajectory to financial independence, instantly." },
            { n: "3", t: "Get your next moves", d: "Your top 3 highest-impact actions — and track progress over time." },
          ].map(({ n, t, d }) => (
            <div key={n} className="flex flex-col gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                {n}
              </div>
              <h3 className="text-base font-semibold text-white">{t}</h3>
              <p className="text-sm text-white/55 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/checkup">
            <Button size="lg" className="text-base font-semibold px-8 py-4 rounded-2xl">
              Start your checkup &rarr;
            </Button>
          </Link>
        </div>
      </section>


      {/* Footer (extra bottom padding on mobile so the sticky CTA never covers it) */}
      <footer className="border-t border-white/10 px-6 pt-6 pb-28 sm:pb-6 text-center">
        <p className="text-xs text-white/40">
          Freedomly is a financial clarity tool, not financial advice. &copy; 2026 Freedomly
        </p>
      </footer>

      {/* Mobile-only sticky CTA */}
      <MobileStickyCTA />
    </div>
  );
}
