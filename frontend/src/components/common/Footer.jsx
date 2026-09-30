import React from 'react';
import { Heart, GitBranch, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 py-8 text-xs text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span>Plateforme collaborative pour étudiants en Master Informatique</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-slate-300">
            Fait avec <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> par et pour la communauté
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="font-mono text-slate-500">7 Spécialités • DRF & React</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition"
          >
            <GitBranch className="w-4 h-4" />
            <span>Open Source</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
