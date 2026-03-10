---
phase: 01-foundation
plan: 01
type: execute
wave: 0
depends_on: []
files_modified:
  - package.json
  - tsconfig.json
  - vite.config.ts
  - .gitignore
autonomous: true
requirements:
  - INFRA-02
must_haves:
  truths:
    - "Developer can run `pnpm install` without errors"
    - "Developer can run `pnpm dev` and see the app running"
    - "Build outputs to docs/ folder for GitHub Pages"
    - "TypeScript compilation runs without errors"
  artifacts:
    - path: "package.json"
      provides: "Project dependencies and scripts"
      contains: ["pnpm", "mithril", "vite"]
    - path: "tsconfig.json"
      provides: "TypeScript compiler configuration"
      contains: ["target", "moduleResolution", "strict"]
    - path: "vite.config.ts"
      provides: "Vite build configuration"
      contains: ["build.outDir", "base"]
    - path: ".gitignore"
      provides: "Excludes build artifacts and dependencies"
      contains: ["node_modules", "dist", "docs"]
  key_links:
    - from: "package.json"
      to: "pnpm install"
      via: "dependencies and devDependencies"
      pattern: "\"dependencies\":|\"devDependencies\":"
    - from: "tsconfig.json"
      to: "pnpm dev"
      via: "TypeScript compilation"
      pattern: "\"moduleResolution\": \"bundler\""
    - from: "vite.config.ts"
      to: "pnpm build"
      via: "build.outDir and base"
      pattern: "outDir.*docs|base.*dasf-toolset"
---

<objective>
Set up project scaffolding with pnpm, TypeScript, and Vite configuration

Purpose: Establish the foundational build infrastructure so developers can install dependencies and run the development server
Output: Working pnpm project with TypeScript compilation and Vite dev server

**Wave 0 Goal:** A developer can clone the repo, run `pnpm install`, and then `pnpm dev` to see the app running
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
</context>

<tasks>

<task type="auto">
  <name>Create package.json with project dependencies</name>
  <files>/Users/erik.vullings/dev/DASF-toolset/package.json</files>
  <action>Create package.json with:
  - name: dasf-toolset
  - pnpm as package manager
  - dependencies: mithril, mithril-materialized
  - devDependencies: typescript, @types/mithril, @types/node, vite, @vitejs/plugin-react (if needed), vitest
  - scripts: dev, build, preview, test</action>
  <verify>Run `pnpm install` - should complete without errors</verify>
  <done>package.json exists with all required dependencies and scripts</done>
</task>

<task type="auto">
  <name>Create tsconfig.json for TypeScript compilation</name>
  <files>/Users/erik.vullings/dev/DASF-toolset/tsconfig.json</files>
  <action>Create TypeScript configuration with:
  - target: ES2020
  - module: ESNext
  - moduleResolution: bundler
  - strict: true
  - esModuleInterop: true
  - skipLibCheck: true
  - forceConsistentCasingInFileNames: true
  - isolatedModules: true
  - noEmit: true
  - types: ["vite/client", "node"]
  - include: ["src/**/*.ts", "src/**/*.d.ts"]</action>
  <verify>Run `npx tsc --noEmit` - should complete without errors</verify>
  <done>tsconfig.json exists with proper configuration</done>
</task>

<task type="auto">
  <name>Create vite.config.ts for GitHub Pages deployment</name>
  <files>/Users/erik.vullings/dev/DASF-toolset/vite.config.ts</files>
  <action>Create Vite configuration with:
  - build.outDir: "docs" (GitHub Pages docs folder)
  - build.emptyOutDir: true
  - base: "/dasf-toolset/" (GitHub Pages subdirectory)
  - resolve.alias: { "@": "/src" }
  - server.port: 5173
  - server.open: true</action>
  <verify>Run `pnpm build` - should output to docs/ folder</verify>
  <done>vite.config.ts exists with GitHub Pages deployment configuration</done>
</task>

<task type="auto">
  <name>Create .gitignore for pnpm project</name>
  <files>/Users/erik.vullings/dev/DASF-toolset/.gitignore</files>
  <action>Create .gitignore excluding:
  - node_modules
  - dist and docs (build outputs)
  - .pnpm-store
  - .env files
  - IDE-specific files</action>
  <verify>Git status shows expected files are ignored</verify>
  <done>.gitignore exists and excludes build artifacts</done>
</task>

</tasks>

<verification>
Wave 0 validation:
- `pnpm install` completes successfully
- No missing dependency errors
- No TypeScript errors in IDE
</verification>

<success_criteria>
- package.json with all required dependencies and scripts
- tsconfig.json with TypeScript configuration
- vite.config.ts configured for GitHub Pages deployment
- .gitignore excludes node_modules and build outputs
- Developer can run `pnpm install` and `pnpm dev` successfully
</success_criteria>

<output>
After completion, create `.planning/phases/01-foundation/01-foundation-01-SUMMARY.md`
</output>
