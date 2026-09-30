import React, { useState } from 'react';
import { X, PlusCircle, HardDrive } from 'lucide-react';
import { YoutubeIcon } from '../common/YoutubeIcon';
import { SPECIALTY_THEMES } from '../../theme/specialties';

const CATEGORIES = [
  { id: 'COURS', label: 'Cours Magistral' },
  { id: 'TD', label: 'Travaux Dirigés (TD)' },
  { id: 'TP', label: 'Travaux Pratiques (TP)' },
  { id: 'EXAM', label: 'Examens & Corrigés' },
  { id: 'SUMMARY', label: 'Fiches & Résumés' },
];

export function DirectAddResourceModal({ isOpen, onClose, onAddSuccess, modules = [] }) {
  const [formData, setFormData] = useState({
    module: modules[0]?.id || 1,
    resource_type: 'DRIVE',
    title: '',
    url: '',
    category: 'COURS',
    channel_name: '',
    duration: '',
    contributor_name: 'Délégué Promotion',
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onAddSuccess(formData);
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-cyan-400" />
            <span>Ajout direct de ressource (Publication immédiate)</span>
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Module concerné</label>
            <select
              value={formData.module}
              onChange={(e) => setFormData({ ...formData, module: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:ring-1 focus:ring-cyan-500 outline-none"
            >
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  [{m.semester}] {m.code} - {m.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Type de ressource</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, resource_type: 'DRIVE' })}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-xl border font-semibold transition ${
                  formData.resource_type === 'DRIVE'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <HardDrive className="w-3.5 h-3.5" /> Drive
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, resource_type: 'YOUTUBE' })}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-xl border font-semibold transition ${
                  formData.resource_type === 'YOUTUBE'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <YoutubeIcon className="w-3.5 h-3.5" /> YouTube
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Titre de la ressource</label>
            <input
              type="text"
              required
              placeholder="Ex: Polycopié de cours complet 2024"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Lien URL complet</label>
            <input
              type="url"
              required
              placeholder="https://drive.google.com/... ou https://youtube.com/..."
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {formData.resource_type === 'DRIVE' ? (
            <div>
              <label className="block text-slate-300 font-medium mb-1">Catégorie du document</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nom de la chaîne</label>
                <input
                  type="text"
                  placeholder="Ex: Université de Lille"
                  value={formData.channel_name}
                  onChange={(e) => setFormData({ ...formData, channel_name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Durée (estimée)</label>
                <input
                  type="text"
                  placeholder="Ex: 45m"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-3.5 py-2 text-slate-400 hover:text-white">Annuler</button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition"
            >
              {submitting ? 'Publication...' : 'Publier directement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
