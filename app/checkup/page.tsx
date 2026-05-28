"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowLeft, TrendingUp } from "lucide-react";
import { useFinancialData } from "@/hooks/useFinancialData";
import { getSampleData } from "@/lib/calculations";
import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { RiskTolerance, GoalHorizon, UserInputs, Debt, Goal } from "@/lib/types";

// ─── Goals data ───────────────────────────────────────────────────────────────

const GOALS: { id: string; label: string; horizon: GoalHorizon }[] = [
  { id: "emergency_fund", label: "Build emergency fund", horizon: "short" },
  { id: "pay_debt", label: "Pay off debt", horizon: "short" },
  { id: "vacation", label: "Save for vacation / travel", horizon: "short" },
  { id: "buy_home", label: "Buy a home", horizon: "mid" },
  { id: "start_business", label: "Start a business", horizon: "mid" },
  { id: "education", label: "Kids' education fund", horizon: "mid" },
  { id: "retire", label: "Retire comfortably", horizon: "long" },
  { id: "fi", label: "Achieve financial independence", horizon: "long" },
];

const HORIZON_LABELS: Record<GoalHorizon, string> = {
  short: "Short-term  (under 2 years)",
  mid: "Mid-term  (2–7 years)",
  long: "Long-term  (7+ years)",
};

// ─── Form state ───────────────────────────────────────────────────────────────

interface DebtForm {
  id: string;
  name: string;
  balance: string;
  rate: string; // as percentage string, e.g. "22" for 22%
}

interface FormData {
  currentAge: string;
  annualIncome: string;
  monthlyTakeHome: string;
  monthlySpending: string;
  cashSavings: string;
  retirementAccounts: string;
  brokerageAccounts: string;
  hsaAccounts: string;
  debts: DebtForm[];
  selectedGoalIds: string[];
  riskTolerance: RiskTolerance | "";
}

const EMPTY_FORM: FormData = {
  currentAge: "",
  annualIncome: "",
  monthlyTakeHome: "",
  monthlySpending: "",
  cashSavings: "",
  retirementAccounts: "",
  brokerageAccounts: "",
  hsaAccounts: "",
  debts: [],
  selectedGoalIds: [],
  riskTolerance: "",
};

const STEP_LABELS = ["You & Income", "Spending & Savings", "Debt", "Goals", "Risk"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseNum(s: string): number {
  return parseFloat(s.replace(/,/g, "")) || 0;
}

function newDebt(): DebtForm {
  return { id: crypto.randomUUID(), name: "", balance: "", rate: "" };
}

function sampleToForm(s: UserInputs): FormData {
  return {
    currentAge: String(s.currentAge),
    annualIncome: String(s.annualIncome),
    monthlyTakeHome: String(s.monthlyTakeHome),
    monthlySpending: String(s.monthlySpending),
    cashSavings: String(s.cashSavings),
    retirementAccounts: String(s.retirementAccounts),
    brokerageAccounts: String(s.brokerageAccounts),
    hsaAccounts: String(s.hsaAccounts),
    debts: s.debts.map((d) => ({
      id: d.id,
      name: d.name,
      balance: String(d.balance),
      rate: String(Math.round(d.rate * 100)),
    })),
    selectedGoalIds: s.goals.map((g) => g.id),
    riskTolerance: s.riskTolerance,
  };
}

// ─── Page component ───────────────────────────────────────────────────────────

export default function CheckupPage() {
  const router = useRouter();
  const { inputs, setInputs, hydrated } = useFinancialData();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEditing = hydrated && inputs !== null;

  // Pre-fill form from existing data when editing
  useEffect(() => {
    if (hydrated && inputs) {
      setForm(sampleToForm(inputs));
    }
  }, [hydrated]); // intentionally run once on hydration

  // ── Field helpers

  function set(field: keyof FormData, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  }

  function setDebt(id: string, field: keyof DebtForm, value: string) {
    setForm((f) => ({
      ...f,
      debts: f.debts.map((d) => (d.id === id ? { ...d, [field]: value } : d)),
    }));
  }

  function addDebt() {
    setForm((f) => ({ ...f, debts: [...f.debts, newDebt()] }));
  }

  function removeDebt(id: string) {
    setForm((f) => ({ ...f, debts: f.debts.filter((d) => d.id !== id) }));
  }

  function toggleGoal(id: string) {
    setForm((f) => ({
      ...f,
      selectedGoalIds: f.selectedGoalIds.includes(id)
        ? f.selectedGoalIds.filter((g) => g !== id)
        : [...f.selectedGoalIds, id],
    }));
  }

  function loadSampleData() {
    setForm(sampleToForm(getSampleData()));
    setErrors({});
  }

  // ── Validation

  function validateStep(s: number): boolean {
    const errs: Record<string, string> = {};

    if (s === 1) {
      if (!form.currentAge || parseNum(form.currentAge) <= 0)
        errs.currentAge = "Please enter your age";
      if (!form.monthlyTakeHome || parseNum(form.monthlyTakeHome) <= 0)
        errs.monthlyTakeHome = "Monthly take-home is required";
    }

    if (s === 2) {
      if (!form.monthlySpending || parseNum(form.monthlySpending) <= 0)
        errs.monthlySpending = "Monthly spending is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ── Navigation

  function next() {
    if (!validateStep(step)) return;
    if (step < 5) setStep((s) => s + 1);
    else submit();
  }

  function back() {
    if (step > 1) setStep((s) => s - 1);
    else router.push("/");
  }

  // ── Submit

  function submit() {
    const inputs: UserInputs = {
      currentAge: parseNum(form.currentAge),
      annualIncome: parseNum(form.annualIncome),
      monthlyTakeHome: parseNum(form.monthlyTakeHome),
      monthlySpending: parseNum(form.monthlySpending),
      cashSavings: parseNum(form.cashSavings),
      retirementAccounts: parseNum(form.retirementAccounts),
      brokerageAccounts: parseNum(form.brokerageAccounts),
      hsaAccounts: parseNum(form.hsaAccounts),
      debts: form.debts
        .filter((d) => d.name && parseNum(d.balance) > 0)
        .map((d): Debt => ({
          id: d.id,
          name: d.name,
          balance: parseNum(d.balance),
          rate: parseNum(d.rate) / 100,
        })),
      goals: GOALS.filter((g) =>
        form.selectedGoalIds.includes(g.id)
      ).map((g): Goal => ({ id: g.id, label: g.label, horizon: g.horizon })),
      riskTolerance: (form.riskTolerance || "moderate") as RiskTolerance,
    };

    setInputs(inputs);
    router.push("/dashboard");
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center px-4 py-8 sm:py-16">
      {/* Card container */}
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
                <TrendingUp size={15} className="text-white" strokeWidth={2.5} />
              </div>
              <span className="text-base font-bold text-white">Freedomly</span>
            </div>
            {isEditing && (
              <span className="text-xs text-amber-600 border border-amber-400/50 bg-amber-100/80 rounded-full px-2 py-0.5">
                Editing
              </span>
            )}
          </div>
          {step === 1 && (
            <button
              onClick={loadSampleData}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              Try sample data
            </button>
          )}
        </div>

        {/* Progress */}
        <div className="mb-8">
          <ProgressBar current={step} total={5} labels={STEP_LABELS} />
        </div>

        {/* Form card */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-2xl p-6 sm:p-8 shadow-sm">
          {step === 1 && <StepIncome form={form} errors={errors} set={set} />}
          {step === 2 && <StepSpending form={form} errors={errors} set={set} />}
          {step === 3 && (
            <StepDebt
              form={form}
              addDebt={addDebt}
              removeDebt={removeDebt}
              setDebt={setDebt}
            />
          )}
          {step === 4 && <StepGoals form={form} toggleGoal={toggleGoal} />}
          {step === 5 && (
            <StepRisk
              value={form.riskTolerance}
              onChange={(v) => set("riskTolerance", v)}
            />
          )}

          {/* Navigation buttons */}
          <div className="flex items-center gap-3 mt-8">
            <button
              onClick={back}
              className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-600 transition-colors"
            >
              <ArrowLeft size={14} />
              Back
            </button>
            <div className="flex-1" />
            <Button onClick={next} size="md" className="px-6">
              {step === 5 ? "See my dashboard →" : "Continue"}
            </Button>
          </div>
        </div>

        {/* Reassurance */}
        <p className="text-center text-xs text-white/40 mt-5">
          Your data stays in your browser — never sent to a server.
        </p>
      </div>
    </div>
  );
}

// ─── Step 1: Income ────────────────────────────────────────────────────────────

function StepIncome({
  form,
  errors,
  set,
}: {
  form: FormData;
  errors: Record<string, string>;
  set: (f: keyof FormData, v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-1">
          You &amp; your income
        </h2>
        <p className="text-sm text-slate-600">
          The foundation for your financial picture.
        </p>
      </div>
      <Input
        label="Current age"
        id="currentAge"
        type="number"
        min={18}
        max={100}
        placeholder="32"
        value={form.currentAge}
        onChange={(e) => set("currentAge", e.target.value)}
        error={errors.currentAge}
      />
      <Input
        label="Monthly take-home pay"
        id="monthlyTakeHome"
        type="number"
        min={1}
        placeholder="4,800"
        prefix="$"
        hint="After taxes and deductions"
        value={form.monthlyTakeHome}
        onChange={(e) => set("monthlyTakeHome", e.target.value)}
        error={errors.monthlyTakeHome}
      />
      <Input
        label="Annual gross income"
        id="annualIncome"
        type="number"
        min={0}
        placeholder="75,000"
        prefix="$"
        hint="Before taxes — used for wealth benchmarks"
        optional
        value={form.annualIncome}
        onChange={(e) => set("annualIncome", e.target.value)}
      />
    </div>
  );
}

// ─── Step 2: Spending & savings ────────────────────────────────────────────────

function StepSpending({
  form,
  errors,
  set,
}: {
  form: FormData;
  errors: Record<string, string>;
  set: (f: keyof FormData, v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-1">
          Spending, cash &amp; investments
        </h2>
        <p className="text-sm text-slate-600">
          Best estimates are fine — this isn&rsquo;t a budget tracker.
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
          Monthly spending
        </p>
        <Input
          label="Total monthly spending"
          id="monthlySpending"
          type="number"
          min={1}
          placeholder="3,200"
          prefix="$"
          hint="Housing, food, transport, subscriptions — all of it"
          value={form.monthlySpending}
          onChange={(e) => set("monthlySpending", e.target.value)}
          error={errors.monthlySpending}
        />
      </div>

      <div className="space-y-4">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
          Assets
        </p>
        <Input
          label="Cash savings"
          id="cashSavings"
          type="number"
          min={0}
          placeholder="2,000"
          prefix="$"
          hint="Checking account + high-yield savings"
          optional
          value={form.cashSavings}
          onChange={(e) => set("cashSavings", e.target.value)}
        />
        <Input
          label="Retirement accounts"
          id="retirementAccounts"
          type="number"
          min={0}
          placeholder="18,000"
          prefix="$"
          hint="401(k), IRA, Roth IRA combined"
          optional
          value={form.retirementAccounts}
          onChange={(e) => set("retirementAccounts", e.target.value)}
        />
        <Input
          label="Brokerage accounts"
          id="brokerageAccounts"
          type="number"
          min={0}
          placeholder="0"
          prefix="$"
          hint="Taxable investment accounts"
          optional
          value={form.brokerageAccounts}
          onChange={(e) => set("brokerageAccounts", e.target.value)}
        />
        <Input
          label="HSA balance"
          id="hsaAccounts"
          type="number"
          min={0}
          placeholder="0"
          prefix="$"
          hint="Health savings account"
          optional
          value={form.hsaAccounts}
          onChange={(e) => set("hsaAccounts", e.target.value)}
        />
      </div>
    </div>
  );
}

// ─── Step 3: Debt ──────────────────────────────────────────────────────────────

function StepDebt({
  form,
  addDebt,
  removeDebt,
  setDebt,
}: {
  form: FormData;
  addDebt: () => void;
  removeDebt: (id: string) => void;
  setDebt: (id: string, field: keyof DebtForm, value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-1">Debt</h2>
        <p className="text-sm text-slate-600">
          Add each debt separately so we can prioritize high-interest first.
        </p>
      </div>

      {form.debts.length === 0 ? (
        <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center">
          <p className="text-sm text-slate-600 mb-3">
            No debts? Great — skip ahead.
          </p>
          <Button variant="secondary" size="sm" onClick={addDebt}>
            <Plus size={14} />
            Add a debt
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {form.debts.map((debt, i) => (
            <div
              key={debt.id}
              className="bg-white/50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Debt {i + 1}
                </span>
                <button
                  onClick={() => removeDebt(debt.id)}
                  className="text-slate-400 hover:text-red-400 transition-colors p-1 rounded"
                  aria-label="Remove debt"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <Input
                label="Name"
                id={`debt-name-${debt.id}`}
                placeholder='e.g. "Credit card" or "Student loan"'
                value={debt.name}
                onChange={(e) => setDebt(debt.id, "name", e.target.value)}
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Balance"
                  id={`debt-balance-${debt.id}`}
                  type="number"
                  min={0}
                  placeholder="22,000"
                  prefix="$"
                  value={debt.balance}
                  onChange={(e) => setDebt(debt.id, "balance", e.target.value)}
                />
                <Input
                  label="APR"
                  id={`debt-rate-${debt.id}`}
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  placeholder="6.0"
                  suffix="%"
                  value={debt.rate}
                  onChange={(e) => setDebt(debt.id, "rate", e.target.value)}
                />
              </div>
              {parseFloat(debt.rate) > 10 && (
                <p className="text-xs text-amber-600 flex items-center gap-1.5">
                  <span>⚠</span> High-interest debt — this will be a top priority
                </p>
              )}
            </div>
          ))}

          <Button variant="secondary" size="sm" onClick={addDebt} className="self-start">
            <Plus size={14} />
            Add another debt
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Step 4: Goals ─────────────────────────────────────────────────────────────

function StepGoals({
  form,
  toggleGoal,
}: {
  form: FormData;
  toggleGoal: (id: string) => void;
}) {
  const horizons: GoalHorizon[] = ["short", "mid", "long"];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-1">
          What are you working toward?
        </h2>
        <p className="text-sm text-slate-600">
          Select all that apply — your action plan will reflect these.
        </p>
      </div>

      {horizons.map((horizon) => (
        <div key={horizon} className="flex flex-col gap-2.5">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            {HORIZON_LABELS[horizon]}
          </p>
          <div className="flex flex-wrap gap-2">
            {GOALS.filter((g) => g.horizon === horizon).map((goal) => {
              const selected = form.selectedGoalIds.includes(goal.id);
              return (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all duration-150 ${
                    selected
                      ? "bg-emerald-500/20 border-emerald-500/60 text-emerald-700"
                      : "bg-white/60 border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                  }`}
                >
                  {selected && <span className="mr-1.5">✓</span>}
                  {goal.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <p className="text-xs text-slate-500">
        No goals selected? That&rsquo;s okay — we&rsquo;ll still build your action plan.
      </p>
    </div>
  );
}

// ─── Step 5: Risk tolerance ────────────────────────────────────────────────────

const RISK_OPTIONS: {
  value: RiskTolerance;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    value: "conservative",
    label: "Conservative",
    description: "Stability matters most. Market losses stress me out.",
    icon: "🛡️",
  },
  {
    value: "moderate",
    label: "Moderate",
    description: "I can handle ups and downs for better long-term returns.",
    icon: "⚖️",
  },
  {
    value: "aggressive",
    label: "Aggressive",
    description: "I'm in for the long haul. Volatility is the price of growth.",
    icon: "🚀",
  },
];

function StepRisk({
  value,
  onChange,
}: {
  value: RiskTolerance | "";
  onChange: (v: RiskTolerance) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-1">
          Risk tolerance
        </h2>
        <p className="text-sm text-slate-600">
          This shapes your recommended portfolio allocation.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {RISK_OPTIONS.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`flex items-start gap-4 p-4 rounded-xl border text-left transition-all duration-150 ${
                selected
                  ? "bg-emerald-500/15 border-emerald-500/50"
                  : "bg-white/50 border-slate-200 hover:border-slate-300"
              }`}
            >
              <span className="text-2xl mt-0.5">{opt.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <p
                    className={`text-sm font-semibold ${
                      selected ? "text-emerald-700" : "text-slate-700"
                    }`}
                  >
                    {opt.label}
                  </p>
                  {selected && (
                    <span className="text-emerald-600 text-xs font-medium shrink-0">
                      Selected ✓
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  {opt.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
