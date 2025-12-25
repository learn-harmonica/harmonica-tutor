export type HarmonicaKey = 'C' | 'G' | 'A';

export type LibraryItemType = 'article' | 'video' | 'podcast';

export type LibraryTag =
  | 'history'
  | 'fundamentals'
  | 'breathing'
  | 'single-notes'
  | 'tongue-blocking'
  | 'puckering'
  | 'blues'
  | 'jazz'
  | 'folk'
  | 'bending'
  | 'tone'
  | 'rhythm'
  | 'listening';

export interface LibraryItem {
  id: string;
  title: string;
  type: LibraryItemType;
  url: string;
  accessed: string;
  tags: LibraryTag[];
  credit?: string;
  notes?: string;
}

export type LessonDifficulty = 'beginner' | 'intermediate';

export type LessonStep =
  | {
      kind: 'read';
      title: string;
      body: string;
    }
  | {
      kind: 'resource';
      title: string;
      resourceId: string;
      prompt?: string;
    }
  | {
      kind: 'practice';
      title: string;
      exercise: 'long-tones' | 'single-notes' | 'rhythm';
      prompt: string;
      target?: {
        key?: HarmonicaKey;
        hole: number;
        breath: 'blow' | 'draw';
      };
    };

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  difficulty: LessonDifficulty;
  recommendedKeys: HarmonicaKey[];
  tags: LibraryTag[];
  steps: LessonStep[];
}
