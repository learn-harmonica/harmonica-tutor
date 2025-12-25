# Harmonica Tutor – Architecture

## Goals

- Provide a beginner-friendly path to learn diatonic harmonica (keys C, G, A)
- Emphasize Blues, Jazz, and Folk, while staying open to fun repertoire from other genres
- Make practice interactive with:
  - Visual hole layouts and tabs
  - Embedded external lessons (YouTube, podcasts, articles) with traceable citations
  - Microphone-based practice exercises that give honest feedback

## Non-goals (initial scope)

- No required backend accounts
- No mandatory cloud uploads of audio
- No “grading” that pretends to be perfect; feedback should be practical and transparent about limitations

## Tech stack

- Frontend: React + TypeScript (Vite)
- Styling: TailwindCSS
- Testing: Vitest + React Testing Library
- Audio: Web Audio API + MediaRecorder (local analysis)
- Storage: localStorage for progress and preferences

## High-level modules

- **Content**
  - Curated references (`docs/references.md`) and in-app reference registry
  - Lesson content as TypeScript data (typed schema)

- **Lesson engine**
  - Renders lesson steps (reading, video/audio embeds, practice prompts)
  - Tracks progress per lesson and step

- **Practice / audio engine**
  - Requests microphone permission
  - Captures short practice takes
  - Extracts pitch estimates (fundamental frequency) from audio frames
  - Produces transparent scoring signals:
    - accuracy vs target note (cents)
    - stability (variance)
    - duration / sustain

## Privacy model

- Microphone access is explicitly requested by the browser.
- Audio analysis is performed in-browser.
- The default mode stores only derived metrics (e.g., detected pitch curve, score) and user progress; raw recordings can be kept in-memory unless the user explicitly saves them.

## Accessibility

- Keyboard navigable UI
- Sufficient contrast and clear typography
- Captions/transcripts linked for referenced media where available

## Testing strategy

- **Unit tests**
  - Lesson schema validation helpers
  - Pitch detection algorithm (synthetic sine waves)
  - Note-name mapping and tolerance checks

- **Component tests**
  - Lesson rendering
  - Step navigation and progress persistence
  - Practice UI state (start/stop/error states) using mocks
