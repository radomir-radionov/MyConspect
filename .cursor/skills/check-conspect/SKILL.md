name: check-conspect
description: >
  Apply when the user asks to audit, check, or weekly-verify conspect **Source:**
  URLs. Report only — do not rewrite notes. After the report, use update-conspect
  on flagged blocks.
disable-model-invocation: false
---

# Check conspect sources

HTTP-check `**Source:**` URLs in catalog topic files. This does **not** replace Context7 fact-checking and does **not** edit `resources/`.

## Run

```bash
npm run check-conspect
npm run check-conspect -- --track frontend
npm run check-conspect -- --out reports/conspect-audit.md
npm run check-conspect -- --json --out reports/conspect-audit.json --strict
```

`--strict` exits 1 if any concept is `url-dead`. Weekly CI runs without `--strict` so bot-blocked hosts (`url-warn`) do not fail the job.

## Statuses

| Status | Meaning |
|--------|---------|
| `url-ok` | Every source URL returned 2xx/3xx |
| `url-warn` | 401/403/429/5xx or similar — link may still be valid |
| `url-dead` | 404/410 or network error |
| `unverified` | Concept has no `**Source:**` line |

## After the report

1. Do not auto-commit markdown.
2. For `url-dead` (and real `url-warn` after a manual open), follow `.cursor/skills/update-conspect/SKILL.md` on **those blocks only**.
3. Verify facts with Context7 before rewriting.

GitHub Action: `.github/workflows/check-conspect.yml` (Mondays 06:00 UTC + `workflow_dispatch`).
