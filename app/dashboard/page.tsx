"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useFinancialData } from "@/hooks/useFinancialData";
import { calcAllMetrics } from "@/lib/calculations";
import { track } from "@/lib/analytics";
import { AppNav } from "@/components/AppNav";
import { HealthScoreCard } from "@/components/dashboard/HealthScoreCard";
import { FreedomAgeCard } from "@/components/dashboard/FreedomAgeCard";
import { SnapshotCards } from "@/components/dashboard/SnapshotCards";
import { BenchmarksSection } from "@/components/dashboard/BenchmarksSection";
import { DetailCards } from "@/components/dashboard/DetailCards";
import { ActionPlan } from "@/components/dashboard/ActionPlan";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider px-1">
      {children}
    </h2>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { inputs, hasCompletedCheckup, hydrated } = useFinancialData();

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

  return (
    <div className="min-h-screen bg-transparent">
      <AppNav />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">

        {/* Top row: Health Score + Freedom Age */}
        <section className="flex flex-col gap-2">
          <SectionLabel>Overview</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <HealthScoreCard
                score={metrics.healthScore}
                breakdown={metrics.healthScoreBreakdown}
              />
            </div>
            <div className="md:col-span-2">
              <FreedomAgeCard
                result={metrics.freedomAge}
                currentAge={inputs.currentAge}
                monthlySurplus={metrics.monthlySurplus}
                monthlySpending={inputs.monthlySpending}
                monthlyTakeHome={inputs.monthlyTakeHome}
                totalInvestedPlusCash={metrics.totalInvestments + inputs.cashSavings}
              />
            </div>
          </div>
        </section>

        {/* Snapshot cards */}
        <section className="flex flex-col gap-2">
          <SectionLabel>Financial Snapshot</SectionLabel>
          <SnapshotCards metrics={metrics} monthlyTakeHome={inputs.monthlyTakeHome} />
        </section>

        {/* Action plan — top 3 recommendations, surfaced early */}
        <section className="flex flex-col gap-2">
          <SectionLabel>Action plan</SectionLabel>
          <ActionPlan
            actionPlan={metrics.actionPlan}
            goals={inputs.goals}
            employmentType={inputs.employmentType ?? "w2"}
          />
        </section>

        {/* Benchmarks */}
        <section className="flex flex-col gap-2">
          <SectionLabel>Benchmarks</SectionLabel>
          <BenchmarksSection metrics={metrics} currentAge={inputs.currentAge} />
        </section>

        {/* Detail cards (B–E) */}
        <section className="flex flex-col gap-2">
          <SectionLabel>Your numbers in detail</SectionLabel>
          <DetailCards metrics={metrics} inputs={inputs} />
        </section>

      </main>

      <footer className="border-t border-white/50 px-6 py-5 mt-4">
        <p className="text-xs text-white/40 text-center max-w-6xl mx-auto">
          All calculations are educational estimates. Freedomly is not a financial advisor.
          Assumptions: 7% real annual return, 4% safe withdrawal rate.
          Data source: Federal Reserve SCF 2023, Fidelity, Bureau of Economic Analysis.
        </p>
      </footer>
    </div>
  );
}
