"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, Zap, Flame } from "lucide-react";
import {
  loadProgress,
  getLevelProgress,
  getStreak,
  getRecommendedLesson,
} from "@/lib/learn-progress";
import type { HealthScoreBreakdown, LearnProgress } from "@/lib/types";

interface Props {
  breakdown: HealthScoreBreakdown;
}

export function ContinueLearningCard({ breakdown }: Props) {
  const [progress, setProgress] = useState<LearnProgress>({
    lessons: {},
    xp: 0,
    weeklyActivity: [],
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  const recommended = getRecommendedLesson(breakdown, progress);
  const levelData = getLevelProgress(progress.xp);
  const streak = getStreak(progress);

  // If all lessons complete, show a compact completion state
  if (!recommended) {
    return (
      <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
          <BookOpen size={20} className="text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800">All lessons complete 🎉</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {levelData.level.name} · {progress.xp} XP
          </p>
        </div>
        <Link
          href="/learn"
          className="shrink-0 text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
        >
          Review <ArrowRight size={13} />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
          Keep learning
        </p>
        <div className="flex items-center gap-2">
          {streak > 0 && (
            <div className="flex items-center gap-1 text-xs font-semibold text-orange-500">
              <Flame size={12} />
              {streak}w streak
            </div>
          )}
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
            <Zap size={12} />
            {levelData.level.name}
          </div>
        </div>
      </div>

      {/* Lesson CTA */}
      <Link
        href={`/learn/${recommended.lesson.id}`}
        className="flex items-start gap-4 group"
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-200 transition-colors">
          <BookOpen size={20} className="text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-0.5">
            {recommended.track.title}
          </p>
          <p className="text-sm font-semibold text-slate-800 leading-snug group-hover:text-emerald-700 transition-colors">
            {recommended.lesson.title}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
            <span>~2 min</span>
            <span>·</span>
            <span className="flex items-center gap-0.5">
              <Zap size={10} />
              {recommended.lesson.xp}+ XP
            </span>
          </p>
        </div>
        <ArrowRight
          size={18}
          className="text-emerald-500 shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform"
        />
      </Link>

      {/* XP progress bar */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>{progress.xp} XP</span>
          {levelData.nextLevel && (
            <span>{levelData.nextLevel.name} in {levelData.xpToNextLevel - levelData.xpIntoLevel} XP</span>
          )}
        </div>
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${levelData.pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
