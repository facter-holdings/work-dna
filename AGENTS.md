# AGENTS.md

## Repo shape
- This is a tiny Vite app, not a React/TS project: the real source is `index.html` with inline CSS and inline browser JS.
- `dist/`, `node_modules/`, `.playwright-cli/`, and `.playwright-mcp/` are ignored generated/tooling outputs; do not edit them for source changes.
- `README.md` is only a title; trust `package.json` and `index.html` over prose.

## Commands
- Install from the lockfile with `npm install` if dependencies are missing; keep `package-lock.json` in sync with `package.json`.
- Dev server: `npm run dev`.
- Production check/build: `npm run build`.
- Preview built output: `npm run preview` after a successful build.
- There are no repo-defined lint, typecheck, or test scripts; do not invent them.

## App wiring
- The head module script imports `@amplitude/unified`, calls `amplitude.initAll(...)`, and exposes `window.workDnaAmplitude`; quiz events call it through the local `track(...)` helper.
- Quiz data, scoring, rendering, result sharing, and form submission all live in the bottom inline `<script>` of `index.html`.
- Survey completion sends a `no-cors` GET ping to the hard-coded Google Apps Script URL in `GOOGLE_APPS_SCRIPT_URL`; preserve `keepalive: true` unless intentionally changing submission behavior.
- The UI text is Korean (`<html lang="ko">`) and uses the Pretendard CDN font; keep copy/layout checks in Korean context.

## Verification
- For any behavior or markup change, run `npm run build` from the repo root.
- If changing interactions, also smoke-test locally with `npm run dev` or `npm run preview`; the app relies on inline `onclick` handlers and global functions.
