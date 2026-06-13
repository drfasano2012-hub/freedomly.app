"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, CheckCircle2, Lock, Zap, Flame } from "lucide-react";
import { AppNav } from "@/components/AppNav";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { TRACKS, LESSONS, getLessonsByTrack } from "@/content/lessons";
import {
  loadProgress,
  getLevel,
  getLevelProgress,
  getStreak,
  getTrackCompletionCount,
} from "@/lib/learn-progress";
import { useFinancialData } from "@/hooks/useFinancialData";
import { calcAllMetrics } from "@/lib/calculations";
import { getRecommendedLesson } from "@/lib/learn-progress";
import type { LearnProgress } from "@/lib/types";

export default function LearnPage() {
  const { inputs, hydrated } = useFinancialData();
  const [progress, setProgress] = useState<LearnProgress>({
    lessons: {},
    xp: 0,
    weeklyActivity: [],
  });
  const [learnHydrated, setLearnHydrated] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setLearnHydrated(true);
  }, []);

  const metrics = hydrated && inputs ? calcAllMetrics(inputs) : null;
  const recommended =
    metrics
      ? getRecommendedLesson(metrics.healthScoreBreakdown, progress)
      : getRecommendedLesson(
          { savingsRatePoints: 0, emergencyFundPoints: 0, debtPoints: 0, investingPoints: 0 },
          progress
        );

  const levelData = getLevelProgress(progress.xp);
  const streak = getStreak(progress);
  const totalLessons = LESSONS.length;
  const completedCount = Object.keys(progress.lessons).length;

  return (
    <div className="min-h-screen bg-transparent page-in">
      <AppNav />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Freedomly Learn</h1>
          <p className="text-sm text-white/50">
            Short lessons that explain every number on your dashboard — and what to do about it.
          </p>
        </div>

        {/* Progress bar + level + streak */}
        {!learnHydrated ? (
          <div className="skeleton rounded-2xl h-20" />
        ) : (
        <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl px-5 py-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={15} className="text-emerald-600" />
              <span className="text-sm font-bold text-slate-800">{levelData.level.name}</span>
              <span className="text-xs text-slate-500">{progress.xp} XP</span>
            </div>
            <div className="flex items-center gap-3">
              {streak > 0 && (
                <div className="flex items-center gap-1 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded-full px-2.5 py-1">
                  <Flame size={12} />
                  {streak} week streak
                </div>
              )}
              <span className="text-xs text-slate-500">
                {completedCount}/{totalLessons} lessons
              </span>
            </div>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${levelData.nextLevel ? levelData.pct : 100}%` }}
            />
          </div>
          {levelData.nextLevel && (
            <p className="text-xs text-slate-400">
              {levelData.xpToNextLevel - levelData.xpIntoLevel} XP to <span className="font-medium text-slate-600">{levelData.nextLevel.name}</span>
            </p>
          )}
        </div>
        )}

        {/* Recommended next lesson */}
        {recommended && (
          <section className="flex flex-col gap-2">
            <h2 className="text-xs font-semibold text-white/65 uppercase tracking-wider px-1">
              Up next for you
            </h2>
            <Link
              href={`/learn/${recommended.lesson.id}`}
              onClick={() => track("lesson_opened", { lesson_id: recommended.lesson.id, track_id: recommended.lesson.trackId })}
              className="block bg-white/80 backdrop-blur-sm border border-emerald-200 shadow-lg ring-1 ring-emerald-100 rounded-2xl p-5 hover:ring-2 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                      {recommended.track.title} · Lesson {recommended.lesson.order}
                    </span>
                  </div>
                  <p className="text-base font-bold text-slate-900 leading-snug">
                    {recommended.lesson.title}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <BookOpen size={11} />
                      ~2 min
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap size={11} />
                      {recommended.lesson.xp}+ XP
                    </span>
                  </div>
                </div>
                <div className="shrink-0 w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                  <ArrowRight size={20} className="text-emerald-600" />
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Tracks */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold text-white/65 uppercase tracking-wider px-1">
            All tracks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TRACKS.map((track_) => {
              const trackLessons = getLessonsByTrack(track_.id);
              const completed = getTrackCompletionCount(track_.id, progress);
              const allDone = completed === trackLessons.length;
              const nextLesson = trackLessons.find((l) => !progress.lessons[l.id]);

              return (
                <div
                  key={track_.id}
                  className={cn(
                    "bg-white/70 backdrop-blur-sm border shadow-sm rounded-2xl p-5 flex flex-col gap-4",
                    allDone
                      ? "border-emerald-300 ring-1 ring-emerald-200"
                      : "border-white/60"
                  )}
                >
                  {/* Track header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{track_.badge}</span>
                        <span className="text-sm font-bold text-slate-900">{track_.title}</span>
                        {allDone && (
                          <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{track_.description}</p>
                    </div>
                  </div>

                  {/* Lesson list */}
                  <div className="flex flex-col gap-1.5">
                    {trackLessons.map((lesson, i) => {
                      const isDone = !!progress.lessons[lesson.id];
                      const isUnlocked = i === 0 || !!progress.lessons[trackLessons[i - 1].id];
                      const isNext = !isDone && isUnlocked;

                      return (
                        <div key={lesson.id}>
                          {isUnlocked ? (
                            <Link
                              href={`/learn/${lesson.id}`}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-xl border text-xs transition-colors",
                                isDone
                                  ? "border-emerald-200 bg-emerald-50/60 text-slate-500"
                                  : isNext
                                  ? "border-emerald-300 bg-emerald-50 text-slate-700 font-medium hover:border-emerald-400"
                                  : "border-slate-200 bg-white/60 text-slate-600 hover:border-slate-300"
                              )}
                            >
                              {isDone ? (
                                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                              ) : (
                                <div className={cn(
                                  "w-3.5 h-3.5 rounded-full border-2 shrink-0",
                                  isNext ? "border-emerald-400" : "border-slate-300"
                                )} />
                              )}
                              <span className="flex-1 truncate">{lesson.title}</span>
                              {isNext && <ArrowRight size={12} className="text-emerald-500 shrink-0" />}
                            </Link>
                          ) : (
                            <div className="flex items-center gap-3 px-3 py-2 rounded-xl border border-slate-100 bg-slate-50/50 text-xs text-slate-400 cursor-not-allowed">
                              <Lock size={12} className="shrink-0" />
                              <span className="flex-1 truncate">{lesson.title}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Track CTA */}
                  {nextLesson && (
                    <Link
                      href={`/learn/${nextLesson.id}`}
                      className="flex items-center justify-center gap-2 h-9 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-xs transition-colors"
                    >
                      {completed === 0 ? "Start track" : "Continue"}
                      <ArrowRight size={14} />
                    </Link>
                  )}
                  {allDone && (
                    <div className="flex items-center justify-center gap-2 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                      {track_.badge} Track complete!
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
