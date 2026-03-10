---
phase: 01-foundation
plan: 02
type: execute
wave: 1
depends_on:
  - 01
files_modified:
  - src/main.ts
  - src/router.ts
  - src/components/App.ts
  - src/components/Layout.ts
  - src/components/Header.ts
  - src/components/Footer.ts
  - src/pages/Home.ts
  - src/pages/NotFound.ts
  - index.html
autonomous: true
requirements:
  - INFRA-01
  - INFRA-04
must_haves:
  truths:
    - "Developer can run `pnpm dev` and the Mithril app loads with TypeScript compilation"
    - "App displays Home page at '/' route"
    - "App displays 404 page at unknown routes"
    - "Navigation links work with m.routeLink"
    - "All components use Mithril Materialized classes"
  artifacts:
    - path: "src/main.ts"
      provides: "App entry point mounting Mithril to #app"
      contains: ["m.mount", "m.route"]
    - path: "src/router.ts"
      provides: "Route definitions with m.route"
      exports: ["routes"]
    - path: "src/components/App.ts"
      provides: "Main app component with Layout wrapper"
      contains: ["Layout"]
    - path: "src/pages/Home.ts"
      provides: "Home page component"
      contains: ["m", "class", "view"]
    - path: "src/pages/NotFound.ts"
      provides: "404 page component"
      contains: ["m.routeLink", "404"]
    - path: "index.html"
      provides: "HTML entry point"
      contains: ["#app", "type=\"module\""]
  key_links:
    - from: "src/main.ts"
      to: "src/components/App.ts"
      via: "m.mount to #app"
      pattern: "m\\.mount.*#app"
    - from: "src/main.ts"
      to: "src/router.ts"
      via: "m.route setup"
      pattern: "m\\.route.*routes"
    - from: "src/components/App.ts"
      to: "src/components/Layout.ts"
      via: "Layout wrapper"
      pattern: "Layout"
    - from: "src/router.ts"
      to: "src/pages/Home.ts"
      via: "route mapping"
      pattern: "\"/\": Home"
---

<objective>
Create Mithril SPA foundation with routing and component structure

Purpose: Establish the application skeleton so developers can navigate between pages and see a working SPA structure
Output: Working Mithril app with routing, layout components, and basic pages

**Wave 1 Goal:** A developer can navigate the app with working routes and see properly structured Mithril components
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
@.planning/phases/01-foundation/01-PLAN.md

## Key Interfaces (from Research)

### Mithril Component Pattern (POJO)
```typescript
interface Attrs { name: string }
interface State { count: number }

const Component: m.Component<Attrs, State> = {
  oninit(vnode) { /* initialize state */ },
  view(vnode) { return m("div", "content") }
};
```

### Router Setup
```typescript
const routes = {
  "/": Home,
  "/about": { render: () => m("h1", "About") },
  "*": NotFound  // 404 handler
};
m.route(document.body, "/", routes);
```

### Environment Config
```typescript
export const isDev = import.meta.env.DEV;
export const isProd = import.meta.env.PROD;
```
</context>

<tasks>

<task type="auto">
  <name>Create main.ts app entry point</name>
  <files>/Users/erik.vullings/dev/DASF-toolset/src/main.ts</files>
  <action>Create main.ts that:
  - Imports m from "mithril"
  - Imports router from "./router"
  - Imports App component from "./components/App"
  - Mounts App component to #app element
  - Sets up router with m.route</action>
  <verify>Run `pnpm dev` - app loads without compilation errors</verify>
  <done>main.ts mounts Mithril app and sets up routing</done>
</task>

<task type="auto">
  <name>Create router.ts with route definitions</name>
  <files>/Users/erik.vullings/dev/DASF-toolset/src/router.ts</files>
  <action>Create router.ts with:
  - Import m from "mithril"
  - Import Home and NotFound pages
  - Define routes object with "/" -> Home, "*" -> NotFound
  - Export routes and m.route setup call</action>
  <verify>Run `pnpm dev` - can navigate to / and see home page</verify>
  <done>router.ts exports routes configuration</done>
</task>

<task type="auto">
  <name>Create Layout component</name>
  <files>/Users/erik.vullings/dev/DASF-toolset/src/components/Layout.ts</files>
  <action>Create Layout component that:
  - Takes children as attrs
  - Wraps children in main layout structure
  - Uses Mithril Materialized classes for styling
  - Includes header, main content, and footer sections</action>
  <verify>Layout renders with proper structure in dev server</verify>
  <done>Layout.ts component exists with proper structure</done>
</task>

<task type="auto">
  <name>Create App component</name>
  <files>/Users/erik.vullings/dev/DASF-toolset/src/components/App.ts</files>
  <action>Create App component that:
  - Imports Layout component
  - Uses Layout wrapper for its content
  - Renders router-outlet for page content
  - Uses Mithril Materialized classes</action>
  <verify>App renders with layout structure</verify>
  <done>App.ts component exists and wraps content in Layout</done>
</task>

<task type="auto">
  <name>Create Header component with navigation</name>
  <files>/Users/erik.vullings/dev/DASF-toolset/src/components/Header.ts</files>
  <action>Create Header component that:
  - Displays project title/logo
  - Contains navigation links using m.routeLink
  - Uses Mithril Materialized classes
  - Links to home page</action>
  <verify>Header renders with navigation links</verify>
  <done>Header.ts component exists with navigation</done>
</task>

<task type="auto">
  <name>Create Footer component</name>
  <files>/Users/erik.vullings/dev/DASF-toolset/src/components/Footer.ts</files>
  <action>Create Footer component that:
  - Displays copyright information
  - Uses Mithril Materialized classes
  - Simple static content</action>
  <verify>Footer renders with copyright info</verify>
  <done>Footer.ts component exists</done>
</task>

<task type="auto">
  <name>Create Home page component</name>
  <files>/Users/erik.vullings/dev/DASF-toolset/src/pages/Home.ts</files>
  <action>Create Home page that:
  - Uses Mithril Materialized card component
  - Displays project introduction
  - Uses proper Mithril component pattern</action>
  <verify>Home page renders at "/" route</verify>
  <done>Home.ts page component exists</done>
</task>

<task type="auto">
  <name>Create NotFound page component</name>
  <files>/Users/erik.vullings/dev/DASF-toolset/src/pages/NotFound.ts</files>
  <action>Create NotFound page that:
  - Displays 404 error message
  - Links back to home page using m.routeLink
  - Uses Mithril Materialized classes</action>
  <verify>NotFound page renders at unknown routes</verify>
  <done>NotFound.ts page component exists</done>
</task>

<task type="auto">
  <name>Create index.html entry point</name>
  <files>/Users/erik.vullings/dev/DASF-toolset/index.html</files>
  <action>Create index.html with:
  - DOCTYPE html
  - HTML5 structure
  - Title and meta tags
  - Div with id="app" for Mithril mount
  - Link to main.ts with type="module"</action>
  <verify>Dev server serves index.html correctly</verify>
  <done>index.html exists with proper structure</done>
</task>

</tasks>

<verification>
Wave 1 validation:
- `pnpm dev` starts server without errors
- Navigate to "/" shows Home page
- Navigate to "/unknown" shows 404 page
- All components use Mithril Materialized classes
- Navigation links work with m.routeLink
</verification>

<success_criteria>
- main.ts mounts Mithril app and sets up routing
- router.ts exports routes with 404 handler
- Layout, Header, Footer, App components exist
- Home and NotFound pages render correctly
- All components use Mithril Materialized classes
- Dev server runs at port 5173
</success_criteria>

<output>
After completion, create `.planning/phases/01-foundation/01-foundation-02-SUMMARY.md`
</output>
