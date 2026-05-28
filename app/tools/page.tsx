"use client";

import { useState } from "react";
import { AppNav } from "@/components/AppNav";
import { useFinancialData } from "@/hooks/useFinancialData";
import { calcAllMetrics } from "@/lib/calculations";
import { CoastFireTool } from "@/components/tools/CoastFireTool";
import { CompoundGrowthTool } from "@/components/tools/CompoundGrowthTool";
import { cn } from "@/lib/utils";

const TOOLS = [
  {
    id: "coast-fire",
    label: "Coast FIRE",
    description: "How much do you need to invest today to coast to financial independence?",
  },
  {
    id: "compound",
    label: "Compound Growth",
    description: "Visualize the power of compounding over time.",
  },
] as const;

type ToolId = (typeof TOOLS)[number]["id"];

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState<ToolId>("coast-fire");
  const { inputs } = useFinancialData();

  // Pre-populate tool inputs from checkup data if available
  const metrics = inputs ? calcAllMetrics(inputs) : null;

  const activeTool = TOOLS.find((t) => t.id === activeTab)!;

  return (
    <div className="min-h-screen bg-transparent">
      <AppNav />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Financial Tools</h1>
          <p className="text-sm text-white/50">
            Standalone calculators to explore scenarios and build your plan.
          </p>
        </div>

        {/* Tab navigation */}
        <div
          className="flex gap-1 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0"
          role="tablist"
          aria-label="Financial tools"
        >
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              role="tab"
              aria-selected={activeTab === tool.id}
              onClick={() => setActiveTab(tool.id)}
              className={cn(
                "shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 border",
                activeTab === tool.id
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                  : "bg-white/10 border-white/20 text-white/60 hover:text-white hover:border-white/40"
              )}
            >
              {tool.label}
            </button>
          ))}
        </div>

        {/* Active tool card */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-2xl p-6 sm:p-7 shadow-sm">
          {/* Tool header */}
          <div className="mb-6">
            <h2 className="text-base font-semibold text-slate-900 mb-1">
              {activeTool.label}
            </h2>
            <p className="text-xs text-slate-600">{activeTool.description}</p>
            {activeTab === "coast-fire" && (
              <div className="mt-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                <p className="text-xs text-slate-500 leading-relaxed">
                  <span className="font-semibold text-slate-700">FIRE</span> = Financial Independence, Retire Early.{" "}
                  <span className="font-semibold text-slate-700">Coast FIRE</span> is the point where your existing investments will compound to your full FI number by retirement age — without any additional contributions needed.
                </p>
              </div>
            )}
            {inputs && (
              <p className="text-xs text-emerald-600 mt-1.5">
                ✓ Pre-filled from your checkup — adjust any values
              </p>
            )}
          </div>

          {/* Tool content */}
          {activeTab === "coast-fire" && (
            <CoastFireTool
              initialAge={inputs?.currentAge}
              initialInvested={metrics?.totalInvestments}
            />
          )}
          {activeTab === "compound" && (
            <CompoundGrowthTool
              initialStartingAmount={metrics?.totalInvestments}
              initialMonthlyContribution={
                metrics && metrics.monthlySurplus > 0 ? metrics.monthlySurplus : undefined
              }
            />
          )}
        </div>
      </main>
    </div>
  );
}
