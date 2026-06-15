"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight, BookOpen, LayoutDashboard, Map,
  Zap, Flame, TrendingUp, TrendingDown,
} from "lucide-react";
import { AppNav } from "@/components/AppNav";
import { useFinancialData } from "@/hooks/useFinancialData";
import { calcAllMetrics, formatCurrency } from "@/lib/calculations";
import { loadProgress, getRecommendedLesson, getLevelProgress, getStreak } from "@/lib/learn-progress";
import { readHistory, recordSnapshot, type Snapshot } from "@/lib/history";
import { track } from "@/lib/analytics";
import type { LearnProgress } from "@/lib/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function scoreColor(s: number) {
  return s >= 75 ? "#10b981" : s >= 50 ? "#3b82f6" : "#ef4444";
}
function scoreLabel(s: number) {
  return s >= 75 ? "Strong" : s >= 50 ? "Getting there" : "Needs work";
}

function shortDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Mini gauge ──────────────────────────────────────────────────────────────

function MiniGauge({ score }: { score: number }) {
  const r = 34; const sw = 7; const c = 44;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color = scoreColor(score);
  return (
    <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90" aria-hidden="true">
      <circle cx={c} cy={c} r={r} fill="none" stroke="#e2e8f0" strokeWidth={sw} />
      <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth={sw}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
      />
    </svg>
  );
}

// ─── Net worth sparkline ──────────────────────────────────────────────────────

function NetWorthSparkline({ history, currentNetWorth }: { history: Snapshot[]; currentNetWorth: number }) {
  // Use last 7 historical snapshots + today's current value
  const pts = [...history.slice(-7), { netWorth: currentNetWorth, date: "today" } as Snapshot];
  if (pts.length < 2) return null;

  const W = 280; const H = 60; const pad = 4;
  const vals = pts.map((p) => p.netWorth);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;

  const xs = pts.map((_, i) => pad + (i / (pts.length - 1)) * (W - pad * 2));
  const ys = vals.map((v) => H - pad - ((v - min) / range) * (H - pad * 2));
  const line = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  const fill = `${line} L${xs[xs.length - 1]},${H} L${xs[0]},${H} Z`;

  const delta = currentNetWorth - pts[0].netWorth;
  const isUp = delta >= 0;
  const color = isUp ? "#10b981" : "#ef4444";
  const fillId = "nwFill";

  const oldest = pts[0].date !== "today" ? pts[0].date : null;

  return (
    <div className="flex flex-col gap-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" preserveAspectRatio="none" style={{ height: 56 }}>
        <defs>
          <linearGradient id={fillId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={fill} fill={`url(#${fillId})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r="4" fill={color} />
      </svg>
      {oldest && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">{shortDate(oldest)}</span>
          <span className={`inline-flex items-center gap-1 text-xs font-semibold ${isUp ? "text-emerald-600" : "text-red-500"}`}>
            {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {isUp ? "+" : "−"}{formatCurrency(Math.abs(delta))}
          </span>
          <span className="text-xs text-slate-400">Now</span>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter();
  const { inputs, hasCompletedCheckup, hydrated } = useFinancialData();
  const [learnProgress, setLearnProgress] = useState<LearnProgress>({ lessons: {}, xp: 0, weeklyActivity: [] });
  const [learnReady, setLearnReady] = useState(false);
  const [history, setHistory] = useState<Snapshot[]>([]);

  useEffect(() => {
    if (hydrated && !hasCompletedCheckup) router.replace("/checkup");
  }, [hydrated, hasCompletedCheckup, router]);

  const metrics = useMemo(() => (inputs ? calcAllMetrics(inputs) : null), [inputs]);

  useEffect(() => {
    if (!hydrated || !hasCompletedCheckup || !metrics) return;
    // Load learn progress
    setLearnProgress(loadProgress());
    setLearnReady(true);
    // Read history THEN record today's snapshot
    const prior = readHistory();
    recordSnapshot(metrics);
    setHistory(prior);
    track("home_viewed");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, hasCompletedCheckup, !!metrics]);

  if (!hydrated || !inputs || !metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const score = metrics.healthScore;
  const fa = metrics.freedomAge;
  const topAction = metrics.actionPlan.topActions[0];
  const recommended = learnReady ? getRecommendedLesson(metrics.healthScoreBreakdown, learnProgress) : null;
  const levelData = getLevelProgress(learnProgress.xp);
  const streak = learnReady ? getStreak(learnProgress) : 0;

  const freedomDisplay =
    fa.status === "already_reached"
      ? { big: String(inputs.currentAge), sub: "You're free" }
      : fa.status === "normal" && fa.freedomAge !== null
      ? { big: String(fa.freedomAge), sub: `${Math.round(fa.yearsToFreedom!)} yrs away` }
      : { big: "50+", sub: "Let's close this gap" };

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
                <span className="text-xl font-bold leading-none" style={{ color: scoreColor(score) }}>{score}</span>
                <span className="text-[10px] text-slate-500">/100</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-[11px] font-medium text-slate-500">Health score</p>
              <p className="text-sm font-bold" style={{ color: scoreColor(score) }}>{scoreLabel(score)}</p>
            </div>
          </Link>

          {/* Freedom age — centered */}
          <Link
            href="/dashboard"
            className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl p-4 flex flex-col items-center justify-center gap-1 text-center hover:bg-white/80 transition-colors"
          >
            <p className="text-[11px] font-medium text-slate-500">Freedom age</p>
            <p className="text-4xl font-bold text-slate-800 leading-none">{freedomDisplay.big}</p>
            <p className="text-xs text-slate-500 mt-0.5">{freedomDisplay.sub}</p>
          </Link>
        </div>

        {/* #1 Action */}
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
              <Link href="/dashboard" className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800">
                See full plan <ArrowRight size={12} />
              </Link>
              {topAction.lessonId && (
                <Link href={`/learn/${topAction.lessonId}`} className="flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700">
                  <BookOpen size={12} /> Learn why
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Keep learning */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen size={15} className="text-emerald-600 shrink-0" />
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Keep learning</p>
            </div>
            <div className="flex items-center gap-2">
              {streak > 0 && (
                <span className="flex items-center gap-1 text-xs font-semibold text-orange-500">
                  <Flame size={12} /> {streak}w
                </span>
              )}
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                <Zap size={12} /> {levelData.level.name}
              </span>
            </div>
          </div>

          {recommended ? (
            <Link href={`/learn/${recommended.lesson.id}`} className="flex items-start gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-200 transition-colors">
                <BookOpen size={18} className="text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-0.5">{recommended.track.title}</p>
                <p className="text-sm font-semibold text-slate-800 leading-snug group-hover:text-emerald-700 transition-colors">{recommended.lesson.title}</p>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <span>~2 min</span><span>·</span>
                  <span className="flex items-center gap-0.5"><Zap size={10} />{recommended.lesson.xp}+ XP</span>
                </p>
              </div>
              <ArrowRight size={16} className="text-emerald-500 shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <span className="text-lg">🎉</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">All lessons complete</p>
                <Link href="/learn" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">Review them →</Link>
              </div>
            </div>
          )}

          {/* XP bar */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>{learnProgress.xp} XP</span>
              {levelData.nextLevel && (
                <span>{levelData.xpToNextLevel - levelData.xpIntoLevel} XP to {levelData.nextLevel.name}</span>
              )}
            </div>
            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${levelData.pct}%` }} />
            </div>
          </div>
        </div>

        {/* Net worth trend */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Net worth</p>
            <p className="text-base font-bold text-slate-800">{formatCurrency(metrics.netWorth)}</p>
          </div>
          {history.length >= 1 ? (
            <NetWorthSparkline history={history} currentNetWorth={metrics.netWorth} />
          ) : (
            <p className="text-xs text-slate-400 text-center py-3">
              Check back on your next visit to see your progress trend.
            </p>
          )}
        </div>

        {/* Quick nav */}
        <div className="grid grid-cols-2 gap-3">
          <NavCard
            href="/dashboard"
            icon={<LayoutDashboard size={18} className="text-blue-600" />}
            iconBg="bg-blue-100"
            label="Full plan"
            sub="Projections & details"
          />
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

function NavCard({ href, icon, iconBg, label, sub }: {
  href: string; icon: React.ReactNode; iconBg: string; label: string; sub: string;
}) {
  return (
    <Link href={href} className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl p-4 flex items-center gap-3 hover:bg-white/80 transition-colors">
      <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        <p className="text-xs text-slate-500 truncate">{sub}</p>
      </div>
    </Link>
  );
}
