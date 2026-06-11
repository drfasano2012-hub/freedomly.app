"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, ArrowRight } from "lucide-react";
import { useFinancialData } from "@/hooks/useFinancialData";
import { track } from "@/lib/analytics";
import { GOALS } from "@/lib/profile-options";
import type {
  RiskTolerance,
  EmploymentType,
  UserInputs,
  Debt,
  Goal,
} from "@/lib/types";

// ─── Config (reused from the original wizard) ──────────────────────────────────

const EMPLOYMENT_OPTIONS: { value: EmploymentType; label: string; icon: string }[] = [
  { value: "w2", label: "Employee (W-2)", icon: "💼" },
  { value: "self_employed", label: "Self-employed", icon: "🧑‍💻" },
  { value: "business_owner", label: "Business owner", icon: "🏢" },
  { value: "not_employed", label: "Not working now", icon: "🌿" },
];

interface FormData {
  currentAge: string;
  annualIncome: string;
  monthlyTakeHome: string;
  monthlySpending: string;
  cashSavings: string;
  retirementAccounts: string;
  brokerageAccounts: string;
  hsaAccounts: string;
  debts: { id: string; name: string; balance: string; rate: string }[];
  selectedGoalIds: string[];
  riskTolerance: RiskTolerance | "";
  employmentType: EmploymentType | "";
}

const EMPTY_FORM: FormData = {
  currentAge: "", annualIncome: "", monthlyTakeHome: "", monthlySpending: "",
  cashSavings: "", retirementAccounts: "", brokerageAccounts: "", hsaAccounts: "",
  debts: [], selectedGoalIds: [], riskTolerance: "", employmentType: "",
};

const parseNum = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;
const fmtUSD = (n: number) => "$" + Math.round(n).toLocaleString();

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
    debts: s.debts.map((d) => ({ id: d.id, name: d.name, balance: String(d.balance), rate: String(Math.round(d.rate * 100)) })),
    selectedGoalIds: s.goals.map((g) => g.id),
    riskTolerance: s.riskTolerance,
    employmentType: s.employmentType ?? "w2",
  };
}

// ─── Conversation script ───────────────────────────────────────────────────────

type StepId =
  | "intro" | "age" | "employment" | "takeHome" | "spending"
  | "money" | "debtsAsk"
  | "debtName" | "debtBalance" | "debtRate" | "debtMore"
  | "done";

const PROMPT: Record<StepId, string> = {
  intro: "Hey 👋 I'm Freedomly. I'll ask a few quick questions, then map your path to financial independence. Takes about a minute — and your answers never leave your browser.",
  age: "First up — how old are you?",
  employment: "Got it. What best describes your work?",
  takeHome: "Roughly how much do you take home each month, after taxes?",
  spending: "About how much do you spend in a typical month?",
  money: "Last big one — roughly what do you have saved and invested? Ballpark is fine, and skip anything that doesn't apply.",
  debtsAsk: "Do you have any debts — credit cards, loans, anything like that?",
  debtName: "What's the debt? (e.g. Credit card, Student loan)",
  debtBalance: "How much is left on it?",
  debtRate: "What's the interest rate (APR)?",
  debtMore: "Got it. Any other debts?",
  done: "Perfect — building your dashboard… ✨",
};

// linear "send/choice" transitions (money + debts handled specially)
const NEXT: Partial<Record<StepId, StepId>> = {
  age: "employment", employment: "takeHome", takeHome: "spending",
  spending: "money",
};

type AmountField =
  | "currentAge" | "monthlyTakeHome" | "annualIncome" | "monthlySpending"
  | "cashSavings" | "retirementAccounts" | "brokerageAccounts" | "hsaAccounts";

const FIELD_OF: Partial<Record<StepId, AmountField>> = {
  age: "currentAge", takeHome: "monthlyTakeHome", spending: "monthlySpending",
};

const REQUIRED = new Set<StepId>(["age", "takeHome", "spending"]);
const PROGRESS_ORDER: StepId[] = [
  "age", "employment", "takeHome", "spending", "money", "debtsAsk",
];

// the one grouped step: four balances in a single card
const MONEY_FIELDS: { key: AmountField; label: string; hint: string }[] = [
  { key: "cashSavings", label: "Cash", hint: "checking + savings" },
  { key: "retirementAccounts", label: "Retirement", hint: "401(k), IRA, Roth" },
  { key: "brokerageAccounts", label: "Brokerage", hint: "taxable investing" },
  { key: "hsaAccounts", label: "HSA", hint: "if you have one" },
];

type Msg = { id: number; role: "bot" | "user"; text: string };

// ─── Component ───────────────────────────────────────────────────────────────

export default function CheckupPage() {
  const router = useRouter();
  const { inputs, setInputs, hydrated } = useFinancialData();

  const [messages, setMessages] = useState<Msg[]>([]);
  const [current, setCurrent] = useState<StepId>("intro");
  const [typing, setTyping] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [moneyDraft, setMoneyDraft] = useState<Partial<Record<AmountField, string>>>({});

  const formRef = useRef(form);
  formRef.current = form;
  const draftRef = useRef({ name: "", balance: "", rate: "" });
  const msgId = useRef(0);
  const started = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isEditing = hydrated && inputs !== null;

  const nextMsgId = () => ++msgId.current;
  const pushUser = (text: string) =>
    setMessages((m) => [...m, { id: nextMsgId(), role: "user", text }]);

  // Ask a question: typing indicator, then bot bubble, then enable its composer.
  const ask = useCallback((id: StepId) => {
    setTyping(true);
    setError("");
    window.setTimeout(() => {
      setMessages((m) => [...m, { id: nextMsgId(), role: "bot", text: PROMPT[id] }]);
      setTyping(false);
      setCurrent(id);
      const field = FIELD_OF[id];
      setInputVal(field ? formRef.current[field] || "" : "");
      if (id === "money") {
        const f = formRef.current;
        setMoneyDraft({
          cashSavings: f.cashSavings, retirementAccounts: f.retirementAccounts,
          brokerageAccounts: f.brokerageAccounts, hsaAccounts: f.hsaAccounts,
        });
      }
    }, 450);
  }, []);

  // Intro sequence — explain what Freedomly is, then offer to start.
  const startIntro = useCallback(() => {
    const lines = [
      "Hey 👋 I'm Freedomly — I turn your finances into clear direction, so you can stress less and build a real path to financial independence.",
      "In about a minute I'll show you three things: where you stand today, where you're headed, and the single best move to get there faster.",
      "Your answers never leave your browser. Ready to find your number?",
    ];
    const step = (i: number) => {
      setTyping(true);
      window.setTimeout(() => {
        setMessages((m) => [...m, { id: nextMsgId(), role: "bot", text: lines[i] }]);
        if (i + 1 < lines.length) {
          step(i + 1);
        } else {
          setTyping(false);
          setCurrent("intro");
          setInputVal("");
        }
      }, i === 0 ? 350 : 750);
    };
    step(0);
  }, []);

  // Start the conversation once hydrated.
  useEffect(() => {
    if (!hydrated || started.current) return;
    started.current = true;
    if (inputs) setForm(sampleToForm(inputs));
    track(inputs ? "checkup_edited" : "checkup_started");
    startIntro();
  }, [hydrated, inputs, startIntro]);

  // Auto-scroll to newest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  // ── Finish → build UserInputs (same mapping as the original wizard) → dashboard
  const finish = useCallback(() => {
    const f = formRef.current;
    const built: UserInputs = {
      currentAge: parseNum(f.currentAge),
      annualIncome: parseNum(f.annualIncome),
      monthlyTakeHome: parseNum(f.monthlyTakeHome),
      monthlySpending: parseNum(f.monthlySpending),
      cashSavings: parseNum(f.cashSavings),
      retirementAccounts: parseNum(f.retirementAccounts),
      brokerageAccounts: parseNum(f.brokerageAccounts),
      hsaAccounts: parseNum(f.hsaAccounts),
      debts: f.debts
        .filter((d) => d.name && parseNum(d.balance) > 0)
        .map((d): Debt => ({ id: d.id, name: d.name, balance: parseNum(d.balance), rate: parseNum(d.rate) / 100 })),
      goals: GOALS.filter((g) => f.selectedGoalIds.includes(g.id)).map(
        (g): Goal => ({ id: g.id, label: g.label, horizon: g.horizon })
      ),
      riskTolerance: (f.riskTolerance || "moderate") as RiskTolerance,
      employmentType: (f.employmentType || "w2") as EmploymentType,
    };
    setInputs(built);
    track("checkup_completed", {
      debt_count: built.debts.length,
      goal_count: built.goals.length,
      risk: built.riskTolerance,
    });
    window.setTimeout(() => router.push("/dashboard"), 800);
  }, [router, setInputs]);

  useEffect(() => {
    if (current === "done") finish();
  }, [current, finish]);

  // ── Answer handlers
  const advance = (from: StepId) => {
    track("checkup_step_completed", { step: from });
    ask(NEXT[from]!);
  };

  function sendValue() {
    const field = FIELD_OF[current];
    if (!field) return;
    const n = parseNum(inputVal);
    if (REQUIRED.has(current) && (!inputVal.trim() || n <= 0)) {
      setError(current === "age" ? "Please enter your age." : "Please enter an amount.");
      return;
    }
    setForm((f) => ({ ...f, [field]: inputVal }));
    pushUser(current === "age" ? inputVal : fmtUSD(n));
    advance(current);
  }

  function chooseEmployment(o: (typeof EMPLOYMENT_OPTIONS)[number]) {
    setForm((f) => ({ ...f, employmentType: o.value }));
    pushUser(`${o.icon} ${o.label}`);
    advance("employment");
  }

  function submitMoney(draft: Partial<Record<AmountField, string>> = moneyDraft) {
    const parts = MONEY_FIELDS
      .filter((mf) => parseNum(draft[mf.key] ?? "") > 0)
      .map((mf) => `${mf.label} ${fmtUSD(parseNum(draft[mf.key] ?? ""))}`);
    setForm((f) => ({ ...f, ...draft }));
    pushUser(parts.length ? parts.join(" · ") : "Starting from $0");
    track("checkup_step_completed", { step: "money" });
    ask("debtsAsk");
  }

  function answerDebtsAsk(hasDebt: boolean) {
    if (hasDebt) {
      draftRef.current = { name: "", balance: "", rate: "" };
      pushUser("Yes");
      track("checkup_step_completed", { step: "debtsAsk" });
      ask("debtName");
    } else {
      pushUser("No debts");
      track("checkup_step_completed", { step: "debtsAsk" });
      ask("done");
    }
  }

  function sendDebtField() {
    if (current === "debtName") {
      if (!inputVal.trim()) { setError("Give it a quick name."); return; }
      draftRef.current.name = inputVal.trim();
      pushUser(inputVal.trim());
      ask("debtBalance");
    } else if (current === "debtBalance") {
      draftRef.current.balance = inputVal;
      pushUser(fmtUSD(parseNum(inputVal)));
      ask("debtRate");
    } else if (current === "debtRate") {
      draftRef.current.rate = inputVal;
      const d = draftRef.current;
      setForm((f) => ({ ...f, debts: [...f.debts, { id: crypto.randomUUID(), name: d.name, balance: d.balance, rate: d.rate }] }));
      pushUser(`${parseNum(inputVal)}% APR`);
      ask("debtMore");
    }
  }

  function answerDebtMore(another: boolean) {
    if (another) {
      draftRef.current = { name: "", balance: "", rate: "" };
      pushUser("Add another");
      ask("debtName");
    } else {
      pushUser("That's all");
      ask("done");
    }
  }

  // ── Progress
  const pi = PROGRESS_ORDER.indexOf(current);
  const progress = current === "done" ? 100 : current === "intro" ? 4 : Math.round(((pi + 1) / PROGRESS_ORDER.length) * 100);

  // ── Composer for the active step
  const numericSteps: StepId[] = ["age", "debtRate"];
  const currencySteps: StepId[] = ["takeHome", "spending", "debtBalance"];
  const isText = current === "debtName";
  const isAmount = numericSteps.includes(current) || currencySteps.includes(current);
  const showComposerInput = isAmount || isText;

  return (
    <div className="h-[100dvh] flex flex-col bg-transparent">
      {/* Header */}
      <header className="shrink-0 px-4 sm:px-6 pt-5 pb-3 max-w-lg mx-auto w-full">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
              <TrendingUp size={15} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="text-base font-bold text-white">Freedomly</span>
          </div>
          {isEditing && (
            <button
              onClick={() => router.push("/dashboard")}
              className="text-xs text-emerald-300 hover:text-emerald-200 font-medium"
            >
              Skip to dashboard →
            </button>
          )}
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </header>

      {/* Transcript */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-6">
        <div className="max-w-lg mx-auto w-full flex flex-col gap-3 py-4">
          {messages.map((m) =>
            m.role === "bot" ? (
              <div key={m.id} className="flex items-end gap-2 max-w-[88%]">
                <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mb-0.5">
                  <TrendingUp size={11} className="text-white" strokeWidth={2.5} />
                </div>
                <div className="bg-white/90 text-slate-800 text-sm leading-relaxed rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm">
                  {m.text}
                </div>
              </div>
            ) : (
              <div key={m.id} className="self-end max-w-[85%]">
                <div className="bg-emerald-500 text-white text-sm leading-relaxed rounded-2xl rounded-br-sm px-4 py-2.5 shadow-sm">
                  {m.text}
                </div>
              </div>
            )
          )}
          {typing && (
            <div className="flex items-end gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                <TrendingUp size={11} className="text-white" strokeWidth={2.5} />
              </div>
              <div className="bg-white/90 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="shrink-0 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-lg mx-auto w-full px-4 sm:px-6 py-4">
          {error && <p className="text-xs text-red-400 mb-2">{error}</p>}

          {/* Quick-reply chips by step */}
          {!typing && current === "intro" && (
            <div className="flex">
              <Chip primary onClick={() => { pushUser("Let's go"); ask("age"); }}>Let&rsquo;s go →</Chip>
            </div>
          )}

          {!typing && current === "employment" && (
            <div className="grid grid-cols-2 gap-2">
              {EMPLOYMENT_OPTIONS.map((o) => (
                <Chip key={o.value} onClick={() => chooseEmployment(o)}>{o.icon} {o.label}</Chip>
              ))}
            </div>
          )}

          {!typing && current === "money" && (
            <div className="flex flex-col gap-2.5">
              <div className="grid grid-cols-2 gap-2">
                {MONEY_FIELDS.map((mf) => (
                  <label key={mf.key} className="flex flex-col gap-1">
                    <span className="text-[11px] text-white/55 font-medium">
                      {mf.label} <span className="text-white/30">· {mf.hint}</span>
                    </span>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-slate-400 text-sm pointer-events-none">$</span>
                      <input
                        inputMode="decimal"
                        value={moneyDraft[mf.key] ?? ""}
                        onChange={(e) => setMoneyDraft((d) => ({ ...d, [mf.key]: e.target.value }))}
                        placeholder="0"
                        className="w-full bg-white/90 rounded-xl text-slate-800 placeholder:text-slate-400 text-base md:text-sm py-2.5 pl-7 pr-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                      />
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => submitMoney({})}
                  className="text-sm text-white/50 hover:text-white/80 px-2"
                >
                  Skip all
                </button>
                <button
                  onClick={() => submitMoney()}
                  className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold rounded-xl px-5 py-2.5"
                >
                  Continue <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {!typing && current === "debtsAsk" && (
            <div className="flex gap-2">
              <Chip primary onClick={() => answerDebtsAsk(true)}>Yes, I have debt</Chip>
              <Chip onClick={() => answerDebtsAsk(false)}>No debts</Chip>
            </div>
          )}

          {!typing && current === "debtMore" && (
            <div className="flex gap-2">
              <Chip onClick={() => answerDebtMore(true)}>Add another</Chip>
              <Chip primary onClick={() => answerDebtMore(false)}>That&rsquo;s all</Chip>
            </div>
          )}

          {/* Text / amount composer */}
          {!typing && showComposerInput && (
            <form
              onSubmit={(e) => { e.preventDefault(); isText ? sendDebtField() : current.startsWith("debt") ? sendDebtField() : sendValue(); }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1 flex items-center">
                {currencySteps.includes(current) && (
                  <span className="absolute left-3.5 text-slate-400 text-sm pointer-events-none">$</span>
                )}
                <input
                  autoFocus
                  inputMode={isText ? "text" : "decimal"}
                  value={inputVal}
                  onChange={(e) => { setInputVal(e.target.value); setError(""); }}
                  placeholder={
                    current === "age" ? "32" :
                    current === "debtName" ? "Credit card" :
                    current === "debtRate" ? "22" :
                    "0"
                  }
                  className={`w-full bg-white/90 rounded-xl text-slate-800 placeholder:text-slate-400 text-base md:text-sm py-3 ${
                    currencySteps.includes(current) ? "pl-8" : "pl-4"
                  } ${current === "debtRate" ? "pr-9" : "pr-4"} focus:outline-none focus:ring-2 focus:ring-emerald-500/60`}
                />
                {current === "debtRate" && (
                  <span className="absolute right-3.5 text-slate-400 text-sm pointer-events-none">%</span>
                )}
              </div>
              <button
                type="submit"
                className="shrink-0 inline-flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl w-11 h-11"
                aria-label="Send"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          <p className="text-center text-[11px] text-white/30 mt-3">
            Your data stays in your browser — never sent to a server.
          </p>
        </div>
      </div>
    </div>
  );
}

function Chip({ children, onClick, primary }: { children: React.ReactNode; onClick: () => void; primary?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`text-sm font-medium rounded-xl px-4 py-2.5 border transition-colors text-center ${
        primary
          ? "bg-emerald-500 border-emerald-400 text-white hover:bg-emerald-400"
          : "bg-white/10 border-white/20 text-white/85 hover:bg-white/20 hover:border-white/40"
      }`}
    >
      {children}
    </button>
  );
}
