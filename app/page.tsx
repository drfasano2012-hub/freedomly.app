import Link from "next/link";
import {
  TrendingUp,
  ArrowRight,
  MapPin,
  Compass,
  Target,
  Check,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

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
      <header className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
            <TrendingUp size={15} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-base font-bold tracking-tight text-white">Freedomly</span>
        </div>
        <Link href="/checkup">
          <Button size="sm">See where you stand &rarr;</Button>
        </Link>
      </header>

      {/* ───────────── 1. HERO ───────────── */}
      <main className="px-6 pt-12 pb-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
            <Eyebrow>A financial direction system</Eyebrow>
            <h1 className="mt-7 text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.1] max-w-xl">
              Know where you stand, where you&rsquo;re headed, and{" "}
              <span className="text-emerald-400">what to do next.</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-white/60 max-w-xl leading-relaxed">
              In 5 minutes — no bank linking, no spreadsheets — see your real position,
              the year you could reach financial independence, and the single move that
              gets you there faster.
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
              <Link href="/checkup">
                <Button
                  variant="secondary"
                  size="lg"
                  className="text-base font-medium px-6 py-4 rounded-2xl"
                >
                  Try it with sample numbers
                </Button>
              </Link>
            </div>
            <p className="mt-5 text-xs text-white/40 max-w-md">
              No account or bank linking required &middot; Benchmarked against Federal
              Reserve &amp; Fidelity data &middot; Free to start
            </p>
          </div>

          {/* Right: product preview */}
          <div className="relative">
            <div
              className="absolute -inset-6 rounded-[2rem] bg-emerald-500/10 blur-3xl"
              aria-hidden
            />
            <div className="relative bg-white/70 backdrop-blur-sm border border-white/60 shadow-2xl rounded-3xl p-6 flex flex-col gap-4">
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                Your freedom projection
              </p>
              <div>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold text-slate-900 leading-none">52</span>
                  <span className="text-sm text-slate-500 mb-1">years old</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">
                  The age your investments could cover your life — for good.
                </p>
              </div>
              {/* tiny trajectory */}
              <div className="h-20 rounded-xl bg-gradient-to-tr from-emerald-50 to-white border border-slate-200 relative overflow-hidden">
                <svg viewBox="0 0 300 80" className="w-full h-full" preserveAspectRatio="none">
                  <polyline
                    points="0,72 60,64 120,50 180,34 240,18 300,6"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                  />
                </svg>
              </div>
              {/* next move */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 leading-snug">
                    Redirect $400/mo to investing
                  </p>
                  <p className="text-xs text-emerald-700 font-medium">
                    Reach freedom 3 years sooner
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ───────────── 2. PROBLEM ───────────── */}
      <section className="px-6 py-20 border-t border-white/10">
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
      <section className="px-6 py-20 border-t border-white/10 bg-white/[0.03]">
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
      <section className="px-6 py-20 border-t border-white/10">
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
      <section className="px-6 py-20 border-t border-white/10 bg-white/[0.03]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <SectionHeading
            center={false}
            kicker="Where am I?"
            title="Where you stand — in one glance"
            subtitle="Your real position, benchmarked against people your age and income. No spreadsheets, no manual math."
          />
          <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-xl rounded-3xl p-6 flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center">
                <span className="text-xl font-bold text-slate-900">78</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Financial Health Score</p>
                <p className="text-xs text-slate-500">Strong — ahead of most for your age</p>
              </div>
            </div>
            {[
              { label: "Net worth vs. Fed Reserve median", pct: 72, val: "+38% ahead" },
              { label: "Savings rate", pct: 60, val: "18% / mo" },
              { label: "Retirement vs. Fidelity target", pct: 84, val: "On track" },
            ].map((b) => (
              <div key={b.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-600">{b.label}</span>
                  <span className="font-medium text-slate-800">{b.val}</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${b.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── 6. TRAJECTORY & FI ───────────── */}
      <section className="px-6 py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* visual first on lg */}
          <div className="order-2 lg:order-1 bg-white/70 backdrop-blur-sm border border-white/60 shadow-xl rounded-3xl p-6">
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                  Financially free at
                </p>
                <span className="text-4xl font-bold text-slate-900">52</span>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                3 yrs sooner with one change
              </span>
            </div>
            <div className="h-28 rounded-xl bg-gradient-to-tr from-emerald-50 to-white border border-slate-200 relative overflow-hidden">
              <svg viewBox="0 0 320 110" className="w-full h-full" preserveAspectRatio="none">
                <polyline points="0,100 80,86 160,62 240,34 320,8" fill="none" stroke="#10b981" strokeWidth="3" />
                <polyline points="0,100 80,90 160,74 240,52 320,28" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 5" />
              </svg>
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
            subtitle="Freedomly projects your freedom age from your real numbers — then lets you test 'what if I saved $300 more?' and watch the date move. That's not a bigger number. That's years of your life back."
          />
        </div>
      </section>

      {/* ───────────── 7. DECISION ENGINE ───────────── */}
      <section className="px-6 py-20 border-t border-white/10 bg-white/[0.03]">
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
      <section className="px-6 py-20 border-t border-white/10">
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

      {/* ───────────── 9. SOCIAL PROOF / TRUST ───────────── */}
      <section className="px-6 py-20 border-t border-white/10 bg-white/[0.03]">
        <SectionHeading
          kicker="Built on data you can trust"
          title="Your benchmarks come from sources you can verify"
          subtitle="No black box. Every benchmark is sourced, and your numbers never leave your device."
        />
        <div className="mt-10 max-w-3xl mx-auto flex flex-wrap justify-center gap-3">
          {[
            "Federal Reserve (SCF)",
            "Fidelity retirement guidelines",
            "Bureau of Economic Analysis",
          ].map((s) => (
            <span key={s} className="bg-white/5 border border-white/15 rounded-xl px-4 py-2 text-sm text-white/70">
              {s}
            </span>
          ))}
        </div>
        <div className="mt-8 max-w-3xl mx-auto grid sm:grid-cols-3 gap-4">
          {[
            "No bank linking required",
            "Your data stays on your device",
            "Transparent, explained math",
          ].map((t) => (
            <div key={t} className="flex items-center gap-2 justify-center text-sm text-white/60">
              <Check size={15} className="text-emerald-400 shrink-0" />
              {t}
            </div>
          ))}
        </div>
        {/* Real testimonials go here once collected — intentionally left out, not fabricated. */}
      </section>

      {/* ───────────── 10. FINAL CTA ───────────── */}
      <section className="px-6 py-24 border-t border-white/10 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight max-w-2xl mx-auto">
          Stop guessing. <span className="text-emerald-400">Start knowing.</span>
        </h2>
        <p className="mt-5 text-base text-white/55 max-w-xl mx-auto leading-relaxed">
          See where you stand, where you&rsquo;re headed, and your next move — in five
          minutes, free.
        </p>
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/checkup">
            <Button size="lg" className="text-base font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-black/30">
              See where you stand &rarr;
            </Button>
          </Link>
          <Link href="/checkup">
            <Button variant="secondary" size="lg" className="text-base font-medium px-6 py-4 rounded-2xl">
              Try sample numbers
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-6 text-center">
        <p className="text-xs text-white/40">
          Freedomly is a financial direction tool, not financial advice. &copy; 2026 Freedomly
        </p>
      </footer>
    </div>
  );
}
