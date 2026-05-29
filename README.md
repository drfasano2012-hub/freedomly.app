# Freedomly

**Money is a tool. Freedom is the goal.**

A financial freedom planning platform. Users complete a short financial checkup
and get a personalized dashboard — health score, freedom-age projection, net-worth
benchmarks, a prioritized action plan, financial tools, and learning modules.

🔗 **Live:** https://www.freedomly.app

---

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** + Radix UI primitives
- **Recharts** (charts), **lucide-react** (icons)
- Fully **client-side** — calculations run in the browser, data persists in
  `localStorage`. No backend (yet — see the roadmap).
- **Analytics:** PostHog (optional; see `ANALYTICS.md`). Without keys it no-ops.

---

## Run it locally

```bash
npm install      # first time
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build — must say "Compiled successfully"
npm run lint     # lint
```

---

## Project structure

```
app/            Routes (landing, checkup, dashboard, tools, learn, coaching)
components/     UI — dashboard cards, tools, shared components
lib/            Calculation engine (calculations.ts), types, utils
hooks/          useFinancialData (localStorage persistence)
content/        Static content (learning modules, etc.)
scripts/docs/   Document generators (PRD, guides, decks) → npm run update-docs
```

---

## Documents

Marketing/product docs are **generated from source** — never hand-edited as final
files. Regenerate them all with:

```bash
npm run update-docs
```

Produces: PRD, User Guide, Sales Guide, Overview Deck, Roadmap, Business Model.
(Output `.docx`/`.pptx` files are gitignored — they're reproducible.)

---

## How we work

- **[`PROCESS.md`](./PROCESS.md)** — how every change gets made, documented, and shipped (the operating process + update cycle).
- **[`DEPLOYMENT.md`](./DEPLOYMENT.md)** — infrastructure: GitHub, Vercel, Cloudflare DNS, SSL, env vars, troubleshooting.
- **[`ANALYTICS.md`](./ANALYTICS.md)** — analytics + A/B testing plan (PostHog), event taxonomy, experiment log.
- **[`CHANGELOG.md`](./CHANGELOG.md)** — running history of changes.

**Deploys are automatic:** push to `main` → Vercel builds & deploys to
`freedomly.app` in ~1 minute.
