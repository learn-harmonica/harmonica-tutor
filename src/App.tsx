import { NavLink, Route, Routes } from 'react-router-dom';

import HomePage from './pages/HomePage';
import LessonPage from './pages/LessonPage';
import LessonsPage from './pages/LessonsPage';
import LibraryPage from './pages/LibraryPage';
import PracticePage from './pages/PracticePage';
import ProgressPage from './pages/ProgressPage';

function linkClass(isActive: boolean) {
  return [
    'rounded px-3 py-2 text-sm',
    isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
  ].join(' ');
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-semibold">Harmonica Tutor</h1>
          <nav className="flex items-center gap-2">
            <NavLink to="/" end className={({ isActive }) => linkClass(isActive)}>
              Home
            </NavLink>
            <NavLink to="/lessons" className={({ isActive }) => linkClass(isActive)}>
              Lessons
            </NavLink>
            <NavLink to="/practice" className={({ isActive }) => linkClass(isActive)}>
              Practice
            </NavLink>
            <NavLink to="/library" className={({ isActive }) => linkClass(isActive)}>
              Library
            </NavLink>
            <NavLink to="/progress" className={({ isActive }) => linkClass(isActive)}>
              Progress
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lessons" element={<LessonsPage />} />
          <Route path="/lessons/:lessonId" element={<LessonPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/progress" element={<ProgressPage />} />
        </Routes>
      </main>
    </div>
  );
}
