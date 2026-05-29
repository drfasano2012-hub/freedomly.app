# Changelog

All notable changes to Freedomly. Newest first.
Format: `YYYY-MM-DD — what changed (why, if not obvious)`.

See `PROCESS.md` for how changes get made and shipped.

---

## 2026-05-29

- **Positioning / homepage:** Repositioned Freedomly as a **financial direction
  system** (category: "financial direction" — the layer above tracking). Rebuilt
  the homepage (`app/page.tsx`) around the three questions — Where am I? Where am I
  going? What's my next move? — with 10 sections (hero, problem, why tools fail, the
  difference, snapshot, trajectory/FI, decision engine, how it works, trust, final
  CTA) and product-preview mocks. Added `POSITIONING.md` (positioning, hero spec,
  homepage blueprint, product strategy, competitive analysis).
- **Docs:** Aligned the generators (deck, PRD, sales guide) to the "financial
  direction" positioning; fixed a stale "3 calculators / Emergency Fund" reference
  in the PRD. Regenerated all 6 docs.
- **Roadmap:** Added the "Duolingo for Money" gamification thread — streaks, XP,
  levels, guided learning path (Next); leaderboards/leagues (Later); reframed Big
  Bet #1 around the daily habit loop.
- **Learn:** Added per-module completion tracking (checkboxes + progress bar,
  localStorage-persisted) and a `learn_module_completed` event.
- **Checkup:** Added brokerage examples (Fidelity, Schwab, Robinhood) to the input
  hint.
- **Analytics:** Integrated PostHog — `app/providers.tsx` (init + App Router
  pageview tracking, autocapture off, session-replay input masking on),
  `lib/analytics.ts` (typed `track()` gate enforcing the no-financial-PII rule).
  Instrumented the activation funnel + engagement: `checkup_started/edited`,
  `sample_data_used`, `checkup_step_completed`, `checkup_completed`,
  `dashboard_viewed`, `tool_opened`, `freedom_age_slider_used`,
  `learn_module_opened`. No-ops cleanly when no PostHog key is set.
- **Docs:** Added `ANALYTICS.md` — analytics + A/B testing plan (PostHog), event
  taxonomy, funnels, experiment discipline + first 3 experiments, experiment log.
- **Docs:** Added `README.md`, `PROCESS.md` (operating process), and `CHANGELOG.md`
  (this file) to formalize how changes get made, documented, and shipped.
- **Docs:** Added `DEPLOYMENT.md` documenting GitHub + Vercel + Cloudflare setup
  (now also documents the optional PostHog env vars).
- **Docs pipeline:** Added `roadmap.js` + `business-model.js` generators and wired
  them into `generate-all.js` (now regenerates 6 docs, was 4).
- **Roadmap:** Rewrote around dependency + retention. "Next" reframed as
  Foundation + Retention (auth, cloud, net-worth tracking/trend chart, badges,
  check-in email, PDF export, analytics). "Later" as Coaching + Scale (coach
  portal view → comment → co-fill → message; CSV import; Plaid; mobile;
  white-label). Added a 3rd "Big Bets" slide with sequencing rationale.
- **User guide:** Corrected to two tools (removed Emergency Fund), documented the
  Freedom Age spending-reduction slider, added the FIRE definition.
- **Infra:** Deployed to production — `freedomly.app` live on Vercel via GitHub
  continuous deployment. Domain DNS on Cloudflare (DNS-only), SSL auto-provisioned,
  HTTPS forced. Apex redirects to `www`.
- **Infra:** Initialized git repo, pushed to `github.com/drfasano2012-hub/freedomly.app`.

## Earlier (pre-changelog, MVP build)

- **Tools:** Removed the Emergency Fund calculator — Tools page now has Coast FIRE
  and Compound Growth.
- **Tools:** Added a FIRE explainer to the Coast FIRE tab (defines
  "Financial Independence, Retire Early" and Coast FIRE).
- **Dashboard:** Reordered — Action Plan now appears above the Recommended
  Portfolio section.
- **Dashboard:** Top 3 Next Actions card restyled — solid white glass card,
  emerald number badges, higher-contrast text (was a washed-out gradient).
- **Dashboard – Freedom Age:** Changed the "Needs work" status badge from orange
  to blue. Added a note that the projection is based on current spending. Added a
  spending-reduction slider that live-recalculates the freedom age ("what if I
  spent less?").
- **MVP:** Initial client-side build — financial checkup, dashboard (health score,
  freedom age, benchmarks, detail cards, portfolio allocation, action plan),
  financial tools, 11 learning modules, coaching page. Next.js 14 + Tailwind,
  data persisted in localStorage.
