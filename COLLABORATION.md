# Collaboration Contract

This is the canonical collaboration file for the AI Storytelling App. Manus, Claude, Google AI Studio, coding agents and human contributors must follow it. If another instruction conflicts with this file, stop and record the conflict in an issue or decision note before changing shared architecture.

## 1. Product context

This is a topic-independent educational storytelling app. Mughal Empire is only the first prototype topic. The product must support arbitrary user topics and uploaded study material, including PDF table-of-contents detection, zoom, page-range/chapter/text selection, OCR for scanned pages, source references, story generation, reusable visuals, novel/comic modes, local saving and quizzes.

## 2. Source of truth

- `README.md` is the public project overview.
- `COLLABORATION.md` is the shared agent and contributor contract.
- `docs/ARCHITECTURE.md` records current technical boundaries.
- `docs/ROADMAP.md` records delivery priority.
- `docs/DECISIONS.md` records important decisions and their rationale.
- Code and tests are the source of truth for implemented behavior.
- Never treat generated output, chat messages or assumptions as implemented functionality.

## 3. Before starting work

1. Read this file and the relevant documentation.
2. Inspect the current branch, recent commits and changed files.
3. Check for an existing issue, task or decision note.
4. Define the smallest vertical slice that proves the behavior.
5. Do not rewrite another agent's work without understanding its intent.

## 4. Task and branch rules

- Use one focused branch per feature or fix: `feature/<short-name>`, `fix/<short-name>`, `docs/<short-name>`, or `chore/<short-name>`.
- Keep commits small and coherent. Use imperative messages such as `Add PDF range selection model`.
- Do not commit secrets, API keys, personal documents, private study PDFs or generated credentials.
- Do not force-push shared branches.
- Keep `main` buildable and reviewable.
- Prefer pull requests for substantial changes. Include scope, screenshots/logs where useful, tests run, risks and follow-up work.

## 5. Agent handoff protocol

When an agent starts work, it should state or record:

- **Owner:** agent or person
- **Goal:** one sentence
- **Scope:** files/modules it may change
- **Out of scope:** explicitly excluded work
- **Status:** planned, in progress, blocked or complete

When handing off, provide:

- What changed and why
- Files changed
- Commands/tests run and results
- Known limitations
- Exact next step

If working in the same checkout, inspect `git status` before editing and do not overwrite uncommitted changes belonging to another agent.

## 6. Communication between Manus, Claude and AI Studio

Use structured messages in issues, pull requests or `docs/DECISIONS.md`:

```text
[HANDOFF]
Owner: <agent/person>
Task: <short task>
Status: <planned|in progress|blocked|complete>
Changed: <files or modules>
Validation: <commands and result>
Needs: <specific request, or none>
```

For design disagreements:

```text
[DECISION-REQUEST]
Question: <specific decision>
Options: A / B / C
Constraints: <cost, offline, Android, accuracy, licensing>
Recommendation: <option and reason>
Decision owner: <person/agent>
```

Agents must not silently change an API, schema, data contract or architectural boundary. Record the change first or include a decision note in the same pull request.

## 7. AI and educational accuracy rules

- Never present invented historical events, dates, names or quotations as facts.
- Separate `verified_fact`, `source_reference`, `dramatic_interpretation` and `fictional_dialogue` in the data model and UI where applicable.
- Preserve the selected source range and page references through extraction and generation.
- User material mode must not silently add external research.
- Research mode must cite sources and identify uncertainty.
- OCR output must be previewable and editable before story generation.
- If confidence is low, ask for confirmation or label the uncertainty; do not guess.

## 8. Privacy, safety and licensing

- Personal PDFs remain local by default and must not be uploaded without explicit user choice.
- Minimise telemetry and never log document contents, tokens or personal data.
- Store provider keys only in secure environment configuration, never in the repository.
- Every external visual asset must have license and attribution metadata.
- Do not copy copyrighted textbook pages or third-party assets into the repository without permission.

## 9. Engineering standards

- Prefer modular, testable components and typed data contracts.
- Keep AI providers behind replaceable interfaces.
- Cache deterministic extraction and generation results where safe.
- Design for offline reading even when generation requires network access.
- Add tests for parsing, page-range selection, source attribution, story schema validation and local persistence.
- Avoid heavy dependencies when a simpler solution works on low-end Android.
- Update documentation when behavior or setup changes.

## 10. Definition of done

A change is complete only when:

- The requested behavior is implemented or the limitation is documented.
- Existing tests pass and relevant new tests are added.
- No secrets or private user material are committed.
- Accessibility and low-end Android impact were considered.
- Documentation and schemas are updated where needed.
- The handoff summary is written in the PR or commit description.

## 11. Conflict resolution

1. Protect user data, source accuracy and build stability first.
2. Prefer the smallest reversible change.
3. Record unresolved questions instead of guessing.
4. Ask the project owner when product scope, external cost, licensing or data handling is affected.

Last updated: 2026-11-06
