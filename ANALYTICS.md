# Freedomly — Analytics & Experimentation Plan

How we measure usage and run A/B tests. Tool: **PostHog** (product analytics +
session replay + feature flags + experiments + surveys, one SDK, generous free tier).

> ⚠️ **Finance-app privacy rule (non-negotiable):** never send raw financial
> values (income, net worth, balances) to analytics. Track *events* and coarse
> *buckets* only. Keep PostHog session-replay input masking ON. Use consent-aware
> capture.

---

## Why PostHog
- One tool covers analytics **and** A/B testing (experiments run on feature flags) —
  no second vendor.
- Free tier is large; EU/self-host options fit a finance product.
- First-class Next.js support.

---

## Setup (Phase 1)

1. Create a PostHog account → copy the **project API key** + **host**.
2. Install: `npm install posthog-js`
3. Add env vars (first env vars in the project — **update `DEPLOYMENT.md`**):
   - `NEXT_PUBLIC_POSTHOG_KEY` (public key)
   - `NEXT_PUBLIC_POSTHOG_HOST` (e.g. `https://us.i.posthog.com`)
   - Set in Vercel (Production) and `.env.local` for dev.
4. `app/providers.tsx` — client PostHog provider; init with key/host; capture
   pageviews on App Router route changes (SPA navigations need manual `$pageview`).
   Wrap `app/layout.tsx` in it.
5. `lib/analytics.ts` — a thin `track(event, props?)` wrapper so **every** event
   goes through one place. This is where we enforce "no raw financial values" and
   can disable/swap analytics globally.
6. Once auth ships, call `posthog.identify(userId)` at login; until then, anonymous
   distinct IDs are fine.

---

## Event taxonomy (what to track)

Tie events to the funnel. Names are `snake_case`, past-tense.

**Acquisition / activation**
- `landing_viewed`
- `checkup_started`
- `sample_data_used`
- `checkup_step_completed` — `{ step: 1–5 }`
- `checkup_completed`  ← **activation event**
- `dashboard_viewed`

**Engagement**
- `tool_opened` — `{ tool: "coast_fire" | "compound_growth" }`
- `freedom_age_slider_used`
- `learn_module_opened` — `{ module_id }`
- `checkup_edited`  ← return-engagement signal

**Phase 1+ (after auth / tracking / coaching)**
- `signup_started`, `signed_up`
- `networth_snapshot_created`
- `badge_earned` — `{ badge_id }`
- `dashboard_exported` — `{ format: "pdf" }`
- `checkin_email_clicked`
- `coach_invite_sent`, `coach_viewed_client`, `comment_added`

> If a bucket is ever needed, use coarse bands (e.g. `net_worth_band: "50k_100k"`),
> never the exact figure.

---

## Funnels to build in PostHog
1. **Activation:** `landing_viewed → checkup_started → checkup_completed → dashboard_viewed`
2. **Tool engagement:** `dashboard_viewed → tool_opened`
3. **Learn engagement:** `dashboard_viewed → learn_module_opened`
4. **(Phase 1+) Conversion:** `checkup_completed → signed_up → networth_snapshot_created (return)`

Watch: activation rate (checkup_completed / landing_viewed) and return rate.

---

## A/B testing (PostHog Experiments)

Experiments run on **feature flags**. Gate UI with `useFeatureFlagEnabled()` /
`posthog.getFeatureFlag()`; PostHog assigns variants and computes significance.

### How to run one (the discipline)
1. **One hypothesis, one primary metric**, written down *before* you start.
2. Create the experiment in PostHog (control + variant), set the **primary metric**
   to a funnel event.
3. Gate the variant UI on the flag.
4. **Run full weeks** (avoid day-of-week bias). **Don't peek-and-stop** — wait for
   PostHog to reach significance.
5. Ship the winner, remove the flag, log the result (see Experiment Log below).

### First 3 experiments (highest leverage for an early product)
| # | Hypothesis | Primary metric |
|---|-----------|----------------|
| 1 | A benefit-driven landing CTA ("See your freedom number in 5 min") beats the current CTA | `checkup_started` rate |
| 2 | Making "Try sample data" prominent raises activation | `checkup_completed` rate |
| 3 | Leading the dashboard with Freedom Age (vs. Health Score) increases engagement/return | `tool_opened` / return rate |

### Guardrails
- One primary metric per test; pre-register it.
- **Low traffic = test only big swings** (copy, layout, flow) — not pixel tweaks.
  Micro-tests need traffic you won't have early on.
- No overlapping experiments on the same funnel step.

---

## Experiment Log

Record every experiment so learnings compound. Newest first.

| Date | Hypothesis | Variant | Primary metric | Result | Decision |
|------|-----------|---------|----------------|--------|----------|
| _(none yet)_ | | | | | |

---

## Sequencing
Analytics instrumentation lands in **Phase 1** alongside auth, so that by the time
there's meaningful traffic, the funnel is already measured and the first experiments
can run. See `roadmap` "Big Bet #4 — Learn & Iterate."
