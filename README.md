# AI Storytelling App

A topic-independent learning and storytelling app that turns user-entered topics or selected study material into accurate, engaging stories.

## Product direction

The app is not limited to Mughal history. Users will be able to enter any topic or import study material, inspect its table of contents, select chapters/pages/text ranges, and generate educational stories with narration, dialogue, reusable visuals, summaries, and quizzes.

The first prototype uses the Mughal Empire as sample content only. The product architecture must remain subject-agnostic.

## Core principles

- **Source-aware:** distinguish verified facts, source references, and fictional/dramatic dialogue.
- **User-controlled:** preview extracted material and confirm page/chapter ranges before generation.
- **Asset-reuse first:** reusable characters, poses, backgrounds, SVGs, CSS animation and text storytelling are preferred over generating media for every scene.
- **Offline-friendly:** saved stories and downloaded assets should remain readable without an account or mandatory cloud storage.
- **Replaceable AI:** providers must be isolated behind interfaces to avoid vendor lock-in.
- **Android-first:** keep the experience usable on low-end Android devices.

## Repository map

- `COLLABORATION.md` — shared rules for Manus, Claude, AI Studio and human contributors.
- `docs/ARCHITECTURE.md` — product and technical architecture notes.
- `docs/ROADMAP.md` — phased delivery plan.
- `docs/DECISIONS.md` — architecture decision record index.
- `app/` — application source (to be initialized in the next implementation step).
- `assets/` — reusable visual assets and metadata.
- `content/` — sample stories, schemas and fixtures.
- `scripts/` — development and validation utilities.

## Current status

Repository bootstrap complete. The next milestone is a thin vertical slice: topic/material selection → structured story generation → novel/comic reading → local save → quiz.

## Collaboration

Read [`COLLABORATION.md`](./COLLABORATION.md) before changing the repository.

## Working prototype

The first vertical slice now runs as a lightweight responsive web app. Start it with `npm run dev` and open `http://localhost:3000`.

It includes any-topic setup, a material-mode PDF selection foundation with zoom and page-range confirmation, a built-in AI generation adapter with a safe offline fallback, novel and comic reader modes, reusable CSS visual assets, local story saving, reading progress and episode quizzes. Real PDF extraction/OCR and source-preserving research ingestion remain the next material-mode milestone.

Implementation lives in `src/`, `server/`, `content/` and `public/`; the shared rules remain in [`COLLABORATION.md`](./COLLABORATION.md).
