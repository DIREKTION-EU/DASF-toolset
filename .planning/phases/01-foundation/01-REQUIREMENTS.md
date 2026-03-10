# Phase 1: Foundation - Requirements

**Researched:** 2026-03-10
**Phase ID:** 01-foundation
**Requirements:** INFRA-01, INFRA-02, INFRA-03, INFRA-04, I18N-01, I18N-02, I18N-03

## Phase Requirements Mapping

| Requirement ID | Description | Research Support |
|----------------|-------------|-----------------|
| INFRA-01 | Build SPA using Mithril, Mithril Materialized, and TypeScript | Mithril v2.3.8 with TypeScript definitions, component patterns documented; Mithril Materialized for UI components |
| INFRA-02 | Use pnpm for dependency management with Vite for development | pnpm workspace configuration, Vite dev server with HMR, TypeScript compilation |
| INFRA-03 | Deploy to GitHub Pages docs folder as static site | Vite `build.outDir: "docs"` and `base: "/repo-name/"` configuration, GitHub Actions workflow |
| INFRA-04 | Configure dev mode to link to localhost, production to GitHub Pages | `import.meta.env.DEV/PROD` environment detection, config file with environment-specific URLs |
| I18N-01 | Implement i18n with translate.js | translate.js initialization pattern, multi-language support, language switching |
| I18N-02 | Support EU languages (English, Dutch, German, French) | Language JSON files structure, locale directories, language switcher UI |
| I18N-03 | Allow language switching in the UI | Header component with language selector, `translate.js` API for `setLanguage()` |

## Success Criteria (from ROADMAP.md)

1. Developer can run `pnpm dev` and the Mithril app loads with TypeScript compilation
2. App displays text in English, Dutch, German, and French with working language switcher
3. Dev environment links to localhost, production links to GitHub Pages automatically
4. Build outputs a static site ready for GitHub Pages docs folder deployment

## Implementation Tasks (from Research)

### Phase 1 Tasks
1. **Project Setup**
   - Initialize pnpm workspace with `pnpm init -w`
   - Create `pnpm-workspace.yaml`
   - Install dependencies: `mithril`, `@types/mithril`, `vite`, `typescript`, `@types/node`

2. **Configuration Files**
   - Create `tsconfig.json` with recommended settings
   - Create `vite.config.ts` with GitHub Pages configuration
   - Create `src/utils/config.ts` for environment detection

3. **Component Structure**
   - Create `src/main.ts` entry point
   - Create `src/router.ts` with route definitions
   - Create `src/components/` directory with Layout, Header, Footer
   - Create `src/pages/` directory with Home, NotFound

4. **Internationalization**
   - Create `src/i18n/index.ts` with translate.js setup
   - Create `src/i18n/locales/` with en.json, nl.json, de.json, fr.json
   - Implement language switcher in Header component

5. **Testing Setup**
   - Install Vitest for Vite
   - Create initial test infrastructure for validation

## Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command |
|--------|----------|-----------|-------------------|
| INFRA-01 | Mithril app loads with TypeScript compilation | integration | `pnpm dev` + verify no compilation errors |
| INFRA-02 | pnpm install works with vite dev | integration | `pnpm install && pnpm dev --port 5173` |
| INFRA-03 | Build outputs static files to docs/ | integration | `pnpm build && ls docs/` |
| INFRA-04 | Dev links to localhost, prod to GitHub Pages | integration | Check config in built output |
| I18N-01 | translate.js initialized with languages | unit | `vitest run test/i18n.test.ts` |
| I18N-02 | Language files for en/nl/de/fr exist | integration | `ls src/i18n/locales/ && wc -l src/i18n/locales/*.json` |
| I18N-03 | Language switcher in UI works | integration | `pnpm test -- test/i18n-lang-switch.test.ts` |

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
