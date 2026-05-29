"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Star, Clock, CheckCircle2, Circle } from "lucide-react";
import { AppNav } from "@/components/AppNav";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { LEARN_MODULES, type LearnTag } from "@/content/learn";

const ALL_TAGS: LearnTag[] = ["Foundation", "Debt", "Investing", "FIRE"];
const LEARN_PROGRESS_KEY = "freedomly_learn_completed";

const TAG_COLORS: Record<LearnTag, string> = {
  Foundation: "bg-sky-100 text-sky-700 border-sky-200",
  Debt: "bg-red-100 text-red-700 border-red-200",
  Investing: "bg-emerald-100 text-emerald-700 border-emerald-200",
  FIRE: "bg-orange-100 text-orange-700 border-orange-200",
};

export default function LearnPage() {
  const [activeFilter, setActiveFilter] = useState<LearnTag | "All">("All");
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  // Load completion progress from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LEARN_PROGRESS_KEY);
      if (raw) setCompletedIds(new Set(JSON.parse(raw) as string[]));
    } catch {
      /* ignore corrupt/unavailable storage */
    }
  }, []);

  function toggleModule(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        next.add(id);
        track("learn_module_opened", { module_id: id });
      }
      return next;
    });
  }

  function toggleComplete(id: string) {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        next.add(id);
        track("learn_module_completed", { module_id: id });
      }
      try {
        localStorage.setItem(LEARN_PROGRESS_KEY, JSON.stringify(Array.from(next)));
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  const filtered =
    activeFilter === "All"
      ? LEARN_MODULES
      : LEARN_MODULES.filter((m) => m.tag === activeFilter);

  const completedCount = LEARN_MODULES.filter((m) => completedIds.has(m.id)).length;
  const totalCount = LEARN_MODULES.length;
  const progressPct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-transparent">
      <AppNav />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Learn</h1>
          <p className="text-sm text-white/50">
            The foundations behind every number on your dashboard.
          </p>
        </div>

        {/* Progress */}
        <div className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl px-5 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Your progress
            </span>
            <span className="text-xs font-medium text-slate-600">
              {completedCount} of {totalCount} completed
            </span>
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex gap-2 flex-wrap" role="group" aria-label="Filter by topic">
          {(["All", ...ALL_TAGS] as const).map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              className={cn(
                "px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all duration-150",
                activeFilter === tag
                  ? "bg-white/20 text-white border-white/40 shadow-sm"
                  : "bg-white/10 border-white/15 text-white/60 hover:text-white hover:border-white/30"
              )}
            >
              {tag}
              {tag !== "All" && (
                <span className="ml-1.5 text-slate-500">
                  {LEARN_MODULES.filter((m) => m.tag === tag).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Module cards */}
        <div className="flex flex-col gap-3">
          {filtered.map((module) => {
            const isOpen = openIds.has(module.id);
            const isCompleted = completedIds.has(module.id);
            return (
              <article
                key={module.id}
                className={cn(
                  "bg-white/70 backdrop-blur-sm border shadow-sm rounded-2xl overflow-hidden transition-colors",
                  isCompleted ? "border-emerald-300 ring-1 ring-emerald-200" : "border-white/60"
                )}
              >
                {/* Card header — always visible */}
                <div className="flex items-stretch">
                  {/* Completion toggle (separate button — not nested in the expand button) */}
                  <button
                    onClick={() => toggleComplete(module.id)}
                    className="pl-5 sm:pl-6 pr-1 flex items-center shrink-0 group/check"
                    aria-pressed={isCompleted}
                    aria-label={isCompleted ? "Mark as not completed" : "Mark as completed"}
                    title={isCompleted ? "Completed — click to undo" : "Mark as completed"}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={22} className="text-emerald-500" />
                    ) : (
                      <Circle
                        size={22}
                        className="text-slate-300 group-hover/check:text-emerald-400 transition-colors"
                      />
                    )}
                  </button>

                  {/* Expand/collapse */}
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="flex-1 min-w-0 text-left pl-3 pr-5 py-4 sm:py-5 flex items-start justify-between gap-4 hover:bg-white/40 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <div className="flex flex-col gap-2 min-w-0">
                      {/* Badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                            TAG_COLORS[module.tag]
                          )}
                        >
                          {module.tag}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock size={10} />
                          {module.readTime} min
                        </span>
                        {isCompleted && (
                          <span className="text-xs font-medium text-emerald-600">Completed</span>
                        )}
                      </div>
                      {/* Title */}
                      <h2 className="text-sm sm:text-base font-semibold text-slate-800 leading-snug">
                        {module.title}
                      </h2>
                    </div>
                    <ChevronDown
                      size={16}
                      className={cn(
                        "text-slate-400 shrink-0 mt-1 transition-transform duration-300",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                </div>

                {/* Expandable content */}
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                  )}
                  aria-hidden={!isOpen}
                >
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 border-t border-slate-200">
                    {/* Paragraphs */}
                    <div className="flex flex-col gap-4 pt-5">
                      {module.paragraphs.map((para, i) => (
                        <p
                          key={i}
                          className="text-sm text-slate-500 leading-relaxed"
                        >
                          {para}
                        </p>
                      ))}
                    </div>

                    {/* Key takeaway */}
                    <div className="mt-5 bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 flex gap-3">
                      <Star
                        size={14}
                        className="text-emerald-600 shrink-0 mt-0.5"
                        fill="currentColor"
                      />
                      <div>
                        <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1.5">
                          Key takeaway
                        </p>
                        <p className="text-xs text-emerald-800 leading-relaxed">
                          {module.keyTakeaway}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600">No modules in this category yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
