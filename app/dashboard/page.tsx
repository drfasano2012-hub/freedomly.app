"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useFinancialData } from "@/hooks/useFinancialData";
import { calcAllMetrics, calcPotentialScore } from "@/lib/calculations";
import { track } from "@/lib/analytics";
import { AppNav } from "@/components/AppNav";
import { HealthScoreCard } from "@/components/dashboard/HealthScoreCard";
import { FreedomAgeCard } from "@/components/dashboard/FreedomAgeCard";
import { SnapshotCards } from "@/components/dashboard/SnapshotCards";
import { BenchmarksSection } from "@/components/dashboard/BenchmarksSection";
import { DetailCards } from "@/components/dashboard/DetailCards";
import { ActionPlan } from "@/components/dashboard/ActionPlan";
import { PlanDiagnostics } from "@/components/dashboard/PlanDiagnostics";
import { ProgressSection } from "@/components/dashboard/ProgressSection";
import { SharpenPlan } from "@/components/dashboard/SharpenPlan";
import { MilestonesSection } from "@/components/dashboard/MilestonesSection";
import { QuickUpdateCard } from "@/components/dashboard/QuickUpdateCard";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold text-white/65 uppercase tracking-wider px-1">
      {children}
    </h2>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { inputs, setInputs, hasCompletedCheckup, hydrated, lastUpdated } = useFinancialData();

  useEffect(() => {
    if (hydrated && !hasCompletedCheckup) {
      router.replace("/checkup");
    }
  }, [hydrated, hasCompletedCheckup, router]);

  const metrics = useMemo(
    () => (inputs ? calcAllMetrics(inputs) : null),
    [inputs]
  );

  useEffect(() => {
    if (hydrated && hasCompletedCheckup) track("dashboard_viewed");
  }, [hydrated, hasCompletedCheckup]);

  if (!hydrated || !inputs || !metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const fa = metrics.freedomAge;
  const topAction = metrics.actionPlan.topActions[0];
  const headline =
    fa.status === "already_reached"
      ? "You've reached financial freedom — your investments cover your living expenses."
      : fa.status === "normal" && fa.freedomAge !== null
      ? `You're on track to be financially free at ${fa.freedomAge}.`
      : "Let's chart your path to financial independence.";

  return (
    <div className="min-h-screen bg-transparent page-in">
      <AppNav />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">

        {/* Personalized headline */}
        <div className="bg-white/[0.06] border border-white/12 rounded-2xl px-5 py-5 sm:px-6">
          <p className="text-lg sm:text-2xl font-bold text-white leading-snug">{headline}</p>
          {topAction && (
            <p className="text-sm text-white/70 mt-1.5">
              Your biggest lever right now:{" "}
              <span className="text-emerald-300 font-medium">{topAction.text}</span>
            </p>
          )}
        </div>

        {/* Where you stand */}
        <section className="flex flex-col gap-2">
          <SectionLabel>Where you stand</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <HealthScoreCard
                score={metrics.healthScore}
                breakdown={metrics.healthScoreBreakdown}
                potentialScore={calcPotentialScore(
                  metrics.healthScoreBreakdown,
                  metrics.actionPlan.topActions
                )}
              />
            </div>
            <div className="md:col-span-2">
              <SnapshotCards metrics={metrics} currentAge={inputs.currentAge} />
            </div>
          </div>
        </section>

        {/* Stale-data nudge — only shows when numbers are >7 days old */}
        <QuickUpdateCard inputs={inputs} setInputs={setInputs} lastUpdated={lastUpdated} />

        {/* Goals + risk deferred from the checkup — shows once, then gone */}
        <SharpenPlan inputs={inputs} setInputs={setInputs} />

        {/* Milestone map */}
        <MilestonesSection metrics={metrics} />

        {/* Where you're headed */}
        <section className="flex flex-col gap-2">
          <SectionLabel>Where you&rsquo;re headed</SectionLabel>
          <FreedomAgeCard
            result={metrics.freedomAge}
            currentAge={inputs.currentAge}
            monthlySurplus={metrics.monthlySurplus}
            monthlySpending={inputs.monthlySpending}
            monthlyTakeHome={inputs.monthlyTakeHome}
            totalInvestedPlusCash={metrics.totalInvestments + inputs.cashSavings}
          />
        </section>

        {/* Your next move */}
        <section className="flex flex-col gap-2">
          <SectionLabel>Your next move</SectionLabel>
          <ActionPlan
            actionPlan={metrics.actionPlan}
            goals={inputs.goals}
            employmentType={inputs.employmentType ?? "w2"}
            householdType={inputs.householdType ?? "solo"}
          />
        </section>

        {/* Your progress — compact pills at end */}
        <ProgressSection metrics={metrics} />

        {/* The details — collapsible */}
        <details className="group">
          <summary className="cursor-pointer list-none flex items-center gap-2 text-xs font-semibold text-white/65 hover:text-white/80 uppercase tracking-wider px-1 select-none">
            <span>The details</span>
            <ChevronDown size={14} className="transition-transform group-open:rotate-180" />
          </summary>
          <div className="mt-4 flex flex-col gap-4">
            <PlanDiagnostics actionPlan={metrics.actionPlan} />
            <DetailCards metrics={metrics} inputs={inputs} />
            <BenchmarksSection metrics={metrics} currentAge={inputs.currentAge} />
          </div>
        </details>

      </main>

      <footer className="border-t border-white/50 px-6 py-5 mt-4">
        <p className="text-xs text-white/55 text-center max-w-6xl mx-auto">
          All calculations are educational estimates. Freedomly is not a financial advisor.
          Assumptions: 7% real annual return, 4% safe withdrawal rate.
          Data source: Federal Reserve SCF 2023, Fidelity, Bureau of Economic Analysis.
        </p>
      </footer>
    </div>
  );
}
