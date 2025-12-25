import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getLesson } from '../content/lessons';
import { getLibraryItem } from '../content/library';
import { getLessonProgress, recordLessonStep } from '../progress/lessonProgress';

export default function LessonPage() {
  const { lessonId } = useParams();
  const lesson = useMemo(() => (lessonId ? getLesson(lessonId) : undefined), [lessonId]);
  const [stepIndex, setStepIndex] = useState(0);
  const skipNextRecordRef = useRef(false);

  useEffect(() => {
    if (!lessonId || !lesson) {
      return;
    }

    const progress = getLessonProgress(lessonId);
    const desiredIndex = progress ? Math.min(progress.lastStepIndex, lesson.steps.length - 1) : 0;
    skipNextRecordRef.current = progress !== null;
    setStepIndex((current) => (current === desiredIndex ? current : desiredIndex));
  }, [lesson, lessonId]);

  useEffect(() => {
    if (!lesson) {
      return;
    }

    if (skipNextRecordRef.current) {
      skipNextRecordRef.current = false;
      return;
    }

    recordLessonStep(lesson.id, stepIndex);
  }, [lesson, stepIndex]);

  const step = lesson?.steps[stepIndex];

  const practiceLink = useMemo(() => {
    if (!step || step.kind !== 'practice' || !step.target) {
      return null;
    }

    const params = new URLSearchParams();
    if (step.target.key) {
      params.set('key', step.target.key);
    }
    params.set('hole', String(step.target.hole));
    params.set('breath', step.target.breath);
    return `/practice?${params.toString()}`;
  }, [step]);

  if (!lesson) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Lesson not found</h2>
        <Link className="text-indigo-400 hover:text-indigo-300" to="/lessons">
          Back to lessons
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Link className="text-indigo-400 hover:text-indigo-300" to="/lessons">
          Back to lessons
        </Link>
        <h2 className="text-2xl font-semibold">{lesson.title}</h2>
        <p className="max-w-2xl text-slate-300">{lesson.summary}</p>
        <div className="text-sm text-slate-400">
          Recommended keys: {lesson.recommendedKeys.join(', ')}
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold">
            Step {stepIndex + 1} / {lesson.steps.length}: {step?.title}
          </h3>
          <div className="flex gap-2">
            <button
              className="rounded border border-slate-700 px-3 py-1 text-sm font-semibold text-slate-100 disabled:opacity-50"
              onClick={() => setStepIndex((i: number) => Math.max(0, i - 1))}
              disabled={stepIndex === 0}
              type="button"
            >
              Back
            </button>
            <button
              className="rounded bg-indigo-600 px-3 py-1 text-sm font-semibold text-white disabled:opacity-50"
              onClick={() => setStepIndex((i: number) => Math.min(lesson.steps.length - 1, i + 1))}
              disabled={stepIndex === lesson.steps.length - 1}
              type="button"
            >
              Next
            </button>
          </div>
        </div>

        <div className="mt-4">
          {step?.kind === 'read' && <p className="whitespace-pre-wrap text-slate-200">{step.body}</p>}

          {step?.kind === 'practice' && (
            <div className="space-y-2">
              <div className="text-sm font-semibold uppercase tracking-wide text-slate-400">Practice</div>
              <p className="whitespace-pre-wrap text-slate-200">{step.prompt}</p>
              <div className="text-xs text-slate-500">Exercise type: {step.exercise}</div>
              {practiceLink ? (
                <Link
                  className="inline-flex rounded bg-indigo-600 px-3 py-2 text-sm font-semibold text-white"
                  to={practiceLink}
                >
                  Open in Practice Lab
                </Link>
              ) : null}
            </div>
          )}

          {step?.kind === 'resource' && (
            <div className="space-y-2">
              <div className="text-sm font-semibold uppercase tracking-wide text-slate-400">Resource</div>
              {step.prompt ? <p className="text-slate-200">{step.prompt}</p> : null}
              {(() => {
                const item = getLibraryItem(step.resourceId);
                if (!item) {
                  return <p className="text-slate-300">Resource not found.</p>;
                }

                return (
                  <div className="space-y-1">
                    <a
                      className="text-indigo-400 hover:text-indigo-300"
                      href={item.url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {item.title}
                    </a>
                    <div className="text-xs text-slate-500">
                      Type: {item.type} · Accessed: {item.accessed}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
