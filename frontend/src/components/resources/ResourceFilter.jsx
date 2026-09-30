import React from 'react';

const CATEGORIES = [
  { id: '', label: 'Toutes catégories' },
  { id: 'COURS', label: 'Cours' },
  { id: 'TD', label: 'TD' },
  { id: 'TP', label: 'TP' },
  { id: 'EXAM', label: 'Examens' },
  { id: 'SUMMARY', label: 'Résumés' },
];

const SEMESTERS = [
  { id: '', label: 'Tous semestres' },
  { id: 'S1', label: 'Semestre 1' },
  { id: 'S2', label: 'Semestre 2' },
];

export function ResourceFilter({
  selectedSemester,
  onSemesterChange,
  selectedCategory,
  onCategoryChange,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-2">
      {/* Semester selection */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
        {SEMESTERS.map((s) => (
          <button
            key={s.id}
            onClick={() => onSemesterChange(s.id)}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              selectedSemester === s.id
                ? 'bg-cyan-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Category selection */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`px-2.5 py-1 text-xs rounded-lg whitespace-nowrap transition-all border ${
              selectedCategory === cat.id
                ? 'bg-slate-800 text-white border-slate-600 font-semibold'
                : 'bg-slate-900/60 text-slate-400 border-slate-800/80 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
