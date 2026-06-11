import type { LearnProgress, LessonRecord, Level, TrackId, HealthScoreBreakdown } from "./types";
import { LESSONS, TRACKS } from "@/content/lessons";

const PROGRESS_KEY = "freedomly_learn_progress";

export const LEVELS: Level[] = [
  { name: "Aware", minXp: 0 },
  { name: "Grounded", minXp: 100 },
  { name: "Building", minXp: 300 },
  { name: "Optimizing", minXp: 700 },
  { name: "Free", minXp: 1500 },
];

const XP_LESSON = 50;
const XP_QUIZ_BONUS = 25;
const XP_TRACK_BONUS = 200;
const XP_ACTION = 100;

// ─── ISO week string (e.g. "2026-W23") ───────────────────────────────────────

function isoWeek(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function currentWeek(): string {
  return isoWeek(new Date());
}

// ─── Storage ─────────────────────────────────────────────────────────────────

export function loadProgress(): LearnProgress {
  if (typeof window === "undefined") return emptyProgress();
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) return JSON.parse(raw) as LearnProgress;
  } catch {
    /* ignore */
  }
  return emptyProgress();
}

function emptyProgress(): LearnProgress {
  return { lessons: {}, xp: 0, weeklyActivity: [] };
}

function saveProgress(p: LearnProgress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

// ─── Completing a lesson ──────────────────────────────────────────────────────

export function completeLesson(
  lessonId: string,
  quizCorrect: boolean
): { xpEarned: number; newProgress: LearnProgress } {
  const progress = loadProgress();

  // Don't re-award XP if already completed
  const alreadyDone = !!progress.lessons[lessonId];
  if (alreadyDone) {
    return { xpEarned: 0, newProgress: progress };
  }

  let xpEarned = XP_LESSON;
  if (quizCorrect) xpEarned += XP_QUIZ_BONUS;

  // Track bonus: check if this completes the track
  const lesson = LESSONS.find((l) => l.id === lessonId);
  if (lesson) {
    const trackLessons = LESSONS.filter((l) => l.trackId === lesson.trackId);
    const alreadyCompletedInTrack = trackLessons.filter(
      (l) => l.id !== lessonId && !!progress.lessons[l.id]
    );
    if (alreadyCompletedInTrack.length === trackLessons.length - 1) {
      // This is the last lesson in the track
      xpEarned += XP_TRACK_BONUS;
    }
  }

  const record: LessonRecord = {
    completedAt: new Date().toISOString(),
    quizCorrect,
  };

  const week = currentWeek();
  const weeklyActivity = progress.weeklyActivity.includes(week)
    ? progress.weeklyActivity
    : [...progress.weeklyActivity, week];

  const newProgress: LearnProgress = {
    lessons: { ...progress.lessons, [lessonId]: record },
    xp: progress.xp + xpEarned,
    weeklyActivity,
  };

  saveProgress(newProgress);
  return { xpEarned, newProgress };
}

// ─── Awarding XP for completing a linked Next Move ───────────────────────────

export function awardActionXp(actionId: string): number {
  const linked = LESSONS.find((l) => l.relatedActionId === actionId);
  if (!linked) return 0;

  const progress = loadProgress();
  const week = currentWeek();
  const weeklyActivity = progress.weeklyActivity.includes(week)
    ? progress.weeklyActivity
    : [...progress.weeklyActivity, week];

  const newProgress: LearnProgress = {
    ...progress,
    xp: progress.xp + XP_ACTION,
    weeklyActivity,
  };
  saveProgress(newProgress);
  return XP_ACTION;
}

// ─── Level & streak derivation ────────────────────────────────────────────────

export function getLevel(xp: number): Level {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.minXp) current = level;
  }
  return current;
}

export function getLevelProgress(xp: number): {
  level: Level;
  nextLevel: Level | null;
  xpIntoLevel: number;
  xpToNextLevel: number;
  pct: number;
} {
  const levelIndex = LEVELS.findLastIndex((l) => xp >= l.minXp);
  const level = LEVELS[levelIndex];
  const nextLevel = LEVELS[levelIndex + 1] ?? null;

  if (!nextLevel) {
    return { level, nextLevel: null, xpIntoLevel: xp - level.minXp, xpToNextLevel: 0, pct: 100 };
  }

  const xpIntoLevel = xp - level.minXp;
  const xpToNextLevel = nextLevel.minXp - level.minXp;
  const pct = Math.round((xpIntoLevel / xpToNextLevel) * 100);

  return { level, nextLevel, xpIntoLevel, xpToNextLevel, pct };
}

export function getStreak(progress: LearnProgress): number {
  if (progress.weeklyActivity.length === 0) return 0;
  const sorted = [...progress.weeklyActivity].sort().reverse();
  const thisWeek = currentWeek();

  // Streak counts if activity in current week OR last week (grace window)
  let streak = 0;
  let expected = sorted[0] === thisWeek ? thisWeek : sorted[0];

  for (const week of sorted) {
    if (week === expected) {
      streak++;
      expected = prevWeek(expected);
    } else {
      break;
    }
  }
  return streak;
}

function prevWeek(isoWeekStr: string): string {
  const [yearStr, weekStr] = isoWeekStr.split("-W");
  const year = parseInt(yearStr, 10);
  const week = parseInt(weekStr, 10);
  if (week > 1) return `${year}-W${String(week - 1).padStart(2, "0")}`;
  // Wrap to previous year (last week of prior year)
  const dec31 = new Date(year - 1, 11, 31);
  return isoWeek(dec31);
}

// ─── Recommendation engine ───────────────────────────────────────────────────

export function getRecommendedLesson(
  breakdown: HealthScoreBreakdown,
  progress: LearnProgress
): { lesson: typeof LESSONS[number]; track: typeof TRACKS[number] } | null {
  // Rank tracks by score gap (largest gap = highest priority)
  const gaps: { trackId: TrackId; gap: number }[] = TRACKS.map((t) => ({
    trackId: t.id,
    gap: 25 - breakdown[t.pillarKey],
  }));
  gaps.sort((a, b) => b.gap - a.gap);

  for (const { trackId } of gaps) {
    const trackLessons = LESSONS.filter((l) => l.trackId === trackId).sort(
      (a, b) => a.order - b.order
    );
    const nextLesson = trackLessons.find((l) => !progress.lessons[l.id]);
    if (nextLesson) {
      const track = TRACKS.find((t) => t.id === trackId)!;
      return { lesson: nextLesson, track };
    }
  }

  // All lessons complete — return null
  return null;
}

export function getTrackCompletionCount(trackId: string, progress: LearnProgress): number {
  return LESSONS.filter((l) => l.trackId === trackId && !!progress.lessons[l.id]).length;
}
