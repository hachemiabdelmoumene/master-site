import React, { useState } from 'react';
import { X, BookPlus, Sparkles } from 'lucide-react';

export function AddModuleModal({ isOpen, onClose, onSave, defaultSpecialtyCode }) {
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    semester: 'S1',
    coefficient: 3,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.title.trim()) {
      setError('Veuillez renseigner le code et l\'intitulé du module.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await onSave(formData);
      setFormData({ code: '', title: '', semester: 'S1', coefficient: 3 });
      onClose();
    } catch (err) {
      setError(err?.message || "Erreur lors de la création du module.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <BookPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Ajouter un nouveau module</h3>
              <p className="text-[11px] text-slate-400">
                {defaultSpecialtyCode ? `Spécialité Master ${defaultSpecialtyCode}` : 'Module de Master'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
              {error}
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Code du module <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: CRYPTO, SII11-ALG, SECNET..."
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 uppercase font-mono tracking-wider focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              Intitulé complet du cours <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Algorithmique Avancée et Complexité"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Semestre</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none"
              >
                <option value="S1">Semestre 1 (S1)</option>
                <option value="S2">Semestre 2 (S2)</option>
                <option value="S3">Semestre 3 (S3)</option>
                <option value="S4">Semestre 4 (S4)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Coefficient</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.coefficient}
                onChange={(e) => setFormData({ ...formData, coefficient: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:ring-1 focus:ring-indigo-500 outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold shadow-lg shadow-indigo-600/20 transition active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{submitting ? 'Création...' : 'Créer le module'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
