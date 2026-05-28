import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { formatCurrencyFull, formatPercent } from "@/lib/calculations";
import type { FinancialMetrics, UserInputs } from "@/lib/types";

interface Props {
  metrics: FinancialMetrics;
  inputs: UserInputs;
}

// ─── B: Cash Flow ─────────────────────────────────────────────────────────────

function CashFlowCard({ inputs, metrics }: { inputs: UserInputs; metrics: FinancialMetrics }) {
  const { monthlyTakeHome, monthlySpending } = inputs;
  const { monthlySurplus } = metrics;
  const spendingPct = Math.min(100, (monthlySpending / monthlyTakeHome) * 100);
  const isSurplus = monthlySurplus >= 0;

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl p-5 flex flex-col gap-4">
      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
        Cash Flow
      </p>

      <div className="flex flex-col gap-2">
        <Row label="Monthly take-home" value={formatCurrencyFull(monthlyTakeHome)} />
        <Row label="Monthly spending" value={formatCurrencyFull(monthlySpending)} dimValue />
        <div className="border-t border-slate-200 pt-2 mt-1">
          <Row
            label={isSurplus ? "Monthly surplus" : "Monthly deficit"}
            value={`${isSurplus ? "+" : "-"}${formatCurrencyFull(Math.abs(monthlySurplus))}`}
            highlight={isSurplus ? "green" : "red"}
          />
        </div>
      </div>

      {/* Spending bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-slate-600">Spending as % of take-home</span>
          <span className="text-xs font-medium text-slate-700">{spendingPct.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${spendingPct}%`,
              backgroundColor: spendingPct >= 95 ? "#ef4444" : spendingPct >= 80 ? "#f59e0b" : "#10b981",
              transition: "width 0.5s ease-out",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── C: Debt Overview ─────────────────────────────────────────────────────────

function DebtCard({ inputs, metrics }: { inputs: UserInputs; metrics: FinancialMetrics }) {
  const { totalDebt, weightedAvgDebtRate, highInterestDebt } = metrics;
  const sortedDebts = [...inputs.debts].sort((a, b) => b.rate - a.rate);

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl p-5 flex flex-col gap-4">
      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
        Debt Overview
      </p>

      {totalDebt === 0 ? (
        <div className="flex items-center gap-2 text-emerald-600">
          <CheckCircle2 size={16} />
          <span className="text-sm font-medium">Debt-free</span>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <Row label="Total debt" value={formatCurrencyFull(totalDebt)} />
            <Row label="Weighted avg rate" value={formatPercent(weightedAvgDebtRate, 1)} />
            {highInterestDebt > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2 mt-1">
                <AlertTriangle size={12} />
                <span>{formatCurrencyFull(highInterestDebt)} in high-interest debt (&gt;10% APR)</span>
              </div>
            )}
          </div>

          {sortedDebts.length > 0 && (
            <div className="border-t border-slate-200 pt-3 flex flex-col gap-2">
              <p className="text-xs text-slate-600">Debts by APR (highest first)</p>
              {sortedDebts.map((debt) => (
                <div key={debt.id} className="flex items-center justify-between">
                  <span className="text-xs text-slate-700 truncate mr-3">{debt.name}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-slate-700">{formatCurrencyFull(debt.balance)}</span>
                    <span
                      className={`text-xs font-medium ${debt.rate > 0.1 ? "text-red-600" : "text-slate-400"}`}
                    >
                      {formatPercent(debt.rate, 1)} APR
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── D: Savings & Liquidity ───────────────────────────────────────────────────

function SavingsCard({ inputs, metrics }: { inputs: UserInputs; metrics: FinancialMetrics }) {
  const { emergencyFundMonths } = metrics;
  const targetMonths = 6;
  const progressPct = Math.min(100, (emergencyFundMonths / targetMonths) * 100);

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl p-5 flex flex-col gap-4">
      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
        Savings &amp; Liquidity
      </p>

      <div className="flex flex-col gap-2">
        <Row label="Cash savings" value={formatCurrencyFull(inputs.cashSavings)} />
        <Row label="Emergency fund coverage" value={`${emergencyFundMonths.toFixed(1)} months`} />
      </div>

      {/* Progress to 6-month goal */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-slate-600">Progress to 6-month goal</span>
          <span className="text-xs font-medium text-slate-700">{progressPct.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${progressPct}%`,
              backgroundColor: progressPct >= 100 ? "#10b981" : progressPct >= 50 ? "#f59e0b" : "#ef4444",
              transition: "width 0.5s ease-out",
            }}
          />
        </div>
        {emergencyFundMonths < targetMonths && (
          <p className="text-xs text-slate-600 mt-1.5">
            {formatCurrencyFull(
              Math.max(0, inputs.monthlySpending * targetMonths - inputs.cashSavings)
            )}{" "}
            more to reach 6 months
          </p>
        )}
      </div>
    </div>
  );
}

// ─── E: Investing Overview ────────────────────────────────────────────────────

function InvestingCard({ inputs, metrics }: { inputs: UserInputs; metrics: FinancialMetrics }) {
  const { totalInvestments, emergencyFundMonths, highInterestDebt, monthlySurplus } = metrics;

  const readinessChecks = [
    {
      label: "Emergency fund ≥ 3 months",
      passed: emergencyFundMonths >= 3,
    },
    {
      label: "No high-interest debt",
      passed: highInterestDebt === 0,
    },
    {
      label: "Positive monthly surplus",
      passed: monthlySurplus > 0,
    },
  ];

  const buckets = [
    { label: "Retirement (401k / IRA)", value: inputs.retirementAccounts },
    { label: "Brokerage", value: inputs.brokerageAccounts },
    { label: "HSA", value: inputs.hsaAccounts },
  ].filter((b) => b.value > 0);

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl p-5 flex flex-col gap-4">
      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
        Investing Overview
      </p>

      <div>
        <p className="text-2xl font-bold text-slate-800">{formatCurrencyFull(totalInvestments)}</p>
        <p className="text-xs text-slate-600 mt-0.5">Total invested</p>
      </div>

      {/* Buckets */}
      {buckets.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          {buckets.map((b) => (
            <Row key={b.label} label={b.label} value={formatCurrencyFull(b.value)} />
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-500 italic">No investment accounts entered</p>
      )}

      {/* Readiness checks */}
      <div className="border-t border-slate-200 pt-3 flex flex-col gap-2">
        <p className="text-xs text-slate-600 mb-1">Investing readiness</p>
        {readinessChecks.map(({ label, passed }) => (
          <div key={label} className="flex items-center gap-2">
            {passed ? (
              <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
            ) : (
              <XCircle size={13} className="text-slate-400 shrink-0" />
            )}
            <span className={`text-xs ${passed ? "text-slate-700" : "text-slate-500"}`}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Shared row component ─────────────────────────────────────────────────────

function Row({
  label,
  value,
  dimValue,
  highlight,
}: {
  label: string;
  value: string;
  dimValue?: boolean;
  highlight?: "green" | "red";
}) {
  const valueClass =
    highlight === "green"
      ? "text-emerald-600"
      : highlight === "red"
      ? "text-red-600"
      : dimValue
      ? "text-slate-400"
      : "text-slate-700";

  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-slate-600">{label}</span>
      <span className={`text-xs font-medium ${valueClass}`}>{value}</span>
    </div>
  );
}

// ─── Exported grid ────────────────────────────────────────────────────────────

export function DetailCards({ metrics, inputs }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <CashFlowCard inputs={inputs} metrics={metrics} />
      <DebtCard inputs={inputs} metrics={metrics} />
      <SavingsCard inputs={inputs} metrics={metrics} />
      <InvestingCard inputs={inputs} metrics={metrics} />
    </div>
  );
}
