# Freedomly — Operating Process

How every change to Freedomly gets made, documented, and shipped.
The goal: **nothing drifts out of sync.** Code, docs, GitHub, and the live
site always reflect the same reality.

---

## The model

```
   SOURCE OF TRUTH                 DERIVED / DOWNSTREAM
   ┌───────────────┐
   │ code          │──────────────▶ live site  (Vercel auto-deploys from main)
   │ content       │
   │ doc-generators│──────────────▶ PRD / Guides / Deck  (npm run update-docs)
   └───────────────┘
           │
           ▼
   every change recorded in GIT history + CHANGELOG.md
```

- **Code & content** are the source of truth for the *product*.
- **Docs are generated from source** (`scripts/docs/*.js`) — never hand-edited as
  final files. To change a doc, edit its generator, then regenerate. This is why
  docs can't go stale: you re-run the generator.
- **Git** is the single record of history. **Vercel** turns a push into a deploy.

---

## The Update Cycle — run this for EVERY change

| # | Step | Command / action |
|---|------|------------------|
| 1 | **Change** | Edit code, content, or a doc generator |
| 2 | **Sync docs** | If the product changed: `npm run update-docs` |
| 3 | **Log** | Add one dated line to `CHANGELOG.md` |
| 4 | **Commit** | `git add -A && git commit -m "clear message"` |
| 5 | **Push** | `git push` → Vercel auto-deploys (~1 min) |
| 6 | **Verify** | Load https://www.freedomly.app and confirm |

> **Or just ask Claude.** Say *"make change X and ship it"* and Claude runs
> steps 1–6 for you (the push credential is cached). You review the diff and the
> CHANGELOG line before it goes out.

---

## Change types → what each one touches

| Change type | You edit | Also update | Deploys? |
|-------------|----------|-------------|----------|
| **Feature / code** | `app/`, `components/`, `lib/`, `hooks/` | Docs if user-facing (`update-docs`); CHANGELOG | ✅ yes |
| **Content / copy** | `content/`, in-component text | User Guide (`update-docs`); CHANGELOG | ✅ yes |
| **Document content** | `scripts/docs/*.js` then `update-docs` | CHANGELOG | ❌ no (docs aren't deployed) |
| **Infra / deploy / DNS** | config, Vercel/Cloudflare settings | `DEPLOYMENT.md`; CHANGELOG | depends |
| **Product strategy** (roadmap, pricing) | roadmap / business-model decks | CHANGELOG; may spawn code work later | ❌ no |

---

## Documents — how they stay current

Generators live in `scripts/docs/`:

| File | Produces |
|------|----------|
| `prd.js` | `Freedomly_PRD.docx` |
| `user-guide.js` | `Freedomly_User_Guide.docx` |
| `sales-guide.js` | `Freedomly_Sales_Guide.docx` |
| `deck.js` | `Freedomly_Deck.pptx` |
| `generate-all.js` | runs all of the above |

**To update any doc:** edit its generator script → run `npm run update-docs` →
all artifacts regenerate from current source.

> **Note:** `Freedomly_Roadmap.pptx` and `Freedomly_Business_Model.pptx` were
> created ad-hoc and are **not yet in this pipeline**. To make them first-class,
> add generator scripts for them and wire into `generate-all.js`.
> The generated `*.docx`/`*.pptx` files are gitignored (local artifacts) — they're
> reproducible from the generators, so they don't belong in version control.

---

## Versioning & releases (lightweight)

For a solo product, keep it simple:
- Bump `version` in `package.json` for meaningful releases (e.g. `0.2.0`).
- Optionally tag the release: `git tag v0.2.0 && git push --tags`.
- The CHANGELOG is the human-readable record; tags are the machine markers.

Don't over-engineer this — the CHANGELOG + git history is enough until you have
a team.

---

## Quick reference

```bash
# Local dev
npm run dev            # preview at http://localhost:3000

# Verify before shipping
npm run build          # must say "Compiled successfully"

# Regenerate documents from source
npm run update-docs

# Ship
git add -A && git commit -m "what changed" && git push   # → auto-deploys
```

See `DEPLOYMENT.md` for infrastructure details and troubleshooting.
