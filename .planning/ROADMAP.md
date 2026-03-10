# Roadmap: DASF Toolset

**Version:** 1.0
**Created:** 2026-03-09
**Granularity:** Coarse (3-5 phases)
**Mode:** YOLO (auto-advance)

## Phases

- [x] **Phase 1: Foundation** - Set up project infrastructure, i18n, and build configuration
- [ ] **Phase 2: State Management** - Implement meiosis pattern with IndexedDB persistence
- [ ] **Phase 3: Session Collaboration** - Enable WebRTC-based facilitator-participant sessions
- [ ] **Phase 4: Questionnaires** - Render DASF assessment forms and enable facilitator access

---

## Phase Details

### Phase 1: Foundation

**Goal:** Establish project infrastructure, internationalization, and deployment configuration so developers can build and the app can run in multiple languages.

**Depends on:** Nothing (first phase)

**Requirements:** INFRA-01, INFRA-02, INFRA-03, INFRA-04, I18N-01, I18N-02, I18N-03

**Success Criteria** (what must be TRUE when this phase completes):
1. Developer can run `pnpm dev` and the Mithril app loads with TypeScript compilation
2. App displays text in English, Dutch, German, and French with working language switcher
3. Dev environment links to localhost, production links to GitHub Pages automatically
4. Build outputs a static site ready for GitHub Pages docs folder deployment

**Plans:** 3/3 plans complete

Plans:
- [x] 01-PLAN.md — Project scaffolding with pnpm, TypeScript, and Vite
- [x] 02-PLAN.md — Mithril SPA foundation with routing and components
- [x] 03-PLAN.md — Internationalization with translate.js and language switcher

---

### Phase 2: State Management

**Goal:** Implement meiosis pattern with IndexedDB persistence so the application can maintain state across browser sessions and recover from offline periods.

**Depends on:** Phase 1 (needs infrastructure to run)

**Requirements:** STATE-01, STATE-02, STATE-03

**Success Criteria** (what must be TRUE when this phase completes):
1. State is initialized using meiosis pattern with unidirectional data flow
2. State changes are automatically persisted to IndexedDB on every update
3. When user revisits the app after closing, their previous session state is restored from IndexedDB

**Plans:** TBD

---

### Phase 3: Session Collaboration

**Goal:** Enable facilitator to create sessions and participants to join via WebRTC, with real-time state synchronization.

**Depends on:** Phase 2 (needs state to share)

**Requirements:** SESSION-01, SESSION-02, SESSION-03, SESSION-04, SESSION-05

**Success Criteria** (what must be TRUE when this phase completes):
1. Facilitator can create a new session and see a QR code with the room ID
2. Participant can join a session by scanning the QR code or entering the room URL
3. State changes made by facilitator appear on all participant screens in real time
4. State changes made by participants appear on the facilitator screen in real time
5. If session is interrupted, participants can reload and recover shared state from IndexedDB

**Plans:** TBD

---

### Phase 4: Questionnaires

**Goal:** Render DASF assessment forms using mithril-ui-form and enable facilitator access to session controls.

**Depends on:** Phase 3 (needs sessions to have content)

**Requirements:** QNA-01, QNA-02, QNA-03

**Success Criteria** (what must be TRUE when this phase completes):
1. User can navigate to a session and see the four DASF phases (I&P, NGA, SA, RM) as questionnaires
2. Each questionnaire renders as interactive forms using mithril-ui-form
3. Only facilitators who created a room can access the session's questionnaires (authentication via room creation)

**Plans:** TBD

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1 - Foundation | 3/3 | Complete    | 2026-03-10 |
| 2 - State Management | 0/3 | Not started | - |
| 3 - Session Collaboration | 0/5 | Not started | - |
| 4 - Questionnaires | 0/3 | Not started | - |

---

*Roadmap last updated: 2026-03-10*
