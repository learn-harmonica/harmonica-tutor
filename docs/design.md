# Harmonica Tutor – Product & UX Design

## Target audience

- Absolute beginners with a 10-hole diatonic harmonica
- Learners who want to play real music quickly (Blues / Jazz / Folk focus)

## Core principles

- Short, doable steps with frequent “play something” moments
- Clear, honest guidance:
  - explain what the app can and cannot assess
  - encourage recording and self-listening
- Visual-first:
  - hole layout and simple tabs
  - animated “breath direction” prompts (later iteration)

## Information architecture

- **Home**
  - Choose harmonica key (C / G / A)
  - Recommended learning path
  - Resume last lesson

- **Lessons**
  - Lesson list (Beginner → Intermediate)
  - Each lesson has steps (read / listen / watch / practice)

- **Practice Lab**
  - Microphone check
  - Long tones, single-note accuracy drills
  - Bend trainer (later iteration)
  - Simple groove practice (metronome + backing track later)

- **Library**
  - Curated external resources (videos, podcasts, articles)
  - Filter by topic (breathing, bends, rhythm, blues phrasing, jazz phrasing)

- **Progress**
  - Completed lessons
  - Streak / time spent (optional)

## Key user flows

- **First-run (10 minutes)**
  - Pick key (default to C)
  - Learn blow/draw + single notes
  - Play a first riff

- **Daily practice (10–20 minutes)**
  - Resume lesson or choose a drill
  - Record a short take
  - Get feedback on:
    - target note proximity (cents)
    - stability
    - sustain

## Content strategy

- Start with C harmonica as the primary path.
- Provide “Transfer to G/A” quick lessons that reuse the same concepts.
- Provide a Blues path (2nd position) as the default improvisation route.
- Provide optional Jazz track with chromatic harmonica references and advanced diatonic techniques.

## Privacy and permissions

- Microphone is opt-in per session.
- Audio analysis is done locally.
- Progress is stored in localStorage.

## Tab Recording Feature Designs

### Overview
The Practice Lab will gain a new feature to record detected sounds as harmonica tablature (tab) and replay them from that notation. This helps beginners visualize and practice sequences of notes.

### Design 1: Simple Tab Recorder (MVP)
**Concept**: Record practice sessions as tab sequences, replay by synthesizing notes.

**Recording**:
- Use pitch detection to map frequencies to harmonica holes (e.g., C4 = hole 4 blow).
- Capture sequence of tab symbols with timestamps (e.g., ["4", "-4", "5"] with start times).
- Store in localStorage as JSON: `{ tab: ["4", "-4"], timestamps: [0, 500] }`.

**Display**:
- Show tab as text string in Practice Lab UI (e.g., "4 -4 5 5").
- Add "Record Tab" button alongside audio recording.

**Replay**:
- Use Web Audio API to generate tones for each hole/pitch.
- Play sequentially with original timing gaps.
- Add "Play Tab" button to replay the sequence.

**Pros**: Simple implementation, leverages existing pitch detection, fits beginner focus.
**Cons**: No rhythm, basic playback.
**Effort**: Low (1-2 days).

### Design 2: Rhythm-Aware Tab Recorder
**Concept**: Include note durations for rhythmic playback.

**Recording**:
- Detect note on/off events with durations (e.g., note held for 500ms).
- Store as tab with timing: `{ tab: ["4", "-4"], durations: [500, 300] }`.

**Display**:
- Show tab with rhythm indicators (e.g., "4 (♪)" for quarter notes).
- Visualize as simple score or scrolling tab.

**Replay**:
- Synthesize audio with correct durations/timing.
- Allow tempo adjustment for practice.

**Pros**: More musical, helps with timing practice.
**Cons**: Requires duration detection (complexer pitch analysis).
**Effort**: Medium (3-5 days).

### Design 3: Interactive Tab with Audio Samples
**Concept**: Combine tab with recorded audio snippets for authentic replay.

**Recording**:
- Capture both tab sequence and short audio clips for each note.
- Store as: `{ tab: ["4"], audioBlobs: [blob] }`.

**Display**:
- Show tab text, highlight current note during playback.
- Scroll tab visually like karaoke.

**Replay**:
- Play recorded audio clips in sequence (better sound quality).
- Fallback to synthesis if audio unavailable.

**Pros**: Authentic sound, visual feedback.
**Cons**: Higher storage (audio files), more complex.
**Effort**: High (5-7 days).

### Implementation Plan
- Start with Design 1 for quick win.
- After completion, implement staff notation for full rhythm/timing support.
- Follow TDD: Write unit tests first for tab conversion logic.
- Add e2e tests with Playwright for UI integration.

## Staff Notation Design

### Overview
After implementing tab recording, add standard musical staff notation to display recorded sessions with rhythm, timing, and traditional notation. This provides a more complete music learning experience.

### Key Features
- **Notation Display**: Render standard treble clef staff with notes, rests, rhythms, and dynamics.
- **Harmonica-Specific Elements**: Indicate blow/draw with note colors or symbols, bends with accidentals or annotations.
- **Rhythm Integration**: Capture and display note durations (quarter notes, eighth notes, etc.).
- **Playback**: Synchronize visual playback with audio replay, highlighting current notes.

### Technical Approach
- **Library**: Use VexFlow for rendering musical notation in SVG.
- **Data Model**: Extend tab data with duration and rhythm information.
- **UI Component**: Create a `StaffNotation` component that takes tab data and renders the score.
- **Recording**: Enhance pitch detection to estimate note durations and rests.

### Implementation Steps
1. Install VexFlow library.
2. Create utility functions to convert tab data to VexFlow notation objects.
3. Build `StaffNotation` component with SVG rendering.
4. Update recording logic to capture durations.
5. Add staff view toggle in Practice Lab.
6. Integrate with existing replay functionality.

### Pros
- Provides traditional music notation familiarity.
- Supports complex rhythms and timing.
- Enhances learning with visual music theory.

### Cons
- Higher complexity and learning curve.
- Requires additional library dependency.
- More resource-intensive rendering.

This complements the tab system, offering both simplified and traditional notation views.
