# vuln-next-demo

⚠️ **Intentionally vulnerable.** Built purely to exercise Safeguard scanning and remediation
(dependency upgrades, PR generation, fix verification). Never deploy this, never expose it to a
network, never copy code out of it.

## What's in here

**Outdated dependency tree** — Next.js 12.0.7 / React 17 plus ~70 pinned old packages
(lodash 4.17.11, axios 0.21.1, jsonwebtoken 8.5.1, handlebars 4.0.11, marked 0.3.19, ejs 2.7.4,
request, tar 4.4.0, minimist 1.2.0, ws 5.2.2, sequelize 4, mongoose 5, socket.io 2, express 4.16,
webpack 4, gulp 3, grunt 1.0.4, …). `package-lock.json` is committed (lockfileVersion 3, 1968
resolved packages) so SCA has a real transitive graph to walk.

Baseline `npm audit`: **185 vulnerabilities — 26 critical, 98 high, 50 moderate, 11 low.**

**Code-level issues** for SAST, spread across files:

| File | Issue classes |
|---|---|
| `lib/config.js` | hardcoded secrets (fake AWS/Stripe/Slack/GitHub placeholders) |
| `lib/db.js` | SQL injection (string concat, interpolated ORDER BY), `multipleStatements` |
| `lib/auth.js` | MD5/SHA1 password hashing, JWT `none` algorithm, fail-open verify, static IV, predictable reset token, no expiry |
| `lib/render.js` | template injection (Handlebars/EJS), unsafe `yaml.load`, prototype pollution via `_.merge`, unsafe markdown |
| `pages/api/exec.js` | command injection (`exec`, `execSync`, `shelljs`) |
| `pages/api/file.js` | path traversal, arbitrary write, `chmod 777` |
| `pages/api/fetch.js` | SSRF, TLS verification disabled |
| `pages/api/template.js` | `eval` / `new Function` on request body |
| `pages/api/login.js` | credentials logged, timing-unsafe compare, insecure cookie flags, user enumeration |
| `pages/api/redirect.js` | open redirect, header injection |
| `pages/api/xml.js` | XXE-prone XML parsing |
| `pages/api/upload.js` | zip-slip, unbounded body size |
| `pages/api/users.js` | broken access control via `x-is-admin` header, stack traces leaked |
| `components/UnsafeHtml.js` | `dangerouslySetInnerHTML`, `innerHTML`, DOM XSS from `location.hash`, `eval` |
| `components/SearchBox.js` | XSS sinks, token in localStorage, client prototype pollution |
| `pages/profile.js` | reflected XSS, open redirect, `target=_blank` without `noopener` |
| `next.config.js` | `unsafe-inline`/`unsafe-eval` CSP, `Access-Control-Allow-Origin: *`, wildcard image domains |
| `Dockerfile` | outdated `node:14.15.0-buster`, root user, secrets in ENV, `chmod -R 777` |
| `docker-compose.yml` | `privileged: true`, docker socket + `/` mounted, mysql:5.6, empty root password allowed |
| `.env.example` | placeholder secrets committed |

## Running it

Not required for scanning — SCA reads `package.json` + `package-lock.json`, SAST reads the source.

If you do want it to boot, `npm install --legacy-peer-deps` then `npm run dev`. Some of the pinned
packages predate Node 22, so expect install/build noise; that doesn't affect scan results.

## Using it for remediation testing

1. Push to a private repo and onboard it in Safeguard.
2. Run a deep scan — expect findings across SCA, SAST, secrets, and container/IaC.
3. Trigger remediation. npm fixes regenerate `package-lock.json`, so the diff on that file is the
   thing to verify.
4. To reset between runs: `git checkout -- package.json package-lock.json`.
