import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Learn diatonic harmonica (C, G, A)</h2>
        <p className="max-w-2xl text-slate-300">
          This tutorial is built for complete beginners and focuses on Blues, Jazz, and Folk. You’ll learn
          single notes, rhythm, simple melodies, and foundational blues phrasing.
        </p>
      </section>

      <section className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
        <h3 className="text-lg font-semibold">Start here</h3>
        <p className="mt-1 text-slate-300">Begin with the first lesson using your C harmonica.</p>
        <div className="mt-4 flex gap-3">
          <Link
            to="/lessons"
            className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Go to lessons
          </Link>
          <Link
            to="/practice"
            className="rounded border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-900"
          >
            Open practice lab
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
          <h4 className="font-semibold">Blues</h4>
          <p className="mt-1 text-sm text-slate-300">12-bar form, shuffle feel, bends, tone, and call/response.</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
          <h4 className="font-semibold">Jazz</h4>
          <p className="mt-1 text-sm text-slate-300">Swing, phrasing, and melodic vocabulary (optional track).</p>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
          <h4 className="font-semibold">Folk</h4>
          <p className="mt-1 text-sm text-slate-300">Simple tunes and musicality-first practice habits.</p>
        </div>
      </section>
    </div>
  );
}
