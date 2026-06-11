"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Zap, BookOpen } from "lucide-react";
import Link from "next/link";
import { AppNav } from "@/components/AppNav";
import { cn } from "@/lib/utils";
import { getLessonById, getTrackById } from "@/content/lessons";
import { completeLesson, loadProgress, getLevelProgress } from "@/lib/learn-progress";
import { track } from "@/lib/analytics";
import type { LearnProgress } from "@/lib/types";

type PlayerPhase =
  | { type: "card"; index: number }
  | { type: "quiz" }
  | { type: "result"; correct: boolean }
  | { type: "complete"; xpEarned: number; newProgress: LearnProgress };

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.lessonId as string;

  const lesson = getLessonById(lessonId);
  const trackData = lesson ? getTrackById(lesson.trackId) : undefined;

  const [phase, setPhase] = useState<PlayerPhase>({ type: "card", index: 0 });
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  useEffect(() => {
    if (lesson) {
      const progress = loadProgress();
      setAlreadyCompleted(!!progress.lessons[lesson.id]);
      track("lesson_opened", { lesson_id: lesson.id, track_id: lesson.trackId });
    }
  }, [lesson]);

  if (!lesson || !trackData) {
    return (
      <div className="min-h-screen bg-transparent">
        <AppNav />
        <main className="max-w-xl mx-auto px-4 py-16 text-center">
          <p className="text-white/60 text-sm">Lesson not found.</p>
          <Link href="/learn" className="mt-4 inline-block text-sm text-emerald-400 hover:text-emerald-300">
            ← Back to Learn
          </Link>
        </main>
      </div>
    );
  }

  const totalCards = lesson.cards.length;

  function nextCard() {
    if (phase.type !== "card") return;
    if (phase.index < totalCards - 1) {
      setPhase({ type: "card", index: phase.index + 1 });
    } else {
      setPhase({ type: "quiz" });
    }
  }

  function prevCard() {
    if (phase.type !== "card" || phase.index === 0) return;
    setPhase({ type: "card", index: phase.index - 1 });
  }

  function submitQuiz() {
    if (selectedOption === null || !lesson) return;
    const correct = selectedOption === lesson.quickCheck.correctIndex;
    setPhase({ type: "result", correct });
  }

  function finishLesson(correct: boolean) {
    if (!lesson) return;
    const { xpEarned, newProgress } = completeLesson(lesson.id, correct);
    track("lesson_completed", {
      lesson_id: lesson.id,
      track_id: lesson.trackId,
      quiz_correct: correct,
      xp_earned: xpEarned,
    });
    setPhase({ type: "complete", xpEarned, newProgress });
  }

  const progressDots = (currentIndex: number) => (
    <div className="flex items-center gap-1.5" aria-hidden="true">
      {lesson.cards.map((_, i) => (
        <div
          key={i}
          className={cn(
            "rounded-full transition-all duration-300",
            i < currentIndex
              ? "w-2 h-2 bg-emerald-400"
              : i === currentIndex
              ? "w-3 h-2 bg-white"
              : "w-2 h-2 bg-white/20"
          )}
        />
      ))}
      <div className={cn(
        "rounded-full transition-all duration-300 w-2 h-2",
        phase.type === "quiz" || phase.type === "result"
          ? "bg-emerald-400"
          : "bg-white/20"
      )} />
    </div>
  );

  // ── Card phase ──────────────────────────────────────────────────────────────
  if (phase.type === "card") {
    const card = lesson.cards[phase.index];
    const isLast = phase.index === totalCards - 1;

    return (
      <div className="min-h-screen bg-transparent flex flex-col">
        <AppNav />
        <main className="flex-1 max-w-xl mx-auto w-full px-4 py-6 flex flex-col gap-5">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <Link
              href="/learn"
              className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="text-xs">{trackData.title}</span>
            </Link>
            {progressDots(phase.index)}
          </div>

          {/* Card */}
          <div className="bg-white/80 backdrop-blur-sm border border-white/60 shadow-lg rounded-2xl p-6 flex-1 flex flex-col gap-4">
            {card.heading && (
              <h2 className="text-base font-bold text-slate-900 leading-snug">{card.heading}</h2>
            )}
            <p className="text-sm text-slate-600 leading-relaxed flex-1">{card.body}</p>
          </div>

          {/* Nav buttons */}
          <div className="flex gap-3">
            {phase.index > 0 && (
              <button
                onClick={prevCard}
                className="flex items-center justify-center w-12 h-12 rounded-xl border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors shrink-0"
                aria-label="Previous card"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <button
              onClick={nextCard}
              className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm transition-colors"
            >
              {isLast ? "Check your understanding" : "Next"}
              <ArrowRight size={18} />
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ── Quiz phase ──────────────────────────────────────────────────────────────
  if (phase.type === "quiz") {
    return (
      <div className="min-h-screen bg-transparent flex flex-col">
        <AppNav />
        <main className="flex-1 max-w-xl mx-auto w-full px-4 py-6 flex flex-col gap-5">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setPhase({ type: "card", index: totalCards - 1 })}
              className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white/80 transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="text-xs">Back</span>
            </button>
            {progressDots(totalCards)}
          </div>

          {/* Quiz card */}
          <div className="bg-white/80 backdrop-blur-sm border border-white/60 shadow-lg rounded-2xl p-6 flex flex-col gap-5">
            <div>
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">
                Quick check
              </p>
              <p className="text-sm font-semibold text-slate-900 leading-snug">
                {lesson.quickCheck.question}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {lesson.quickCheck.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedOption(i)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors",
                    selectedOption === i
                      ? "border-emerald-400 bg-emerald-50 text-emerald-900 font-medium"
                      : "border-slate-200 bg-white/60 text-slate-700 hover:border-slate-300 hover:bg-white/80"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={submitQuiz}
            disabled={selectedOption === null}
            className="h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
          >
            Submit answer
          </button>
        </main>
      </div>
    );
  }

  // ── Result phase ─────────────────────────────────────────────────────────────
  if (phase.type === "result") {
    const { correct } = phase;
    return (
      <div className="min-h-screen bg-transparent flex flex-col">
        <AppNav />
        <main className="flex-1 max-w-xl mx-auto w-full px-4 py-6 flex flex-col gap-5">
          {/* Result card */}
          <div
            className={cn(
              "bg-white/80 backdrop-blur-sm border shadow-lg rounded-2xl p-6 flex flex-col gap-4",
              correct ? "border-emerald-300" : "border-amber-300"
            )}
          >
            <div className="flex items-center gap-3">
              {correct ? (
                <CheckCircle2 size={28} className="text-emerald-500 shrink-0" />
              ) : (
                <XCircle size={28} className="text-amber-500 shrink-0" />
              )}
              <p className="text-sm font-bold text-slate-900">
                {correct ? "That's right!" : "Not quite — here's why:"}
              </p>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {lesson.quickCheck.explanation}
            </p>
            {!correct && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p className="text-xs font-semibold text-slate-600 mb-1">The answer:</p>
                <p className="text-sm text-slate-700">
                  {lesson.quickCheck.options[lesson.quickCheck.correctIndex]}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => finishLesson(correct)}
            className="h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            {alreadyCompleted ? "Back to Learn" : `Finish lesson${correct ? " — claim XP" : ""}`}
            <ArrowRight size={18} />
          </button>
        </main>
      </div>
    );
  }

  // ── Complete phase ───────────────────────────────────────────────────────────
  if (phase.type === "complete") {
    const { xpEarned, newProgress } = phase;
    const levelData = getLevelProgress(newProgress.xp);

    return (
      <div className="min-h-screen bg-transparent flex flex-col">
        <AppNav />
        <main className="flex-1 max-w-xl mx-auto w-full px-4 py-8 flex flex-col gap-6">
          {/* Completion card */}
          <div className="bg-white/80 backdrop-blur-sm border border-emerald-200 shadow-lg rounded-2xl p-6 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <BookOpen size={32} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">Lesson complete</p>
              <p className="text-sm text-slate-500 mt-1">{lesson.title}</p>
            </div>

            {xpEarned > 0 && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2">
                <Zap size={16} className="text-emerald-600" />
                <span className="text-sm font-bold text-emerald-700">+{xpEarned} XP earned</span>
              </div>
            )}

            {alreadyCompleted && (
              <p className="text-xs text-slate-400">
                (You had already completed this lesson — no additional XP this time)
              </p>
            )}

            {/* Level progress */}
            <div className="w-full border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                <span className="font-semibold text-slate-700">{levelData.level.name}</span>
                {levelData.nextLevel && (
                  <span>{levelData.xpIntoLevel} / {levelData.xpToNextLevel} XP → {levelData.nextLevel.name}</span>
                )}
                {!levelData.nextLevel && (
                  <span className="text-emerald-600 font-semibold">Max level reached! 🏆</span>
                )}
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${levelData.pct}%` }}
                />
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            {lesson.relatedActionId && (
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm transition-colors"
              >
                Put this into practice
                <ArrowRight size={18} />
              </Link>
            )}
            <Link
              href="/learn"
              className="flex items-center justify-center gap-2 h-12 rounded-xl border border-white/20 text-white/80 hover:text-white hover:border-white/40 font-semibold text-sm transition-colors"
            >
              Back to Learn
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return null;
}
