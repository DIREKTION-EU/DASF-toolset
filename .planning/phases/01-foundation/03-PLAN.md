---
phase: 01-foundation
plan: 03
type: execute
wave: 2
depends_on:
  - 1
files_modified:
  - src/i18n/index.ts
  - src/i18n/locales/en.json
  - src/i18n/locales/nl.json
  - src/i18n/locales/de.json
  - src/i18n/locales/fr.json
  - src/components/LanguageSwitcher.ts
  - src/components/Header.ts
  - src/utils/config.ts
autonomous: true
requirements:
  - I18N-01
  - I18N-02
  - I18N-03
---

<objective>
Implement internationalization with translate.js and add language switcher

Purpose: Enable the app to display text in multiple languages with a working language switcher
Output: Working i18n system supporting English, Dutch, German, and French

**Wave 2 Goal:** Users can switch languages in the UI and see translated content
</objective>

<execution_context>
@./.claude/get-shit-done/workflows/execute-plan.md
@./.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/01-foundation/01-RESEARCH.md
@.planning/phases/01-foundation/02-PLAN.md

## Key Interfaces (from Research)

### translate.js Setup
```typescript
import translate from "translate.js";

// Initialize with languages
translate.init({
  defaultLang: "en",
  languages: ["en", "nl", "de", "fr"],
  detectLang: true
});

// Load language files
translate.load("en", { "key": "value" });
```

### Using Translations in Components
```typescript
const Component = {
  view: () => m("div", translate("home.title"))
};
```

### Environment Config for URLs
```typescript
export const isDev = import.meta.env.DEV;
export const isProd = import.meta.env.PROD;

export const config = {
  apiUrl: isDev ? "http://localhost:3000" : "https://username.github.io/repo",
  ghPages: true,
  defaultLang: "en",
  languages: ["en", "nl", "de", "fr"]
};
```
</context>

<tasks>

<task type="auto">
  <name>Create config.ts utility for environment detection</name>
  <files>/Users/erik.vullings/dev/DASF-toolset/src/utils/config.ts</files>
  <action>Create config.ts with:
  - isDev = import.meta.env.DEV
  - isProd = import.meta.env.PROD
  - config object with:
    - apiUrl: localhost in dev, GitHub Pages URL in prod
    - base: "/" in dev, "/dasf-toolset/" in prod
    - defaultLang: "en"
    - languages: ["en", "nl", "de", "fr"]</action>
  <verify>Run `pnpm dev` - check config is exported correctly</verify>
  <done>config.ts exports environment-specific configuration</done>
</task>

<task type="auto">
  <name>Create English translation file (en.json)</name>
  <files>/Users/erik.vullings/dev/DASF-toolset/src/i18n/locales/en.json</files>
  <action>Create English translation file with:
  - home.title: "DASF Toolset"
  - home.description: "Disaster Assessment and Simulation Framework"
  - header.nav.home: "Home"
  - header.nav.about: "About"
  - footer.copyright: "Copyright"
  - languageSwitcher.label: "Language"</action>
  <verify>File exists with valid JSON structure</verify>
  <done>en.json exists with basic translations</done>
</task>

<task type="auto">
  <name>Create Dutch translation file (nl.json)</name>
  <files>/Users/erik.vullings/dev/DASF-toolset/src/i18n/locales/nl.json</files>
  <action>Create Dutch translation file with same keys as en.json but translated to Dutch</action>
  <verify>File exists with valid JSON structure</verify>
  <done>nl.json exists with Dutch translations</done>
</task>

<task type="auto">
  <name>Create German translation file (de.json)</name>
  <files>/Users/erik.vullings/dev/DASF-toolset/src/i18n/locales/de.json</files>
  <action>Create German translation file with same keys as en.json but translated to German</action>
  <verify>File exists with valid JSON structure</verify>
  <done>de.json exists with German translations</done>
</task>

<task type="auto">
  <name>Create French translation file (fr.json)</name>
  <files>/Users/erik.vullings/dev/DASF-toolset/src/i18n/locales/fr.json</files>
  <action>Create French translation file with same keys as en.json but translated to French</action>
  <verify>File exists with valid JSON structure</verify>
  <done>fr.json exists with French translations</done>
</task>

<task type="auto">
  <name>Create i18n index.ts with translate.js initialization</name>
  <files>/Users/erik/vullings/dev/DASF-toolset/src/i18n/index.ts</files>
  <action>Create i18n/index.ts with:
  - Import translate from "translate.js"
  - Import config from "../utils/config"
  - Initialize translate with defaultLang and languages
  - Load all language JSON files
  - Export translate instance and helper functions
  - Set language from URL query param or localStorage if present</action>
  <verify>Run `pnpm dev` - no errors on initialization</verify>
  <done>i18n/index.ts initializes translate.js with all languages</done>
</task>

<task type="auto">
  <name>Create LanguageSwitcher component</name>
  <files>/Users/erik.vullings/dev/DASF-toolset/src/components/LanguageSwitcher.ts</files>
  <action>Create LanguageSwitcher component that:
  - Uses Mithril Materialized select component
  - Displays available languages from config
  - On change, calls translate.setLang() and updates localStorage
  - Uses t() helper for UI labels</action>
  <verify>Language switcher renders and changes language</verify>
  <done>LanguageSwitcher.ts component exists with working language change</done>
</task>

<task type="auto">
  <name>Update Header component to include LanguageSwitcher</name>
  <files>/Users/erik.vullings/dev/DASF-toolset/src/components/Header.ts</files>
  <action>Update Header component to:
  - Import LanguageSwitcher component
  - Import translate instance
  - Use t() helper for header text
  - Include LanguageSwitcher in header structure</action>
  <verify>Header shows language switcher and works</verify>
  <done>Header includes LanguageSwitcher with working language switching</done>
</task>

<task type="auto">
  <name>Update Home page to use translations</name>
  <files>/Users/erik.vullings/dev/DASF-toolset/src/pages/Home.ts</files>
  <action>Update Home page to:
  - Import translate instance
  - Use t() helper for all visible text
  - Add basic styling with Mithril Materialized classes</action>
  <verify>Home page displays translated content</verify>
  <done>Home page uses t() helper for all text content</done>
</task>

</tasks>

<verification>
Wave 2 validation:
- `pnpm dev` starts without errors
- English text displays by default
- Dutch, German, French languages available in switcher
- Switching language updates all translated text
- Language preference persists in localStorage
</verification>

<success_criteria>
- translate.js initialized with en, nl, de, fr languages
- All language JSON files created with consistent keys
- LanguageSwitcher component renders and changes language
- Home page displays translated content
- Language preference persisted in localStorage
</success_criteria>

<output>
After completion, create `.planning/phases/01-foundation/01-foundation-03-SUMMARY.md`
</output>
