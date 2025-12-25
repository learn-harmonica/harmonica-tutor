import { libraryItems } from '../content/library';

export default function LibraryPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Library</h2>

      <div className="grid gap-3">
        {libraryItems.map((item) => (
          <div key={item.id} className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
            <a className="text-indigo-400 hover:text-indigo-300" href={item.url} target="_blank" rel="noreferrer">
              {item.title}
            </a>
            <div className="mt-1 text-xs text-slate-500">
              Type: {item.type} · Accessed: {item.accessed}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
