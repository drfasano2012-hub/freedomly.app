import Link from "next/link";
import Image from "next/image";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";
import { HomeSimulator } from "@/components/HomeSimulator";
import { HomeRedirect } from "@/components/HomeRedirect";

/* ───────────── phone frame screenshot wrapper ──────────────────────────── */

function PhoneFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="w-56 sm:w-64 mx-auto shrink-0">
      <div className="rounded-[2rem] overflow-hidden border-[7px] border-slate-800 shadow-[0_40px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/10">
        <Image
          src={src}
          alt={alt}
          width={390}
          height={844}
          className="w-full h-auto block"
          priority
        />
      </div>
    </div>
  );
}

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
      <HomeRedirect />
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
            <p className="mt-5 text-xs text-white/60 max-w-md">
              No account or bank linking required &middot; Benchmarked against Federal
              Reserve &amp; Fidelity data &middot; Free to start
            </p>
          </div>

          {/* Right: interactive simulator */}
          <HomeSimulator />
        </div>
      </main>

      {/* ───────────── 2. THREE QUESTIONS — Q1: WHERE AM I? ───────────── */}
      <section className="px-6 pt-14 sm:pt-20 pb-2 border-t border-white/10">
        <SectionHeading
          kicker="The Freedomly difference"
          title="Three questions. One clear answer."
          subtitle="Where am I? Where am I going? What's my next move? Most tools answer the first. Freedomly answers all three."
        />
      </section>
      <section className="px-6 py-14 sm:py-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <SectionHeading
            center={false}
            kicker="01 — Where am I?"
            title="Where you stand — in one glance"
            subtitle="Your real position, benchmarked against people your age and income. No spreadsheets, no manual math."
          />
          <PhoneFrame src="/screenshots/home-mobile.png" alt="Freedomly home screen showing health score and freedom age" />
        </div>
      </section>

      {/* ───────────── 3. Q2: WHERE AM I GOING? ───────────── */}
      <section className="px-6 py-14 sm:py-20 bg-white/[0.03]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* visual first on lg */}
          <div className="order-2 lg:order-1 flex items-center justify-center">
            <PhoneFrame src="/screenshots/freedom-age-mobile.png" alt="Freedomly freedom age projection" />
          </div>
          <SectionHeading
            center={false}
            kicker="02 — Where am I going?"
            title={<>See the year you could be <span className="text-emerald-400">free</span></>}
            subtitle="Your freedom age, projected from your real numbers — then test 'what if I saved $300 more?' and watch the date move."
          />
        </div>
      </section>

      {/* ───────────── 4. Q3: WHAT'S MY NEXT MOVE? ───────────── */}
      <section className="px-6 py-14 sm:py-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <SectionHeading
            center={false}
            kicker="03 — What's my next move?"
            title="Your highest-impact move, ranked"
            subtitle="Not generic advice — a prioritized plan built from your numbers, with the effect of each move on your freedom date."
          />
          <PhoneFrame src="/screenshots/actions-mobile.png" alt="Freedomly action plan — your top financial moves" />
        </div>
      </section>

      {/* ───────────── 5. THE RETURN VISIT ───────────── */}
      <section className="px-6 py-14 sm:py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* visual first on lg */}
          <div className="order-2 lg:order-1 flex items-center justify-center">
            <PhoneFrame src="/screenshots/home-scroll-mobile.png" alt="Freedomly home — net worth trend and progress over time" />
          </div>

          <SectionHeading
            center={false}
            kicker="It grows with you"
            title={<>Come back and watch the date <span className="text-emerald-400">move</span></>}
            subtitle="A checkup tells you where you are. The compounding happens when you return: update your numbers, see your score climb and your freedom date pull closer, check off a move, and get the next one. Freedomly remembers your progress — and celebrates the milestones with you."
          />
        </div>
      </section>

      {/* ───────────── 6. HOW IT WORKS ───────────── */}
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
        <p className="text-xs text-white/55">
          Freedomly is a financial clarity tool, not financial advice. &copy; 2026 Freedomly
        </p>
      </footer>

      {/* Mobile-only sticky CTA */}
      <MobileStickyCTA />
    </div>
  );
}
