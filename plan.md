# AI Storytelling App — First Vertical Slice Plan

## Goal

Deliver a working, subject-agnostic learning story studio that proves the product loop without depending on per-scene image or video generation:

`topic/material intent → source/range confirmation → structured story → novel/comic reader → local save → episode quiz`

Mughal Empire is a sample fixture, not a product restriction.

## Implementation approach

The first slice will use a lightweight web runtime with a responsive, portrait-first interface. A Node server will serve the app and expose one generation endpoint. The browser will own presentation state and local persistence. The server endpoint will use the built-in Manus LLM when its runtime credentials are available, with a deterministic structured fixture fallback so the core reader remains demonstrable without an external provider or a new image for every scene.

The story contract will be explicit JSON: story metadata, episodes, scenes, source references, facts, dialogue, reusable asset keys and quiz questions. The source-selection panel will support topic input plus a material simulation that models PDF page count, TOC/headings and selected page ranges. Real PDF parsing/OCR will be isolated as the next material-mode implementation rather than pretending that a file was processed in this slice.

Novel mode will present readable chapter flow and source badges. Comic mode will compose scene cards from reusable portrait/background keys, speech bubbles and lightweight CSS motion. Local storage will save stories and reading progress without an account.

## Design direction

Three candidates were considered: (0.06) archival research desk, (0.08) editorial story atlas, and (0.04) cinematic study journal. The selected direction is **editorial story atlas**.

### Design movement

A modern editorial reading room: part annotated atlas, part serialized magazine, with a warm paper field and a dark ink control rail.

### Core principles

1. Make the next learning action obvious.
2. Let sources feel inspectable rather than hidden.
3. Use visual rhythm to make study content feel like an episode.
4. Keep controls calm, compact and thumb-friendly.

### Color philosophy

Use ink-black and deep blue for trustworthy navigation, warm bone for reading surfaces, and a single saffron signal for actions and source highlights. The accent should feel like a bookmark or editorial mark, not a generic neon CTA.

### Layout paradigm

Use a split editorial workspace on wide screens: a narrow left rail for studio steps and a reading surface that opens into a scene timeline. On small screens the rail becomes a top stepper and the reading surface becomes a single-column scroll.

### Signature elements

A numbered “story route” stepper; source chips that retain page/range context; scene cards with a vertical spine and a small “director note” label for dramatic interpretation.

### Interaction philosophy

Every major action should produce visible state: selected range, generated mode, saved state, current episode and quiz feedback. Avoid modal-heavy navigation. Use progressive disclosure for advanced controls.

### Animation

Use short 160–220ms ease-out transitions for panel changes, a subtle scene-spine reveal on reader entry, and restrained floating movement on comic assets. Respect `prefers-reduced-motion` and never make content depend on animation.

### Typography system

Use a strong editorial serif for story titles and episode headings, paired with a clean sans-serif for controls, metadata and body UI. Keep body text at readable line-height with a minimum mobile size of 16px.

### Brand essence

A story studio that turns study material into something you can remember. Personality: curious, grounded, cinematic.

### Brand voice

Headlines should be direct and inviting; controls should describe outcomes. Examples: “Choose what the story should remember.” and “Turn this range into an episode.”

### Wordmark and logo

Use a compact route-mark: three stacked page lines with a saffron dot moving from the margin into the center, representing a source becoming a story.

### Signature brand color

Saffron `#E8A23A`, used sparingly for action states, source markers and the route-mark.

## Project structure

- `server/index.mjs`: static server and `/api/generate-story` endpoint.
- `src/index.html`: application shell and accessible landmarks.
- `src/styles.css`: responsive visual system, reader/comic modes and motion.
- `src/app.js`: client state, generation flow, local save, reader, quiz and rendering.
- `content/sample-story.json`: source-aware Mughal sample fixture.
- `public/manus-routes.json`: route manifest for the Webdev host.
- `TODO.md`: outcome-based delivery status.

## Boundaries and follow-ups

This slice does not claim real PDF extraction, OCR, external web research, account sync, managed database persistence, or custom image generation. The UI establishes the correct user-confirmation point and data shapes so those capabilities can be added without redesigning the story reader.
