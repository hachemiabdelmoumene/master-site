import React from 'react';
import { Play, Clock } from 'lucide-react';
import { YoutubeIcon } from '../common/YoutubeIcon';

export function YouTubeCard({ video, onWatch }) {
  return (
    <div className="group flex flex-col justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-rose-500/50 hover:bg-slate-800/60 transition-all duration-200">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <YoutubeIcon className="w-3.5 h-3.5" />
            <span>Vidéo</span>
          </span>
          {video.module_code && (
            <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
              {video.module_code}
            </span>
          )}
        </div>

        <h4 className="text-sm font-semibold text-slate-100 group-hover:text-rose-300 transition-colors line-clamp-2">
          {video.title}
        </h4>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span className="truncate max-w-[160px]">{video.channel_name || 'YouTube'}</span>
          {video.duration && (
            <span className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
              <Clock className="w-3 h-3" />
              {video.duration}
            </span>
          )}
        </div>
      </div>

      <a
        href={video.youtube_url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 text-xs font-semibold transition-all duration-200"
      >
        <Play className="w-3.5 h-3.5 fill-current" />
        <span>Regarder sur YouTube</span>
      </a>
    </div>
  );
}
