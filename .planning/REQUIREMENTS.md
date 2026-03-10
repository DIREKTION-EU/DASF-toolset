# Requirements: DASF Toolset

**Defined:** 2026-03-09
**Core Value:** Safety professionals can collaboratively assess disaster management capabilities, identify gaps, and build roadmaps for research and solution adoption through structured facilitator-led sessions.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Application Infrastructure

- [x] **INFRA-01**: Build SPA using Mithril, Mithril Materialized, and TypeScript
- [x] **INFRA-02**: Use pnpm for dependency management with Vite for development
- [x] **INFRA-03**: Deploy to GitHub Pages docs folder as static site
- [x] **INFRA-04**: Configure dev mode to link to localhost, production to GitHub Pages

### Internationalization

- [x] **I18N-01**: Implement i18n with translate.js
- [x] **I18N-02**: Support EU languages (English, Dutch, German, French)
- [x] **I18N-03**: Allow language switching in the UI

### State Management

- [ ] **STATE-01**: Manage state using meiosis pattern
- [ ] **STATE-02**: Persist state to IndexedDB for offline recovery
- [ ] **STATE-03**: Enable session recovery when facilitator comes back online

### Session Collaboration

- [ ] **SESSION-01**: Support facilitator session creation via WebRTC
- [ ] **SESSION-02**: Generate QR code for room joining
- [ ] **SESSION-03**: Enable participant joining via URL with room ID
- [ ] **SESSION-04**: Share application state between facilitator and participants
- [ ] **SESSION-05**: Persist shared state to IndexedDB

### Questionnaires

- [ ] **QNA-01**: Use mithril-ui-form for questionnaire rendering
- [ ] **QNA-02**: Support the four DASF phases (I&P, NGA, SA, RM)
- [ ] **QNA-03**: Implement facilitator access authentication via room creation

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Moderation and Admin

- **ADMIN-01**: Facilitator can view all participant responses
- **ADMIN-02**: Facilitator can export session data
- **ADMIN-03**: Admin dashboard for multiple active sessions

### Advanced Collaboration

- **COLLAB-01**: Session notes with rich text formatting
- **COLLAB-02**: Annotated shared state changes
- **COLLAB-03**: Session recording and playback

### Analytics

- **ANALYTICS-01**: Aggregate anonymous response patterns
- **ANALYTICS-02**: Export session reports as PDF
- **ANALYTICS-03**: Track session duration and completion rates

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Mobile native apps | Web-first approach, responsive web app only |
| OAuth/social login | Initial auth via room URL only |
| Real-time chat | WebRTC for state sync only, no voice/video |
| Database backend | Client-side IndexedDB only, no server-side storage |
| User accounts | Sessions are room-based, no persistent user profiles |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 1 | Complete |
| INFRA-02 | Phase 1 | Complete |
| INFRA-03 | Phase 1 | Complete |
| INFRA-04 | Phase 1 | Complete |
| I18N-01 | Phase 1 | Complete |
| I18N-02 | Phase 1 | Complete |
| I18N-03 | Phase 1 | Complete |
| STATE-01 | Phase 2 | Pending |
| STATE-02 | Phase 2 | Pending |
| STATE-03 | Phase 2 | Pending |
| SESSION-01 | Phase 3 | Pending |
| SESSION-02 | Phase 3 | Pending |
| SESSION-03 | Phase 3 | Pending |
| SESSION-04 | Phase 3 | Pending |
| SESSION-05 | Phase 3 | Pending |
| QNA-01 | Phase 4 | Pending |
| QNA-02 | Phase 4 | Pending |
| QNA-03 | Phase 4 | Pending |

**Coverage:**

- v1 requirements: 17 total
- Mapped to phases: 17
- Unmapped: 0 ✓

---

*Requirements defined: 2026-03-09*
*Last updated: 2026-03-09 after roadmap creation*
