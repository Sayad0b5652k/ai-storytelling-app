# Architecture Notes

## Product pipeline

```text
Topic or PDF
  -> PDF preview / zoom / thumbnails
  -> TOC, heading and page detection
  -> OCR when required
  -> user chapter/page/text-range confirmation
  -> source-preserving extraction
  -> story planner
  -> scenes, narration, dialogue, visuals and quiz
  -> novel/comic presentation
  -> local save, progress and offline reading
```

## Core domain objects

- `SourceDocument`: local document metadata, page count, checksum and extraction status.
- `SourceRange`: selected pages, chapter IDs or text spans with source references.
- `ExtractedSection`: cleaned text, headings, confidence and page mapping.
- `Story`: topic, language, level, style, source mode and episodes.
- `Episode`: scenes, summary, facts, dates, names and quiz.
- `Scene`: narration, dialogue, characters, background, transition and source references.
- `Asset`: reusable visual asset, tags, license, attribution and variants.

## Non-negotiable boundaries

1. Source extraction must be separate from story generation.
2. Story generation must produce structured data before presentation rendering.
3. AI providers must be replaceable through an adapter interface.
4. Local persistence must not require account creation.
5. Visual selection must prefer catalogued/reusable assets and expose fallback behavior.
6. Facts and fictional dialogue must remain distinguishable in the schema.

The implementation technology can be selected during the first engineering spike, but these boundaries should remain stable.
