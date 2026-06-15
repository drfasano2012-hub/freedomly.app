/**
 * Freedomly — analytics.ts
 * Single gate for all product analytics (PostHog).
 *
 * RULES (see ANALYTICS.md):
 *   - NEVER pass raw financial values (income, net worth, balances, debt $) here.
 *     Events + coarse buckets ONLY. This wrapper is where we keep that promise.
 *   - Every tracked event name must be in the AnalyticsEvent union below, so the
 *     taxonomy stays intentional and greppable.
 *   - Safe no-op if PostHog isn't loaded (e.g. no key set, or SSR), so the app
 *     never breaks because of analytics.
 */

import posthog from "posthog-js";

/** The full event taxonomy. Add new events here first. */
export type AnalyticsEvent =
  // acquisition / activation
  | "checkup_started"
  | "sample_data_used"
  | "checkup_step_completed"
  | "checkup_completed"
  | "dashboard_viewed"
  // engagement
  | "tool_opened"
  | "freedom_age_slider_used"
  | "learn_module_opened"
  | "learn_module_completed"
  | "action_step_expanded"
  | "action_completed"
  | "milestone_reached"
  | "plan_sharpened"
  | "checkup_edited"
  | "home_simulator_used"
  // learn system
  | "lesson_opened"
  | "lesson_completed"
  | "home_viewed";

/** Property values we allow — primitives only, no objects/PII blobs. */
type SafeProps = Record<string, string | number | boolean | undefined>;

function isLoaded(): boolean {
  return typeof window !== "undefined" && posthog.__loaded === true;
}

/**
 * Track a product event. Safe no-op if PostHog isn't initialized.
 * Do NOT pass dollar amounts or other financial PII in `props`.
 */
export function track(event: AnalyticsEvent, props?: SafeProps): void {
  if (!isLoaded()) return;
  posthog.capture(event, props);
}

/** Call once a user authenticates (Phase 1+). */
export function identify(distinctId: string): void {
  if (!isLoaded()) return;
  posthog.identify(distinctId);
}

/** Call on logout to reset the distinct id. */
export function resetAnalytics(): void {
  if (!isLoaded()) return;
  posthog.reset();
}
