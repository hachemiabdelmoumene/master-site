import React from 'react';

const CATEGORY_STYLES = {
  COURS: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  TD: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  TP: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  EXAM: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  SUMMARY: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
};

export function Badge({ children, category, variant = 'default', className = '' }) {
  const categoryClass = category ? CATEGORY_STYLES[category] || '' : '';
  const defaultClass = variant === 'outline' 
    ? 'border border-slate-700 text-slate-300' 
    : 'bg-slate-800 text-slate-300';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        categoryClass || defaultClass
      } ${className}`}
    >
      {children}
    </span>
  );
}
