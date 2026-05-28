import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      {/* Minimal header */}
      <header className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
            <TrendingUp size={15} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-base font-bold tracking-tight text-white">
            Freedomly
          </span>
        </div>
        <Link href="/checkup">
          <Button size="sm">Map your path &rarr;</Button>
        </Link>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20 pt-12 text-center">
        {/* Tagline pill */}
        <div className="inline-flex items-center gap-2 border border-emerald-400/30 bg-emerald-400/10 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-300 font-medium tracking-wide">
            Money is a tool. Freedom is the goal.
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1] max-w-3xl mb-6">
          Know exactly{" "}
          <span className="text-emerald-400">where you stand.</span>
          <br />
          Build your path to freedom.
        </h1>

        {/* Sub-headline */}
        <p className="text-base sm:text-lg text-white/60 max-w-xl mb-10 leading-relaxed">
          A 5-minute financial checkup that shows you your real position,
          benchmarks you against peers your age, and gives you a personalized
          action plan — free.
        </p>

        {/* CTA */}
        <Link href="/checkup">
          <Button size="lg" className="text-base font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-black/30">
            Map your path to freedom &rarr;
          </Button>
        </Link>

        <p className="mt-4 text-xs text-white/40">
          No account required &middot; All calculations run in your browser &middot; Your data stays on your device
        </p>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/15 max-w-2xl w-full">
          {[
            { stat: "5 min", label: "Average checkup time" },
            { stat: "100%", label: "Personalized to your numbers" },
            { stat: "$0", label: "No cost to get started" },
          ].map(({ stat, label }) => (
            <div key={label} className="bg-white/5 px-8 py-6 text-center">
              <div className="text-2xl font-bold text-emerald-400 mb-1">{stat}</div>
              <div className="text-xs text-white/50">{label}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Value props */}
      <section className="border-t border-white/10 bg-white/5 px-6 py-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: "🎯",
              title: "Your Financial Checkup",
              description:
                "Answer 5 straightforward questions about income, spending, savings, and debt. No bank linking. No account required.",
            },
            {
              icon: "📊",
              title: "Personalized Benchmarks",
              description:
                "See how your net worth, savings rate, and retirement savings compare to real Federal Reserve data for your age and income.",
            },
            {
              icon: "🗺️",
              title: "Your Action Plan",
              description:
                "Get your top 3 prioritized next steps — specific to your numbers, not generic advice. Know exactly what to do first.",
            },
          ].map(({ icon, title, description }) => (
            <div key={title} className="flex flex-col gap-3">
              <div className="text-2xl">{icon}</div>
              <h3 className="text-base font-semibold text-white">{title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-6 text-center">
        <p className="text-xs text-white/40">
          Freedomly is an educational tool, not financial advice.{" "}
          &copy; 2026 Freedomly
        </p>
      </footer>
    </div>
  );
}
