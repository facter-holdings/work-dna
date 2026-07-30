## Repo shape

- This is a tiny Vite app, not a React/TS project: the real source is `index.html` with inline CSS and inline browser JS.
- There are **two** pages, and they are wired differently — read this before editing either:
  - **Owner test** — `index.html` at the repo root. Goes through the Vite build; Vite injects the bundle tag.
  - **Employee test** — `public/employee/index.html`. Vite copies `public/` verbatim, so this file is **not** processed: no bare imports, no injected tags. It hardcodes `<script type="module" src="../assets/app.js">` to reuse the owner build's Amplitude bundle.
- `docs/` is the committed GitHub Pages output (`build.outDir`). Pages serves the site from `main:/docs`, so `docs/` must be regenerated and committed with every source change.
- The site is served under the **`/work-dna/` subpath**, not the domain root. Hence `base: "./"` in `vite.config.js` and relative paths everywhere. A root-absolute `/foo` reference will 404 in production.
- `build.rollupOptions.output.entryFileNames` pins the entry to `assets/app.js`. **Do not remove this** — the employee page references that exact filename by hand, and a content hash would break it on the next build.
- `dist/`, `node_modules/`, `.playwright-cli/`, `.playwright-mcp/`, and `.claude/settings.local.json` are ignored generated/tooling outputs; do not edit them for source changes.
- `README.md` is only a title; trust `package.json`, `index.html`, and `public/employee/index.html` over prose.

## Commands

- Install from the lockfile with `npm install` if dependencies are missing; keep `package-lock.json` in sync with `package.json`.
- Dev server: `npm run dev`.
- Production check/build: `npm run build`.
- Preview built output: `npm run preview` after a successful build.
- There are no repo-defined lint, typecheck, or test scripts; do not invent them.
- Vite 8 needs a **64-bit** Node (its rolldown binary has no win32-ia32 build). On a 32-bit Node the build fails with "Cannot find native binding".

## App wiring

- The owner page's head module script imports `@amplitude/unified`, calls `amplitude.initAll(...)`, and exposes `window.workDnaAmplitude`; both pages call it through their local `track(...)` helper.
- Quiz data, scoring, rendering, result sharing, and form submission all live in the bottom inline `<script>` of each page. The two pages carry **separate copies** of this logic — a fix in one is not a fix in the other.
- Both pages gate the quiz behind an intro form (`openIntro()` → `submitIntro()` → `startQuiz()`) that collects nickname, workplace, gender, and age into `userInfo`.
- Survey completion sends a `no-cors` GET ping to the hard-coded Google Apps Script URL in `GOOGLE_APPS_SCRIPT_URL`, including `test_type` (`사장님` / `직원`) to tell the two tests apart — the animal type names are identical across them. Preserve `keepalive: true` unless intentionally changing submission behavior.
- Result sharing has no server: `buildShareUrl()` base64url-encodes the result into a `?r=` query param, and `restoreSharedResult()` reopens the result page from it on load. Shared views must not fire the completion ping.
- Kakao sharing goes through `sendKakao(...)`, which falls back to copying the link plus a toast when the SDK is missing or throws. Card thumbnails are `og-image.png` (owner) and `og-image-employee.png` (employee), selected via `ogImageUrl(which)`.
- Kakao link sharing only works from a domain registered in the Kakao developer console (Web platform → site domain).
- The UI text is Korean (`<html lang="ko">`) and uses the Pretendard CDN font; `word-break: keep-all` on `body` keeps Korean wrapping at spaces. Keep copy/layout checks in Korean context.

## Verification

- For any behavior or markup change, run `npm run build` from the repo root, then commit the regenerated `docs/`.
- Check both pages, and check them under a subpath (not just at `/`) so relative-path regressions surface.
- If changing interactions, also smoke-test locally with `npm run dev` or `npm run preview`; the app relies on inline `onclick` handlers and global functions.
