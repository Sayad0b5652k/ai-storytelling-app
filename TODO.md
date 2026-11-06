# Delivery TODO

## Outcome 1 — Any-topic story setup

- [x] The user can enter any topic manually; Mughal Empire appears only as a sample suggestion.
- [x] The user can choose language, story length, learning level and presentation mode.
- [x] The setup UI explains the distinction between material-only, research and hybrid modes.

## Outcome 2 — Material selection foundation

- [x] The user can switch to material mode and see a PDF-style preview with zoom controls, page thumbnails, detected TOC/headings and a selectable page range.
- [x] The selected range is shown for confirmation before generation.
- [ ] Replace the simulated material preview with real local PDF text extraction and OCR fallback.

## Outcome 3 — Structured story generation

- [x] Generation returns a structured story with episodes, scenes, narration, dialogue, source references, facts and quiz data.
- [x] A reusable deterministic sample fixture keeps the experience functional when the AI service is unavailable.
- [x] The server has a replaceable built-in LLM adapter boundary.
- [ ] Add validated JSON-schema LLM output and source-preserving extraction once real material ingestion is connected.

## Outcome 4 — Storytelling experience

- [x] Novel mode presents episodes and scenes in a readable story flow.
- [x] Comic mode presents reusable background/character keys, dialogue bubbles and lightweight CSS motion.
- [x] The reader supports episode navigation, progress indication, bookmarks and adjustable text size.
- [x] Dramatic interpretation and verified facts are visually distinguished.

## Outcome 5 — Local learning loop

- [x] Generated stories can be saved locally and reopened from the library.
- [x] Reading progress and the last active episode persist locally.
- [x] Each episode exposes a knowledge-check quiz with immediate feedback.
- [ ] Add revision mode with timeline, important dates and long-answer prompts.

## Outcome 6 — Repository collaboration

- [x] Shared collaboration rules remain canonical in `COLLABORATION.md`.
- [x] Project plan and TODO are kept with the source.
- [ ] Sync the working slice to `Sayad0b5652k/ai-storytelling-app` after validation.
