# Architecture Decision Log

Use this file for decisions that affect product scope, data contracts, privacy, cost or architecture. Add newest decisions at the top.

## ADR-0001 — Topic-independent core

- **Status:** Accepted
- **Decision:** Mughal Empire is sample content only; all domain models and UI flows must support arbitrary topics and uploaded material.
- **Reason:** The product goal is a general learning storytelling tool, not a single-subject app.

## ADR-0002 — Reusable visual assets first

- **Status:** Accepted
- **Decision:** Scenes must work with reusable portraits, backgrounds, SVGs, CSS animation and text. Per-scene AI image/video generation is optional, never mandatory.
- **Reason:** Cost, speed, offline support and low-end Android compatibility.

## ADR-0003 — User-confirmed source ranges

- **Status:** Accepted
- **Decision:** PDF TOC/headings/page detection can suggest ranges, but the user confirms the selected chapter/pages/text before generation.
- **Reason:** Prevent irrelevant content, preserve user control and improve source accuracy.
