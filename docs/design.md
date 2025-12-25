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
