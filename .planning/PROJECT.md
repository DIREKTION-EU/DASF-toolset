# DASF Toolset

## What This Is

A Single Page Application (SPA) for safety professionals to identify capability needs, determine gaps, and assess solutions using the Disaster Assessment and Solution Framework (DASF). The application runs as a standalone GitHub Pages site using WebRTC for real-time facilitator-participant collaboration during sessions.

## Core Value

Safety professionals can collaboratively assess disaster management capabilities, identify gaps, and build roadmaps for research and solution adoption through structured facilitator-led sessions.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] **SPA-01**: Build a SPA using Mithril, Mithril Materialized, and TypeScript
- [ ] **SPA-02**: Use pnpm for dependency management with Vite for development
- [ ] **SPA-03**: Implement i18n with translate.js supporting EU languages
- [ ] **SPA-04**: Use mithril-ui-form for questionnaire rendering
- [ ] **SPA-05**: Manage state using meiosis pattern with IndexedDB persistence
- [ ] **SPA-06**: Support facilitator session creation via WebRTC with QR code generation
- [ ] **SPA-07**: Enable participant joining via URL/QR code with room ID
- [ ] **SPA-08**: Share application state between facilitator and participants
- [ ] **SPA-09**: Persist state to IndexedDB for offline session recovery
- [ ] **SPA-10**: Configure dev mode to link to localhost, production to GitHub Pages
- [ ] **SPA-11**: Deploy to GitHub Pages docs folder via GitHub Actions

### Out of Scope

- Mobile native apps — Web-first approach, responsive web app only
- OAuth/social login — Initial auth via room URL only
- Real-time chat — WebRTC for state sync only, no voice/video
- Database backend — Client-side IndexedDB only, no server-side storage

## Context

This project implements the DASF (Disaster Assessment and Solution Framework) toolset, a set of Excel-based assessment tools reimagined as a modern web application. The framework comprises four key phases:

1. **Initiation and Preparation (I&P)** — Defining disaster scope and session logistics
2. **Needs and Gaps Assessment (NGA)** — Identifying capability needs and gaps using scenarios, guiding questions, and the World Café Method
3. **Solution Assessment (SA)** — Evaluating solutions by maturity (TRL) and compliance, then by compatibility with user/operational/organizational needs
4. **Roadmapping (RM)** — Connecting assessment results to long-term research programming

The DASF methods support regular execution (annual or biennial cycles) for sustainable research programming in EU disaster resilience.

## Constraints

- **Tech Stack**: Mithril, Mithril Materialized, TypeScript, Vite, pnpm, translate.js, mithril-ui-form, meiosis-state
- **Deployment**: GitHub Pages static hosting only
- **Persistence**: Client-side IndexedDB (no backend server)
- **Collaboration**: WebRTC for real-time state synchronization
- **Languages**: EU languages (initial focus on English, Dutch, German, French)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| SPA with Mithril | Lightweight framework, good for GitHub Pages static deployment | ✓ Good — minimal runtime overhead |
| Meiosis state pattern | Unidirectional data flow with patches, works well with IndexedDB | ✓ Good — predictable state management |
| IndexedDB persistence | Allows session recovery when facilitator goes offline | ✓ Good — offline resilience |
| WebRTC for collaboration | Peer-to-peer without signaling server needed | ✓ Good — simple deployment |
| GitHub Pages deployment | Free hosting, matches existing project hosting | ✓ Good — no additional infrastructure |

---

*Last updated: 2026-03-09 after initialization*
