import React from 'react';
import { ArrowLeft, Sparkles, FolderGit2, BookOpen } from 'lucide-react';
import { getSpecialtyTheme } from '../../theme/specialties';

export function SpecialtyHeader({ specialty, onBack }) {
  const theme = getSpecialtyTheme(specialty.slug);
  const IconComponent = theme.icon;

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-8 shadow-2xl backdrop-blur-xl">
      {/* Decorative gradient glow matching specialty accent */}
      <div 
        className="absolute -top-32 -right-32 w-72 sm:w-96 h-72 sm:h-96 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: theme.color }}
      />

      <div className="relative z-10 flex flex-col gap-5 sm:gap-6">
        {/* Top bar: Prominent Back Button & Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/90 shadow-lg shadow-black/20 transition-all duration-200 active:scale-95 group"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
            <span>← Retour à l'accueil</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Accueil</span>
            <span>/</span>
            <span style={{ color: theme.color }} className="font-bold">
              {specialty.code}
            </span>
          </div>
        </div>

        {/* Main Header Content */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div 
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-xl shrink-0"
              style={{ 
                backgroundColor: `${theme.color}20`, 
                border: `1.5px solid ${theme.color}60`,
                boxShadow: `0 8px 24px -6px ${theme.color}40`
              }}
            >
              <IconComponent className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: theme.color }} />
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span 
                  className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold border"
                  style={{ color: theme.color, borderColor: `${theme.color}40`, backgroundColor: `${theme.color}15` }}
                >
                  MASTER {specialty.code}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Promo 2024-2025</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-extrabold text-white mt-1.5 leading-tight">
                {specialty.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                {specialty.description || theme.tagline}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 sm:p-4 self-start lg:self-auto w-full sm:w-auto justify-around sm:justify-start">
            <div className="text-center px-3 sm:px-4 border-r border-slate-800">
              <div className="text-lg sm:text-2xl font-bold text-white">
                {specialty.modules?.length || 8}
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider">Modules</div>
            </div>
            <div className="text-center px-3 sm:px-4">
              <div className="text-lg sm:text-2xl font-bold" style={{ color: theme.color }}>
                Drive & YT
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider">Ressources</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
