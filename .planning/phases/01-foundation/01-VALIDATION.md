# Validation Architecture: Phase 1 - Foundation

**Phase:** 1
**Created:** 2026-03-10

## Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest (compatible with Vite) |
| Config file | `vite.config.ts` with `test: {}` |
| Quick run command | `pnpm test` |
| Full suite command | `pnpm test --run` |

## Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| INFRA-01 | Mithril app loads with TypeScript compilation | integration | `pnpm dev` + verify no compilation errors | ❌ |
| INFRA-02 | pnpm install works with vite dev | integration | `pnpm install && pnpm dev --port 5173` | ❌ |
| INFRA-03 | Build outputs static files to docs/ | integration | `pnpm build && ls docs/` | ❌ |
| INFRA-04 | Dev links to localhost, prod to GitHub Pages | integration | Check build config output | ❌ |
| I18N-01 | translate.js initialized with languages | unit | `vitest run test/i18n.test.ts` | ❌ |
| I18N-02 | Language files for en/nl/de/fr exist | integration | `ls src/i18n/locales/ && wc -l src/i18n/locales/*.json` | ❌ |
| I18N-03 | Language switcher in UI works | integration | `pnpm test -- test/i18n-lang-switch.test.ts` | ❌ |

## Wave 0 Gaps

- [ ] `src/main.ts` — App entry point mounting Mithril to `#app`
- [ ] `src/router.ts` — Route definitions with m.route
- [ ] `src/components/App.ts` — Main app component with layout
- [ ] `src/pages/Home.ts` — Home page component
- [ ] `src/pages/NotFound.ts` — 404 page component
- [ ] `src/i18n/index.ts` — translate.js setup with language files
- [ ] `src/i18n/locales/en.json` — English translations
- [ ] `src/i18n/locales/nl.json` — Dutch translations
- [ ] `src/i18n/locales/de.json` — German translations
- [ ] `src/i18n/locales/fr.json` — French translations
- [ ] `vite.config.ts` — Vite configuration for GitHub Pages
- [ ] `tsconfig.json` — TypeScript configuration

## Sampling Rate

- **Per task commit:** `pnpm test` (if tests exist)
- **Per wave merge:** `pnpm test --run` (full suite)
- **Phase gate:** All tests green before `/gsd:verify-work`
