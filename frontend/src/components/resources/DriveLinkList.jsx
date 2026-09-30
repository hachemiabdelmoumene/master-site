import React from 'react';
import { ExternalLink, HardDrive, Eye } from 'lucide-react';
import { Badge } from '../common/Badge';

export function DriveLinkList({ drives = [], onOpenDrive }) {
  if (drives.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
        <HardDrive className="w-10 h-10 text-slate-600 mx-auto mb-3" />
        <p className="text-sm text-slate-400">Aucun lien Google Drive trouvé pour ces critères.</p>
        <p className="text-xs text-slate-500 mt-1">Soyez le premier à ajouter une ressource !</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
      {drives.map((item) => (
        <a
          key={item.id}
          href={item.drive_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onOpenDrive?.(item.id)}
          className="group flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-800/60 transition-all duration-200"
        >
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <HardDrive className="w-5 h-5 text-cyan-400" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <Badge category={item.category}>{item.category}</Badge>
                {item.module_code && (
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded">
                    {item.module_code}
                  </span>
                )}
                {item.semester && (
                  <span className="text-[11px] text-slate-500 font-mono">
                    {item.semester}
                  </span>
                )}
              </div>
              <h4 className="text-sm font-medium text-slate-200 group-hover:text-white truncate">
                {item.title}
              </h4>
              <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-slate-500" />
                  {item.views_count || 0} vues
                </span>
                <span>• Google Drive</span>
              </div>
            </div>
          </div>

          <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 shrink-0 ml-3 transition-colors" />
        </a>
      ))}
    </div>
  );
}
