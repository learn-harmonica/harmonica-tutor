import { Link } from 'react-router-dom';

import { lessons } from '../content/lessons';
import { getLessonProgress } from '../progress/lessonProgress';

export default function LessonsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Lessons</h2>

      <div className="grid gap-3">
        {lessons.map((lesson) => {
          const progress = getLessonProgress(lesson.id);
          const completedSteps = progress ? Math.min(progress.maxStepIndex + 1, lesson.steps.length) : 0;
          const percent = lesson.steps.length > 0 ? completedSteps / lesson.steps.length : 0;

          return (
            <Link
              key={lesson.id}
              to={`/lessons/${lesson.id}`}
              className="rounded-lg border border-slate-800 bg-slate-900/30 p-4 hover:bg-slate-900/50"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-slate-400">{lesson.difficulty}</div>
                  <h3 className="mt-1 text-lg font-semibold">{lesson.title}</h3>
                </div>
                <div className="text-right text-xs text-slate-500">
                  Keys: {lesson.recommendedKeys.join(', ')}
                </div>
              </div>

              <p className="mt-2 text-sm text-slate-300">{lesson.summary}</p>

              <div className="mt-3 flex items-center gap-3">
                <div className="h-2 flex-1 rounded bg-slate-800">
                  <div
                    className="h-2 rounded bg-indigo-500"
                    style={{ width: `${Math.round(percent * 100)}%` }}
                  />
                </div>
                <div className="text-xs text-slate-500">
                  {completedSteps}/{lesson.steps.length} steps
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
