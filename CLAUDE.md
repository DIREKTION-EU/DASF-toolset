# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

This is a Mithril.js TypeScript application using the Meiosis state management pattern. It's a monorepo using pnpm workspaces with the main GUI package in `packages/gui/`.

## Development Commands

**Install dependencies:**
```bash
pnpm i
```

**Development server:**
```bash
npm start
# or from root:
pnpm start
```
This starts the Rspack dev server on port 65533.

**Build:**
```bash
# From root:
pnpm run build
# From gui package:
npm run build
```

**Clean:**
```bash
# From root:
pnpm run clean
# From gui package:
npm run clean
```

## Architecture

### State Management
- Uses **Meiosis** pattern with `meiosis-setup` library
- Global state defined in `packages/gui/src/services/meiosis.ts`
- State includes: page, model, user role, settings, search functionality
- Actions are pure functions that update the cell state
- Services can react to state changes (see `setSearchResults` service)

### Routing
- Custom routing service in `packages/gui/src/services/routing-service.ts`
- Pages defined as enum in `packages/gui/src/models/page.ts`
- Routes are internationalized and can have role-based visibility
- Layout component wraps page components unless `hasNavBar: false`

### Components
- Use either `FactoryComponent` or `MeiosisComponent` (which includes cell state)
- Components in `packages/gui/src/components/`
- UI components in `packages/gui/src/components/ui/`
- Follow Meiosis pattern: receive cell as prop, use actions to update state

### Data Persistence
- Model data saved to localStorage with key `MITHRIL_APP_MODEL`
- User role saved to localStorage with key `USER_ROLE`
- Language preference saved to localStorage with key from `LANGUAGE` constant

### Internationalization
- Uses `translate.js` library
- Language files in `packages/gui/src/services/lang/`
- Translation service in `packages/gui/src/services/translations.ts`
- Use `t()` function for translations

### Styling
- Uses Materialize CSS via `mithril-materialized`
- Custom styles in `packages/gui/src/css/style.css`
- SCSS support available via sass-loader

## Build Configuration
- Uses Rspack (Webpack alternative) configured in `packages/gui/rspack.config.ts`
- TypeScript compilation via SWC
- Development builds serve from `dist/`, production builds to `../../docs/`
- Hot module replacement enabled in development
- Source maps generated for TypeScript files