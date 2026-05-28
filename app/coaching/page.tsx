"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AppNav } from "@/components/AppNav";
import { cn } from "@/lib/utils";
import {
  INSIGHT_CARDS,
  FRAMEWORK_PILLARS,
  PRINCIPLES,
  COMMON_MISTAKES,
} from "@/content/coaching";

// ─── Expandable card ──────────────────────────────────────────────────────────

function ExpandableCard({
  title,
  content,
  prefix,
  destructive,
}: {
  title: string;
  content: string;
  prefix?: string;
  destructive?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "rounded-2xl border overflow-hidden transition-colors",
        destructive
          ? "bg-red-50/80 border-red-200"
          : "bg-white/70 backdrop-blur-sm border-white/60 shadow-sm"
      )}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-black/[0.04] transition-colors"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3 min-w-0">
          {prefix && (
            <span
              className={cn(
                "text-sm font-bold shrink-0 font-mono",
                destructive ? "text-red-700" : "text-slate-500"
              )}
            >
              {prefix}
            </span>
          )}
          <span
            className={cn(
              "text-sm font-semibold",
              destructive ? "text-red-600" : "text-slate-700"
            )}
          >
            {title}
          </span>
        </div>
        <ChevronDown
          size={15}
          className={cn(
            "shrink-0 transition-transform duration-300",
            open ? "rotate-180" : "",
            destructive ? "text-red-700" : "text-slate-400"
          )}
        />
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          open ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div
          className={cn(
            "px-5 pb-5 border-t text-sm leading-relaxed",
            destructive
              ? "border-red-200 text-red-700 pt-4"
              : "border-slate-200 text-slate-600 pt-4"
          )}
        >
          {content}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CoachingPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <AppNav />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-10">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Coaching</h1>
          <p className="text-sm text-white/70">
            The philosophy and principles behind Freedomly&rsquo;s approach to money.
          </p>
        </div>

        {/* ── Direct from the Coach ── */}
        <section className="flex flex-col gap-4">
          <SectionHeader>Direct from the Coach</SectionHeader>

          <div className="flex flex-col gap-4">
            {INSIGHT_CARDS.map((card) => (
              <div
                key={card.principle}
                className="bg-white/80 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl overflow-hidden flex"
              >
                {/* Emerald left accent bar */}
                <div className="w-1 shrink-0 bg-emerald-500 rounded-l-2xl" />

                <div className="flex flex-col gap-3 px-5 py-5 flex-1">
                  {/* Principle label */}
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                    {card.principle}
                  </p>
                  {/* Quote */}
                  <p className="text-base sm:text-lg font-semibold text-slate-800 leading-snug">
                    &ldquo;{card.quote}&rdquo;
                  </p>
                  {/* Expansion */}
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {card.expansion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── The Framework ── */}
        <section className="flex flex-col gap-4">
          <SectionHeader>The Framework</SectionHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FRAMEWORK_PILLARS.map((pillar) => (
              <div
                key={pillar.number}
                className="bg-white/70 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl p-5 flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-sm font-bold text-emerald-700 shrink-0">
                    {pillar.number}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-800">
                    {pillar.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Principles ── */}
        <section className="flex flex-col gap-3">
          <SectionHeader>Principles</SectionHeader>

          {PRINCIPLES.map((p) => (
            <ExpandableCard
              key={p.number}
              prefix={p.number}
              title={p.title}
              content={p.content}
            />
          ))}
        </section>

        {/* ── Common Mistakes ── */}
        <section className="flex flex-col gap-3">
          <SectionHeader>Common Mistakes</SectionHeader>
          <p className="text-xs text-white/70 -mt-1">
            The patterns that silently cost people years of progress.
          </p>

          {COMMON_MISTAKES.map((m) => (
            <ExpandableCard
              key={m.title}
              title={m.title}
              content={m.content}
              destructive
            />
          ))}
        </section>
      </main>
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold text-white/80 uppercase tracking-wider px-1">
      {children}
    </h2>
  );
}
