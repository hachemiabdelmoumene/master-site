import React from 'react';
import { ArrowUpRight, FolderGit2, Video } from 'lucide-react';
import { getSpecialtyTheme } from '../../theme/specialties';

export function SpecialtyCard({ specialty, onClick }) {
  const theme = getSpecialtyTheme(specialty.slug);
  const IconComponent = theme.icon;

  return (
    <div
      onClick={onClick}
      className={`group relative p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-950/40 ${theme.borderHover}`}
    >
      {/* Background ambient glow */}
      <div 
        className={`absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br ${theme.glowClass} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      <div className="relative z-10 flex flex-col h-full justify-between gap-5">
        {/* Header: Icon & Code */}
        <div className="flex items-start justify-between">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-200"
            style={{ backgroundColor: `${theme.color}15`, border: `1px solid ${theme.color}30` }}
          >
            <IconComponent className="w-6 h-6" style={{ color: theme.color }} />
          </div>
          <span 
            className="text-xs font-mono font-bold px-2.5 py-1 rounded-md border tracking-wider"
            style={{ color: theme.color, borderColor: `${theme.color}40`, backgroundColor: `${theme.color}10` }}
          >
            {specialty.code}
          </span>
        </div>

        {/* Title and description */}
        <div>
          <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
            <span>{specialty.name}</span>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </h3>
          <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {specialty.description || theme.tagline}
          </p>
        </div>

        {/* Stats footer */}
        <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <FolderGit2 className="w-3.5 h-3.5 text-slate-500" />
            <span>{specialty.modules_count || 8} modules</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-slate-500" />
            <span>{specialty.total_resources || 25}+ ressources</span>
          </div>
        </div>
      </div>
    </div>
  );
}
