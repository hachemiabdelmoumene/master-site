import React, { useState } from 'react';
import { Check, X, ExternalLink, HardDrive, User, Calendar, MessageSquare } from 'lucide-react';
import { YoutubeIcon } from '../common/YoutubeIcon';
import { Badge } from '../common/Badge';

export function PendingResourcesTable({ resources = [], onApprove, onReject }) {
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const confirmReject = (id) => {
    onReject(id, rejectReason);
    setRejectingId(null);
    setRejectReason('');
  };

  if (resources.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl">
        <Check className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
        <h4 className="text-base font-bold text-white">Toutes les demandes ont été traitées !</h4>
        <p className="text-xs text-slate-400 mt-1">Aucune ressource en attente de modération pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile view: Responsive Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {resources.map((item) => (
          <div key={item.id} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                {item.specialty_code} • {item.semester}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                {item.resource_type === 'DRIVE' ? <HardDrive className="w-3.5 h-3.5 text-cyan-400" /> : <YoutubeIcon className="w-3.5 h-3.5 text-rose-500" />}
                {item.resource_type}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-mono text-slate-500 block">{item.module_code} - {item.module_title}</span>
              <h4 className="text-sm font-semibold text-white mt-0.5">{item.title}</h4>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline mt-1.5">
                <ExternalLink className="w-3 h-3" />
                <span className="truncate max-w-[240px]">{item.url}</span>
              </a>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              <span className="flex items-center gap-1"><User className="w-3 h-3" /> {item.contributor_name || 'Anonyme'}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(item.created_at).toLocaleDateString('fr-FR')}</span>
            </div>

            {/* Quick Actions Mobile */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onApprove(item.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-semibold transition"
              >
                <Check className="w-4 h-4" /> Accepter
              </button>
              <button
                onClick={() => setRejectingId(item.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-semibold transition"
              >
                <X className="w-4 h-4" /> Refuser
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop view: Structured Table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Spécialité & Module</th>
              <th className="py-3.5 px-4">Titre & Ressource</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Contributeur</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4 text-right">Actions rapides</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {resources.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/40 transition">
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className="text-cyan-400 font-mono">{item.specialty_code}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300">{item.semester}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[180px]">{item.module_code} - {item.module_title}</div>
                </td>

                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-100 max-w-[260px] truncate">{item.title}</div>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] text-cyan-400 hover:underline">
                    <ExternalLink className="w-3 h-3" />
                    <span className="truncate max-w-[200px]">{item.url}</span>
                  </a>
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap">
                  {item.resource_type === 'DRIVE' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      <HardDrive className="w-3 h-3" /> Drive
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/30">
                      <YoutubeIcon className="w-3 h-3" /> Vidéo
                    </span>
                  )}
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap text-slate-400">
                  {item.contributor_name || 'Anonyme'}
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-slate-500">
                  {new Date(item.created_at).toLocaleDateString('fr-FR')}
                </td>

                <td className="py-3.5 px-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onApprove(item.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-semibold transition"
                      title="Approuver et publier"
                    >
                      <Check className="w-3.5 h-3.5" /> <span>Accepter</span>
                    </button>
                    <button
                      onClick={() => setRejectingId(item.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-semibold transition"
                      title="Refuser"
                    >
                      <X className="w-3.5 h-3.5" /> <span>Refuser</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rejection reason modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-rose-400" /> Refuser la ressource
            </h3>
            <p className="text-xs text-slate-400">Indiquez un motif de refus facultatif (lien mort, hors programme, doublon...) :</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Ex: Le lien Google Drive demande un mot de passe ou est inaccessible."
              className="w-full h-20 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none focus:ring-1 focus:ring-rose-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setRejectingId(null)} className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white">Annuler</button>
              <button onClick={() => confirmReject(rejectingId)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white">Confirmer le refus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
