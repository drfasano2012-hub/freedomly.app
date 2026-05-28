# /update-docs

You are updating the 4 Freedomly documents to reflect recent changes to the app.

## Step 1 — Understand what changed

Run these commands to see recent app changes:

```bash
git log --oneline -20
git diff HEAD~5 -- app/ components/ content/ lib/ 2>/dev/null || git diff HEAD~3 -- app/ components/ content/ lib/
```

## Step 2 — Map changes to document sections

Each script has `// ✏️ Update ...` comments that tell you exactly which sections to edit when specific files change. Use this map:

| App file changed | Update these doc scripts |
|---|---|
| `app/tools/page.tsx` | `scripts/docs/deck.js` slide 3 features list, `scripts/docs/prd.js` §5.3 tools table, `scripts/docs/user-guide.js` §3 Tools, `scripts/docs/sales-guide.js` competitor table |
| `content/learn.ts` | `scripts/docs/deck.js` slide 3 features list (module count), `scripts/docs/prd.js` §5.4 module list, `scripts/docs/user-guide.js` §4 Learn, `scripts/docs/sales-guide.js` competitor table |
| `components/dashboard/*` | `scripts/docs/prd.js` §5.2 dashboard sections, `scripts/docs/user-guide.js` §2 Dashboard |
| `components/dashboard/PortfolioAllocation.tsx` | `scripts/docs/user-guide.js` §2 Portfolio Allocation profiles |
| `lib/calculations.ts` | `scripts/docs/prd.js` §8 Calculation Methodology |
| `app/checkup/page.tsx` | `scripts/docs/user-guide.js` §1 Checkup steps |
| New Phase features shipped | `scripts/docs/sales-guide.js` §10 Roadmap, §5.2 Coach portal table |
| Major new feature | All 4 scripts — update relevant sections |

## Step 3 — Edit the affected scripts

Read the relevant script(s), then update only the sections that are stale. Do not rewrite scripts from scratch — make targeted edits.

The scripts are at:
- `scripts/docs/deck.js` — PowerPoint deck
- `scripts/docs/prd.js` — Product Requirements Document
- `scripts/docs/user-guide.js` — User Guide
- `scripts/docs/sales-guide.js` — Sales & Differentiation Guide

## Step 4 — Regenerate all 4 documents

```bash
npm run update-docs
```

This runs all 4 scripts in parallel and outputs:
```
✓ Freedomly_Deck.pptx
✓ Freedomly_PRD.docx
✓ Freedomly_User_Guide.docx
✓ Freedomly_Sales_Guide.docx
All documents regenerated successfully.
```

## Step 5 — Confirm

Tell the user which documents were regenerated and what content was updated in each one.

---

**If the user just wants to regenerate without analysis** (e.g. "just regenerate the docs"), skip steps 1–3 and go straight to `npm run update-docs`.
