# Security Policy

Green Guardian is an open-source project. This document is both its security
policy (how to report issues) and a record of its security posture, including
items that must be configured at the **infrastructure** level.

## Reporting a vulnerability

Please **do not open a public issue** for security vulnerabilities.

- Preferred: use GitHub's **private vulnerability reporting** on this repo
  (Security tab → "Report a vulnerability"). Enable it under
  Settings → Code security and analysis if it is not already on.
- Alternatively, email the maintainer at kayben833@gmail.com.

Include steps to reproduce and impact. You can expect an initial response within
a reasonable timeframe; please allow time for a fix before public disclosure.

## Open-source considerations

Because this repository is public, treat everything in it as world-readable:

- **No secrets in the repo.** Credentials live only in GitHub Actions
  secrets/variables and the AWS Lambda environment. Local config goes in
  `.env` / `.env.local` (gitignored); commit only `.env.example` templates.
- **No hardcoded endpoints.** `NEXT_PUBLIC_API_URL` is injected at build time
  from a repo variable (see `.github/workflows/deploy.yml`) so forks do not ship
  or call this project's specific backend.
- **Anyone can call your deployed API.** The endpoint URL is inherently public
  (it ships in the client bundle). Security depends on the CORS allow-list,
  request-size cap, and API Gateway throttling below — not on hiding the URL.
- **The model and labels are public.** `model_state.pt` / `labels.json` are
  distributed with the code; do not embed anything sensitive in them.

## Fixed in code

- **CORS** — `backend/main.py` no longer uses `allow_origins=["*"]` with
  credentials. Set `ALLOWED_ORIGINS` (comma-separated) in the Lambda environment
  to your real frontend origin(s), e.g. `https://your-domain.com`. Credentials
  are disabled (the API uses no cookies/sessions).
- **Upload size cap** — requests larger than `MAX_UPLOAD_BYTES` (default 10 MB)
  are rejected before the body is buffered into memory.
- **Error responses** — internal exceptions are logged server-side (CloudWatch)
  and a generic message is returned to the caller; no stack traces / paths leak.
- **Model loading** — the model is stored as a state_dict (`model_state.pt`) and
  loaded with `weights_only=True`, avoiding `torch.load`'s arbitrary-pickle
  execution path. Regenerate with the conversion step in the deployment notes if
  you retrain.
- **IAM deploy policy** — `backend/github-deploy-policy.json` is scoped to the
  specific ECR repo (`green-guardian-backend`) and Lambda function
  (`green-guardian-api`) instead of account-wide wildcards.

## Must be configured in AWS (not in this repo's code)

### 1. API rate limiting / throttling

The in-code rate limiter in `main.py` is **best-effort only** — Lambda memory is
per-container, so it does not enforce limits across concurrent invocations.
Configure real throttling at API Gateway:

- **Stage-level throttling**: set a burst + steady-state request rate on the
  `prod` stage.
- **Usage plan + API key** (optional): if the endpoint should not be fully
  public, put it behind an API key and a usage plan with per-key quotas.
- **AWS WAF** (optional): attach a rate-based rule (e.g. block an IP exceeding
  N requests / 5 min) for abuse protection.

### 2. Security response headers (CloudFront)

The frontend is a static export (`output: 'export'`), so Next.js `headers()`
does **not** apply. Add a CloudFront **response headers policy** to the
distribution serving the site with at least:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; img-src 'self' data:; connect-src 'self' https://<your-api-id>.execute-api.<region>.amazonaws.com; style-src 'self' 'unsafe-inline'; script-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'
```

Tune `connect-src` to your API Gateway origin and `style-src`/`script-src` to
what the app actually loads before enforcing CSP.

## Repo hygiene follow-ups (non-blocking)

- `backend/model/model.pt` (the old full-pickle checkpoint, 44 MB) is no longer
  loaded by the app. Remove it from the repo/image once the state_dict model is
  confirmed working in production.
- `backend/model/__pycache__/*.pyc` are committed and should be untracked
  (`git rm -r --cached backend/model/__pycache__`); `.gitignore` already ignores
  `__pycache__/` going forward.
