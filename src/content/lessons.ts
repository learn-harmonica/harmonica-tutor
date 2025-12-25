import { Lesson } from './types';

export const lessons: Lesson[] = [
  {
    id: 'first-sounds',
    title: 'First sounds: relaxed breath + find a clean note',
    summary:
      'Get your first reliable single note without strain, and learn a 30-second daily warmup you can reuse forever.',
    difficulty: 'beginner',
    recommendedKeys: ['C', 'G', 'A'],
    tags: ['fundamentals', 'breathing', 'single-notes'],
    steps: [
      {
        kind: 'read',
        title: 'Mindset and safety (how NOT to play)',
        body:
          'Use gentle air. Do not “suck hard” or “blow hard”. Keep your throat open and relaxed. If you feel dizzy, stop and breathe normally. The goal is a steady, relaxed airstream and a clean tone.'
      },
      {
        kind: 'practice',
        title: 'Long tones on hole 4 (easy starting point)',
        exercise: 'long-tones',
        prompt:
          'Try hole 4 blow for 3–5 seconds, then rest. Repeat 5 times. Then hole 4 draw. Aim for a steady pitch and no “chuffing”.',
        target: {
          hole: 4,
          breath: 'blow'
        }
      },
      {
        kind: 'practice',
        title: 'Single-note check (holes 4–6)',
        exercise: 'single-notes',
        prompt:
          'Play holes 4, 5, 6 blow as separate notes (one hole at a time). Then 4, 5, 6 draw. If you get multiple notes, move the harmonica deeper into your mouth and narrow your lips slightly.',
        target: {
          hole: 4,
          breath: 'blow'
        }
      },
      {
        kind: 'resource',
        title: 'Watch: first blues harmonica lesson',
        resourceId: 'youtube-gussow-first-lesson',
        prompt: 'Watch for fundamentals: holding, breath, and getting your first clean notes.'
      }
    ]
  },
  {
    id: 'single-notes-embouchure',
    title: 'Single notes: puckering vs tongue blocking',
    summary:
      'Compare two common approaches to single notes. Choose one to start, but keep the other as a long-term skill.',
    difficulty: 'beginner',
    recommendedKeys: ['C', 'G', 'A'],
    tags: ['single-notes', 'tongue-blocking', 'puckering', 'fundamentals'],
    steps: [
      {
        kind: 'read',
        title: 'Why two approaches exist',
        body:
          'Puckering is often quicker for beginners to isolate a single hole. Tongue blocking can unlock thicker tone, slaps/pulls, octaves, and classic blues textures. Many great players use both.'
      },
      {
        kind: 'practice',
        title: 'Choose one approach for today',
        exercise: 'single-notes',
        prompt:
          'Pick either puckering or tongue blocking. Get 10 clean repetitions of hole 4 blow. Then do 10 clean repetitions of hole 4 draw.',
        target: {
          hole: 4,
          breath: 'blow'
        }
      },
      {
        kind: 'resource',
        title: 'Watch: tongue blocking vs puckering',
        resourceId: 'youtube-learntheharp-tb-vs-pucker',
        prompt: 'Listen for tone differences and notice how relaxed the breath stays.'
      },
      {
        kind: 'read',
        title: 'If your tone is thin',
        body:
          'Try opening the back of your mouth (as if saying “ah”), keep lips relaxed, and cup your hands to make a small resonant chamber. The harmonica should sit deeper in the mouth than most beginners expect.'
      }
    ]
  },
  {
    id: 'first-blues-rhythm',
    title: 'First blues groove: shuffle rhythm and timing',
    summary:
      'Start sounding musical by focusing on rhythm first. You’ll learn the feel of a shuffle and a simple practice loop.',
    difficulty: 'beginner',
    recommendedKeys: ['C', 'G', 'A'],
    tags: ['blues', 'rhythm', 'fundamentals'],
    steps: [
      {
        kind: 'read',
        title: 'Rhythm first',
        body:
          'Blues harmonica is as much rhythm as it is notes. A steady groove with simple notes beats fancy licks with shaky timing.'
      },
      {
        kind: 'practice',
        title: 'Breath pulse drill',
        exercise: 'rhythm',
        prompt:
          'On a single hole (try 4 draw), play short notes in a steady “da-da-da-da” pulse for 20 seconds. Rest. Repeat 3 times. Keep volume even.',
        target: {
          hole: 4,
          breath: 'draw'
        }
      },
      {
        kind: 'read',
        title: 'Next steps (coming soon)',
        body:
          'In the next iteration, this lesson will include an embedded shuffle backing track and a call/response riff you can record and self-check.'
      }
    ]
  },
  {
    id: 'daily-warmup',
    title: 'Daily warmup: long tones + clean attacks',
    summary:
      'A simple 5-minute routine to build tone, breath control, and reliable single notes you can reuse forever.',
    difficulty: 'beginner',
    recommendedKeys: ['C', 'G', 'A'],
    tags: ['fundamentals', 'breathing', 'tone', 'single-notes'],
    steps: [
      {
        kind: 'read',
        title: 'Keep it easy',
        body:
          'Warmups should feel relaxed. If your throat tightens or your head feels light, stop and breathe normally. The goal is consistency, not volume.'
      },
      {
        kind: 'practice',
        title: 'Baseline long tones (hole 4 blow)',
        exercise: 'long-tones',
        prompt:
          'Play 5 long tones on hole 4 blow: 3–5 seconds each, with a short rest between. Keep the tone steady and comfortable.',
        target: {
          hole: 4,
          breath: 'blow'
        }
      },
      {
        kind: 'practice',
        title: 'Clean attacks (hole 4 draw)',
        exercise: 'single-notes',
        prompt:
          'Play 10 short notes on hole 4 draw (like saying “doo”). Aim for a clean start (no chuff) and consistent volume.',
        target: {
          hole: 4,
          breath: 'draw'
        }
      },
      {
        kind: 'resource',
        title: 'Read: warm-ups and workout',
        resourceId: 'harpsurgery-warmups-workout',
        prompt: 'Skim the structure and pick one mini-routine you can repeat daily for a week.'
      }
    ]
  },
  {
    id: 'cross-harp-basics',
    title: 'Cross harp (2nd position): your blues home base',
    summary:
      'Understand why diatonic blues often uses “second position”, and lock onto the home notes that make it feel stable.',
    difficulty: 'beginner',
    recommendedKeys: ['C', 'G', 'A'],
    tags: ['blues', 'fundamentals', 'single-notes'],
    steps: [
      {
        kind: 'read',
        title: 'What “position” means (in one paragraph)',
        body:
          'On a Richter diatonic, the blow notes give you the harp’s labeled key (1st position). The draw chord is built on the 5th, and blues players often treat that as “home” (2nd position / cross harp) because it gives a strong draw-based groove and expressive bends.'
      },
      {
        kind: 'resource',
        title: 'Read: harmonica techniques (positions + bends overview)',
        resourceId: 'wikipedia-harmonica-techniques',
        prompt: 'Skim the sections on positions and bending. Keep it conceptual for now.'
      },
      {
        kind: 'practice',
        title: 'Find the cross-harp “home” note (2 draw)',
        exercise: 'long-tones',
        prompt:
          'Play hole 2 draw as a relaxed long tone. This is a core anchor note for blues on most diatonic harmonicas. Repeat 5 times with rests.',
        target: {
          hole: 2,
          breath: 'draw'
        }
      },
      {
        kind: 'practice',
        title: 'Match it on 3 blow (same note, different feel)',
        exercise: 'long-tones',
        prompt:
          'Play hole 3 blow as a long tone. On many harps, this matches the 2 draw pitch. Alternate: 2 draw → 3 blow, slowly, keeping volume even.',
        target: {
          hole: 3,
          breath: 'blow'
        }
      },
      {
        kind: 'resource',
        title: 'Watch: explore a structured lesson playlist',
        resourceId: 'youtube-adam-gussow-playlist',
        prompt: 'Search within the playlist for “2nd position” or “shuffle” and follow one lesson end-to-end.'
      }
    ]
  },
  {
    id: 'twelve-bar-blues-form',
    title: '12-bar blues: count the form and keep time',
    summary:
      'Learn the most common blues form and practice staying in it with a simple pulse you can apply to real songs.',
    difficulty: 'beginner',
    recommendedKeys: ['C', 'G', 'A'],
    tags: ['blues', 'rhythm', 'listening'],
    steps: [
      {
        kind: 'read',
        title: 'The form matters more than the lick',
        body:
          'Many beginner problems are really “lost in the form”. If you can count a 12-bar cycle and keep a steady pulse, you can sound musical with very simple notes.'
      },
      {
        kind: 'resource',
        title: 'Read: twelve-bar blues (form + variations)',
        resourceId: 'wikipedia-twelve-bar-blues',
        prompt: 'Focus on the basic 12-bar structure first. Variations can wait.'
      },
      {
        kind: 'practice',
        title: '12-bar pulse drill (one note, steady time)',
        exercise: 'rhythm',
        prompt:
          'Set a slow tempo (tap your foot). For one full 12-bar cycle, play short notes on 2 draw in a steady pulse. Rest for 4 bars. Repeat 3 cycles.',
        target: {
          hole: 2,
          breath: 'draw'
        }
      },
      {
        kind: 'resource',
        title: 'Watch: mini blues lessons (pick one rhythm-focused clip)',
        resourceId: 'youtube-ronnie-shellist-mini-lessons',
        prompt: 'Pick one clip about groove/timing and copy the feel before copying notes.'
      }
    ]
  },
  {
    id: 'listening-lab',
    title: 'Listening lab: blues, jazz, and folk harmonica in 15 minutes',
    summary:
      'Train your ear with three short listening stops and simple prompts about tone, timing, and phrasing.',
    difficulty: 'beginner',
    recommendedKeys: ['C', 'G', 'A'],
    tags: ['listening', 'blues', 'jazz', 'folk', 'tone'],
    steps: [
      {
        kind: 'read',
        title: 'How to listen (a practical checklist)',
        body:
          'Listen for: (1) time feel (steady or rushing?), (2) note starts (clean or breathy?), (3) dynamics (soft vs loud), and (4) space (do they leave rests?). These are skills you can copy immediately.'
      },
      {
        kind: 'resource',
        title: 'Listen: Little Walter (Chicago blues tone concept)',
        resourceId: 'britannica-little-walter',
        prompt: 'Read the short bio and then listen to one classic track on your own. Notice the aggressive but controlled tone.'
      },
      {
        kind: 'resource',
        title: 'Listen: Toots Thielemans – “Bluesette” (jazz phrasing)',
        resourceId: 'youtube-toots-bluesette',
        prompt: 'Notice the vocal-like phrasing and how clear the melody stays even with vibrato.'
      },
      {
        kind: 'resource',
        title: 'Listen: DeFord Bailey (early country/folk harmonica)',
        resourceId: 'npr-deford-bailey',
        prompt: 'Read and then listen to a recording. Notice how rhythm and articulation carry the music.'
      }
    ]
  },
  {
    id: 'bending-first-steps',
    title: 'Bending first steps: start with a clean 4 draw',
    summary:
      'Before chasing bends, build a stable draw note and learn how to check bends honestly with your ear.',
    difficulty: 'intermediate',
    recommendedKeys: ['C', 'G', 'A'],
    tags: ['bending', 'fundamentals', 'blues', 'listening'],
    steps: [
      {
        kind: 'read',
        title: 'Bending is a control problem, not a force problem',
        body:
          'If you “suck harder” to bend, you’ll usually get a squeal or a messy multi-hole sound. The goal is a relaxed airway with a subtle tongue/throat shape change. Start by making the unbent note stable first.'
      },
      {
        kind: 'resource',
        title: 'Read: draw bends (mechanics and common pitfalls)',
        resourceId: 'harpsurgery-draw-bends',
        prompt: 'Skim the concepts and avoid pushing for speed. Focus on clean single-hole tone first.'
      },
      {
        kind: 'practice',
        title: 'Baseline: steady 4 draw (no bending yet)',
        exercise: 'long-tones',
        prompt:
          'Play 5 long tones on hole 4 draw. Aim for a stable pitch and consistent volume. If it sounds thin, open the back of your mouth (like “ah”).',
        target: {
          hole: 4,
          breath: 'draw'
        }
      },
      {
        kind: 'resource',
        title: 'Read: how to know your bend is in tune',
        resourceId: 'harpsurgery-bending-in-tune',
        prompt: 'Take the message seriously: “cheap imitations” sound bad in real music. Use your ear and go slow.'
      }
    ]
  }
];

export function getLesson(lessonId: string) {
  return lessons.find((l) => l.id === lessonId);
}
