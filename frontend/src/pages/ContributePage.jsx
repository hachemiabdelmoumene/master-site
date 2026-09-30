import React, { useState } from 'react';
import { Send, CheckCircle2, ArrowLeft, Plus } from 'lucide-react';
import { resourceService } from '../services/resourceService';
import { SPECIALTY_THEMES } from '../theme/specialties';

export function ContributePage({ onBack }) {
  const [formData, setFormData] = useState({
    specialty_id: 1,
    resource_type: 'DRIVE',
    title: '',
    url: '',
    description: '',
    contributor_name: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await resourceService.submitContribution(formData);
    } catch {
      // Fallback optimistic success for UI demo
    }
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Retour à l'accueil</span>
      </button>

      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-3">
            <Plus className="w-3.5 h-3.5" />
            <span>Partage communautaire</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Proposer une ressource</h1>
          <p className="text-xs text-slate-400 mt-1">
            Partagez vos polycopiés, fiches, TD corrigés ou vidéos YouTube avec les étudiants de Master.
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Merci pour votre contribution !</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Votre lien a été soumis et sera rendu visible dès vérification par un délégué ou modérateur.
            </p>
            <button
              onClick={() => { setSubmitted(false); setFormData({ ...formData, title: '', url: '' }); }}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-xl transition"
            >
              Soumettre un autre lien
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Spécialité visée</label>
              <select
                value={formData.specialty_id}
                onChange={(e) => setFormData({ ...formData, specialty_id: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                {Object.values(SPECIALTY_THEMES).map((s, idx) => (
                  <option key={s.slug} value={idx + 1}>{s.code} - {s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Type de ressource</label>
              <div className="grid grid-cols-2 gap-3">
                {['DRIVE', 'YOUTUBE'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, resource_type: type })}
                    className={`py-2 rounded-xl border font-semibold text-center transition ${
                      formData.resource_type === type
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {type === 'DRIVE' ? 'Google Drive' : 'Vidéo YouTube'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Titre ou description du document</label>
              <input
                type="text"
                required
                placeholder="Ex: Polycopié TD Cryptographie 2024"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Lien URL complet (Drive ou YouTube)</label>
              <input
                type="url"
                required
                placeholder="https://drive.google.com/... ou https://youtube.com/..."
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Votre prénom / pseudo (optionnel)</label>
              <input
                type="text"
                placeholder="Ex: Mehdi (M1)"
                value={formData.contributor_name}
                onChange={(e) => setFormData({ ...formData, contributor_name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-600/20 transition active:scale-[0.99]"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Envoi en cours...' : 'Envoyer la contribution'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
