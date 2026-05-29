# Freedomly — Deployment & Infrastructure

Reference doc for how `freedomly.app` is hosted, deployed, and wired together.
Last verified: **2026-05-29**.

---

## Service inventory

| Layer | Provider | Details |
|-------|----------|---------|
| **Source code** | GitHub | Repo: [`drfasano2012-hub/freedomly.app`](https://github.com/drfasano2012-hub/freedomly.app) (public) |
| **Hosting / CI-CD** | Vercel | Auto-deploys on every push to `main` |
| **Domain registrar** | Cloudflare | Domain: `freedomly.app` |
| **DNS** | Cloudflare | Records point to Vercel (proxy OFF — see below) |
| **SSL/TLS** | Vercel | Auto-provisioned, auto-renews. HTTPS forced (`.app` is HSTS-preloaded) |
| **Framework** | Next.js 14.2.5 | Fully static / client-side. No backend, no env vars |

---

## Live URLs

- **Primary:** https://www.freedomly.app  (serves the app, HTTP 200)
- **Apex:** https://freedomly.app  → 307 redirect → `www.freedomly.app`
- **Vercel default:** `*.vercel.app` (Vercel-assigned URL, also live)

---

## GitHub

- **Remote:** `https://github.com/drfasano2012-hub/freedomly.app.git`
- **Branch:** `main` (production)
- **Local git identity** (set per-repo):
  - name: `drfasano2012-hub`
  - email: `275801197+drfasano2012-hub@users.noreply.github.com` (GitHub privacy-preserving noreply — attributes commits without exposing a personal email)

### Authentication
- Push auth uses a **Personal Access Token (classic)** with the **`repo`** scope.
- The token is cached in the **macOS Keychain** (via git's `osxkeychain` credential helper), so pushes don't re-prompt.
- **The token value is NOT stored in this doc** (never commit tokens). To create/replace one:
  1. https://github.com/settings/tokens → Generate new token (classic)
  2. Check the **`repo`** scope → Generate → copy the `ghp_…` value
  3. Use it as the **password** at the next `git push` prompt (username = `drfasano2012-hub`)
- To clear a bad cached credential:
  ```bash
  printf "protocol=https\nhost=github.com\n\n" | git credential-osxkeychain erase
  ```

---

## Vercel

- Project imported from the GitHub repo via **Add New → Project** (signed in with GitHub).
- **Framework preset:** Next.js (auto-detected). Build settings left at defaults.
- **Environment variables:** the app runs with none, but analytics needs two
  (optional — if unset, PostHog simply doesn't initialize and the app works fine):
  | Var | Example | Notes |
  |-----|---------|-------|
  | `NEXT_PUBLIC_POSTHOG_KEY` | `phc_…` | PostHog project API key (public/client key) |
  | `NEXT_PUBLIC_POSTHOG_HOST` | `https://us.i.posthog.com` | PostHog host (US or EU) |

  Set these in **Vercel → Settings → Environment Variables** (Production) and in a
  local `.env.local` for dev. `NEXT_PUBLIC_` keys are exposed to the browser by
  design — never put secrets in a `NEXT_PUBLIC_` var. See `ANALYTICS.md`.
- **Continuous deployment:**
  - Push to `main` → Vercel builds & deploys to production automatically (~1 min).
  - Pull requests get their own preview URLs.

---

## DNS (Cloudflare)

Managed at **dash.cloudflare.com → freedomly.app → DNS → Records**.
Records point at Vercel using the values Vercel's **Settings → Domains** screen provided:

| Type | Name | Target | Proxy status |
|------|------|--------|--------------|
| `A` | `@` (apex) | Vercel anycast IP (per Vercel dashboard) | **DNS only** (grey cloud) |
| `CNAME` | `www` | `cname.vercel-dns.com` | **DNS only** (grey cloud) |

> Resolved values as of last check: apex → `216.198.79.1` / `64.29.17.1`; `www` → Vercel DNS CNAME target. **Always use whatever Vercel's dashboard currently displays** — these can change.

### ⚠️ Critical Cloudflare gotcha
The DNS records **must be "DNS only" (grey cloud), not "Proxied" (orange cloud).**
If the orange cloud (Cloudflare proxy) is ON, it blocks Vercel from issuing its SSL
cert → SSL errors / redirect loops. Grey cloud lets Vercel handle SSL + its own CDN.

If you ever *want* Cloudflare's proxy (WAF/analytics) on, you must first set
Cloudflare's **SSL/TLS mode to "Full (strict)"** to avoid redirect loops — otherwise
leave it grey.

---

## How to deploy an update

The whole loop is just a git push — Vercel does the rest.

```bash
cd /Users/danfasano/Claude-Code/freedomly
git add -A
git commit -m "describe what changed"
git push
```

→ Vercel auto-builds and deploys to `freedomly.app` in ~1 minute.

You can also just **ask Claude to make the change and push it** — the credential is
cached, so Claude can run the commit + push for you (no terminal needed).

### Verify a build locally before pushing (optional)
```bash
npm install   # first time / after dependency changes
npm run build # must say "Compiled successfully"
npm run dev   # local preview at http://localhost:3000
```

---

## Troubleshooting

| Symptom | Likely cause / fix |
|---------|-------------------|
| `Repository not found` on push | Wrong remote URL, or private repo + failed auth. Check `git remote -v`. |
| `Authentication failed` | Token missing/expired or lacks `repo` scope. Regenerate; clear keychain (above). |
| `Support for password authentication was removed` | You typed your GitHub password instead of the token. Use the `ghp_…` token. |
| Domain shows SSL error / redirect loop | Cloudflare proxy (orange cloud) is ON. Switch the DNS records to **DNS only** (grey). |
| Domain "Invalid Configuration" in Vercel | DNS records don't match what Vercel expects; copy them exactly from Vercel's Domains screen. Allow time for DNS propagation. |
| `http://freedomly.app` won't load | Expected — `.app` is HTTPS-only (HSTS preload). Use `https://`. |
| Pushed but site didn't update | Check the Vercel dashboard → Deployments for a failed build; the build log shows the error. |

---

## What is NOT in version control (intentionally)

Excluded via `.gitignore`:
- `node_modules/` (reinstalled from `package.json` / `package-lock.json`)
- `.next/`, `out/`, `build/` (build artifacts)
- `.env*` files (none currently used)
- `.vercel/` (local Vercel link)
- Generated `*.docx` / `*.pptx` files (local artifacts, not part of the app)
