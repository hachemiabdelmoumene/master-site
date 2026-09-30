import React from 'react';
import { SPECIALTY_THEMES } from '../../theme/specialties';

export function SpecialtySelector({ activeSlug, onSelectSpecialty }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onSelectSpecialty(null)}
        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
          !activeSlug
            ? 'bg-slate-100 text-slate-900 shadow-md shadow-white/10'
            : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
        }`}
      >
        Toutes les spécialités
      </button>

      {Object.values(SPECIALTY_THEMES).map((theme) => {
        const isActive = activeSlug === theme.slug;
        const Icon = theme.icon;

        return (
          <button
            key={theme.slug}
            onClick={() => onSelectSpecialty(theme.slug)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
              isActive
                ? 'text-white border-transparent shadow-lg shadow-cyan-950/50'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800/80 hover:border-slate-700'
            }`}
            style={{
              backgroundColor: isActive ? theme.color : undefined,
            }}
          >
            <Icon className="w-3.5 h-3.5" style={{ color: isActive ? '#fff' : theme.color }} />
            <span>{theme.code}</span>
          </button>
        );
      })}
    </div>
  );
}
