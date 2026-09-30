import React from 'react';
import { Search, X, Filter } from 'lucide-react';

const CATEGORIES = [
  { id: '', label: 'Toutes' },
  { id: 'COURS', label: 'Cours' },
  { id: 'TD', label: 'TD' },
  { id: 'TP', label: 'TP' },
  { id: 'EXAM', label: 'Examens' },
  { id: 'SUMMARY', label: 'Résumés' },
];

const SEMESTERS = [
  { id: '', label: 'Tous' },
  { id: 'S1', label: 'Semestre 1' },
  { id: 'S2', label: 'Semestre 2' },
];

export function ResourceSearchFilter({
  type = 'drives', // 'drives' | 'youtube'
  searchQuery,
  onSearchChange,
  modules = [],
  selectedModule,
  onModuleChange,
  selectedSemester,
  onSemesterChange,
  selectedCategory,
  onCategoryChange,
  totalResults = 0,
}) {
  const isDrives = type === 'drives';

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-4 backdrop-blur-md">
      {/* Top row: Real-time Search & Module selector */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              isDrives
                ? "Rechercher par chapitre, TD, examen, code module (ex: CRYPTO)..."
                : "Rechercher par titre de vidéo, sujet, code module..."
            }
            className="w-full pl-10 pr-9 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Module Dropdown filter */}
        {modules.length > 0 && (
          <div className="sm:w-60">
            <select
              value={selectedModule}
              onChange={(e) => onModuleChange(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            >
              <option value="">Tous les modules ({modules.length})</option>
              {modules.map((m) => (
                <option key={m.id || m.code} value={m.code}>
                  {m.code} - {m.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Bottom row: Sub-filters (Categories & Semesters for Drives) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-800/60">
        {isDrives ? (
          <div className="flex flex-wrap items-center gap-3">
            {/* Semester selector */}
            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
              {SEMESTERS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onSemesterChange(s.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition ${
                    selectedSemester === s.id
                      ? 'bg-cyan-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Document Categories */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => onCategoryChange(cat.id)}
                  className={`px-2.5 py-1 text-xs rounded-lg whitespace-nowrap transition border ${
                    selectedCategory === cat.id
                      ? 'bg-slate-800 text-cyan-300 border-cyan-500/50 font-semibold'
                      : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-rose-400" />
            <span>Filtrez les vidéos par module ou recherchez par mots-clés</span>
          </div>
        )}

        <div className="text-xs font-mono text-slate-400 self-end sm:self-auto">
          <span className="text-cyan-400 font-bold">{totalResults}</span> ressource{totalResults > 1 ? 's' : ''} trouvée{totalResults > 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}
