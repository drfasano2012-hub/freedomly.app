"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BookOpen, LayoutDashboard, Map, Zap } from "lucide-react";
import { AppNav } from "@/components/AppNav";
import { useFinancialData } from "@/hooks/useFinancialData";
import { calcAllMetrics } from "@/lib/calculations";
import { loadProgress, getRecommendedLesson, getLevelProgress } from "@/lib/learn-progress";
import { track } from "@/lib/analytics";
import type { LearnProgress } from "@/lib/types";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getScoreColor(score: number): string {
  if (score >= 75) return "#10b981";
  if (score >= 50) return "#3b82f6";
  return "#ef4444";
}

function getScoreLabel(score: number): string {
  if (score >= 75) return "Strong";
  if (score >= 50) return "Getting there";
  return "Needs work";
}

function MiniGauge({ score }: { score: number }) {
  const radius = 34;
  const sw = 7;
  const c = 44;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - score / 100);
  const color = getScoreColor(score);
  return (
    <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90" aria-hidden="true">
      <circle cx={c} cy={c} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={sw} />
      <circle
        cx={c} cy={c} r={radius} fill="none"
        stroke={color} strokeWidth={sw}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
      />
    </svg>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { inputs, hasCompletedCheckup, hydrated } = useFinancialData();
  const [learnProgress, setLearnProgress] = useState<LearnProgress>({ lessons: {}, xp: 0, weeklyActivity: [] });
  const [learnReady, setLearnReady] = useState(false);

  useEffect(() => {
    if (hydrated && !hasCompletedCheckup) router.replace("/checkup");
  }, [hydrated, hasCompletedCheckup, router]);

  useEffect(() => {
    if (hydrated && hasCompletedCheckup) {
      setLearnProgress(loadProgress());
      setLearnReady(true);
      track("home_viewed");
    }
  }, [hydrated, hasCompletedCheckup]);

  const metrics = useMemo(() => (inputs ? calcAllMetrics(inputs) : null), [inputs]);

  if (!hydrated || !inputs || !metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const score = metrics.healthScore;
  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);
  const fa = metrics.freedomAge;
  const topAction = metrics.actionPlan.topActions[0];
  const recommended = learnReady
    ? getRecommendedLesson(metrics.healthScoreBreakdown, learnProgress)
    : null;
  const levelData = getLevelProgress(learnProgress.xp);
  const completedCount = Object.keys(learnProgress.lessons).length;

  const freedomDisplay =
    fa.status === "already_reached"
      ? { big: String(inputs.currentAge), sub: "You're already free" }
      : fa.status === "normal" && fa.freedomAge !== null
      ? { big: String(fa.freedomAge), sub: `${Math.round(fa.yearsToFreedom!)} yrs away` }
      : { big: "50+", sub: "More to do here" };

  return (
    <div className="min-h-screen bg-transparent page-in">
      <AppNav />

      <main className="max-w-lg mx-auto px-4 sm:px-6 py-6 flex flex-col gap-5">

        {/* Greeting */}
        <div>
          <h1 className="text-xl font-bold text-white">{getGreeting()}</h1>
          <p className="text-sm text-white/60 mt-0.5">Here's where your plan stands.</p>
        </div>

        {/* Hero: health score + freedom age */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/dashboard"
            className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-white/80 transition-colors"
          >
            <div className="relative">
              <MiniGauge score={score} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold leading-none" style={{ color: scoreColor }}>{score}</span>
                <span className="text-[10px] text-slate-500">/100</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-[11px] font-medium text-slate-500">Health score</p>
              <p className="text-sm font-bold" style={{ color: scoreColor }}>{scoreLabel}</p>
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl p-4 flex flex-col justify-center gap-1 hover:bg-white/80 transition-colors"
          >
            <p className="text-[11px] font-medium text-slate-500">Freedom age</p>
            <p className="text-4xl font-bold text-slate-800 leading-none">{freedomDisplay.big}</p>
            <p className="text-xs text-slate-500 mt-0.5">{freedomDisplay.sub}</p>
          </Link>
        </div>

        {/* Top action */}
        {topAction && (
          <div className="bg-white/80 backdrop-blur-sm border border-emerald-200 shadow-lg rounded-2xl p-5">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2.5">
              Your #1 move right now
            </p>
            <p className="text-sm font-semibold text-slate-900 leading-snug">{topAction.text}</p>
            <p className="text-xs text-slate-600 leading-relaxed mt-1.5">{topAction.detail}</p>
            {topAction.impact && (
              <span className="inline-flex items-center gap-1 mt-2.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">
                <Zap size={11} />
                {topAction.impact}
              </span>
            )}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
              <Link
                href="/dashboard"
                className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
              >
                See full plan <ArrowRight size={12} />
              </Link>
              {topAction.lessonId && (
                <Link
                  href={`/learn/${topAction.lessonId}`}
                  className="flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700"
                >
                  <BookOpen size={12} />
                  Learn why
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Quick nav grid */}
        <div className="grid grid-cols-2 gap-3">
          <NavCard
            href="/dashboard"
            icon={<LayoutDashboard size={18} className="text-blue-600" />}
            iconBg="bg-blue-100"
            label="Full plan"
            sub="Projections & details"
          />

          <NavCard
            href="/learn"
            icon={<BookOpen size={18} className="text-emerald-600" />}
            iconBg="bg-emerald-100"
            label="Learn"
            sub={learnReady ? `${levelData.level.name} · ${completedCount} done` : "Financial lessons"}
          />

          {recommended ? (
            <NavCard
              href={`/learn/${recommended.lesson.id}`}
              icon={<span className="text-base">▶︎</span>}
              iconBg="bg-amber-100"
              label="Up next"
              sub={recommended.lesson.title}
              subTruncate
            />
          ) : (
            <NavCard
              href="/learn"
              icon={<span className="text-base">🎉</span>}
              iconBg="bg-emerald-50"
              label="All done"
              sub="Every lesson complete"
            />
          )}

          <NavCard
            href="/dashboard"
            icon={<Map size={18} className="text-rose-500" />}
            iconBg="bg-rose-100"
            label="Milestones"
            sub="Your financial journey"
          />
        </div>

      </main>
    </div>
  );
}

function NavCard({
  href,
  icon,
  iconBg,
  label,
  sub,
  subTruncate,
}: {
  href: string;
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  sub: string;
  subTruncate?: boolean;
}) {
  return (
    <Link
      href={href}
      className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl p-4 flex items-center gap-3 hover:bg-white/80 transition-colors"
    >
      <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className={`text-xs text-slate-500 ${subTruncate ? "truncate" : "line-clamp-2"}`}>{sub}</p>
      </div>
    </Link>
  );
}
