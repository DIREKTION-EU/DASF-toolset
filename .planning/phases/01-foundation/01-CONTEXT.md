# Phase 1: Foundation - Context

**Gathered:** 2026-03-09
**Status:** Ready for planning
**Source:** Design preference selection

<domain>
## Phase Boundary

Phase 1 establishes the foundational infrastructure for the DASF Toolset SPA. This phase delivers:
- Project scaffolding with TypeScript, Mithril, and Mithril Materialized
- Build configuration with Vite and pnpm
- GitHub Pages deployment setup
- Basic routing structure
- Component organization patterns

The goal is to produce a working SPA that developers can extend, with all tooling in place.

</domain>

<decisions>
## Implementation Decisions

### Tech Stack Selection
- **Mithril** - Lightweight SPA framework (~8.8KiB gzipped) with virtual DOM and built-in routing
- **Mithril Materialized** - Material Design components for Mithril without external JS dependencies
- **TypeScript** - Type-safe development with proper module resolution
- **Vite** - Fast development server and optimized production builds
- **pnpm** - Efficient dependency management with workspaces support

### Architecture Approach
- **Component-first structure** - Start with minimal Mithril components, organize by feature
- **Client-side routing** - Use `m.route` for navigation between sections
- **State isolation** - Each page/component manages its own state initially
- **CSS-first theming** - Mithril Materialized uses CSS classes for easy customization

### Build & Deployment
- **Vite dev server** - Hot module replacement for rapid iteration
- **Production build** - Static files output to `dist/` for GitHub Pages
- **GitHub Pages** - Deploy to `docs/` folder as specified in requirements

### Claude's Discretion
- Component naming conventions (PascalCase)
- File organization (features vs utilities)
- Exact routing structure (can be refined during implementation)
- TypeScript configuration details (compiler options, paths)

</decisions>

<specifics>
## Specific Ideas

### Starting Point
- Single `index.html` entry point
- Basic `main.ts` that mounts Mithril app to `#app` element
- `components/` directory with `Layout.ts`, `Header.ts`, `Footer.ts`
- `pages/` directory for route-specific components
- `router.ts` for route definitions

### Next Steps (for Phase 2)
- State management with meiosis pattern
- IndexedDB persistence layer
- WebRTC session management

</specifics>

<deferred>
## Deferred Ideas

- Feature flag system - Not needed for v1 foundation
- Component library documentation - Can be added after stable API
- Storybook or similar - Dev tools can be added later

</deferred>

---

*Phase: 1-foundation*
*Context gathered: 2026-03-09 via design preference selection*
