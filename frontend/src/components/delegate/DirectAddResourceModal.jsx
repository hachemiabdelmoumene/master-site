import React, { useState, useEffect } from 'react';
import { X, PlusCircle, HardDrive, Plus, Sparkles, BookOpen } from 'lucide-react';
import { YoutubeIcon } from '../common/YoutubeIcon';

const CATEGORIES = [
  { id: 'COURS', label: 'Cours Magistral' },
  { id: 'TD', label: 'Travaux Dirigés (TD)' },
  { id: 'TP', label: 'Travaux Pratiques (TP)' },
  { id: 'EXAM', label: 'Examens & Corrigés' },
  { id: 'SUMMARY', label: 'Fiches & Résumés' },
];

export function DirectAddResourceModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  modules = [], 
  onAddModule,
  defaultSpecialtyCode 
}) {
  const [formData, setFormData] = useState({
    module: modules[0]?.id || '',
    resource_type: 'DRIVE',
    title: '',
    url: '',
    category: 'COURS',
    channel_name: '',
    duration: '',
    contributor_name: 'Délégué Promotion',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // État du formulaire de création rapide de module
  const [showNewModuleForm, setShowNewModuleForm] = useState(false);
  const [newModuleData, setNewModuleData] = useState({
    code: '',
    title: '',
    semester: 'S1',
    coefficient: 3,
  });
  const [creatingModule, setCreatingModule] = useState(false);
  const [moduleSuccessMsg, setModuleSuccessMsg] = useState('');

  // Auto-sélection du premier module valide dès que la liste est disponible
  useEffect(() => {
    if (modules.length > 0) {
      const exists = modules.some((m) => m.id === Number(formData.module));
      if (!exists) {
        setFormData((prev) => ({ ...prev, module: modules[0].id }));
      }
    }
  }, [modules, formData.module]);

  if (!isOpen) return null;

  const handleCreateModuleInline = async (e) => {
    e.preventDefault();
    if (!newModuleData.code.trim() || !newModuleData.title.trim()) {
      setError('Veuillez spécifier le code et l\'intitulé du module.');
      return;
    }
    setCreatingModule(true);
    setError('');
    try {
      if (onAddModule) {
        const created = await onAddModule(newModuleData);
        if (created?.id) {
          setFormData((prev) => ({ ...prev, module: created.id }));
        }
      }
      setModuleSuccessMsg(`Module ${newModuleData.code.toUpperCase()} créé et sélectionné !`);
      setNewModuleData({ code: '', title: '', semester: 'S1', coefficient: 3 });
      setShowNewModuleForm(false);
      setTimeout(() => setModuleSuccessMsg(''), 4000);
    } catch (err) {
      setError(err?.message || "Erreur lors de la création du module.");
    } finally {
      setCreatingModule(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.module) {
      setError('Veuillez sélectionner ou créer un module avant de publier.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err?.message || "Erreur lors de la publication de la ressource.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-cyan-400" />
            <span>Ajout direct de ressource (Publication immédiate)</span>
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {moduleSuccessMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{moduleSuccessMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Section Choix / Création du Module */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>Module concerné</span>
                {defaultSpecialtyCode && (
                  <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-800/40">
                    Master {defaultSpecialtyCode}
                  </span>
                )}
              </label>

              {onAddModule && (
                <button
                  type="button"
                  onClick={() => setShowNewModuleForm(!showNewModuleForm)}
                  className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline transition"
                >
                  <Plus className="w-3 h-3" />
                  <span>{showNewModuleForm ? 'Fermer création module' : '+ Nouveau module'}</span>
                </button>
              )}
            </div>

            {/* Formulaire inline de création rapide de module */}
            {showNewModuleForm && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-indigo-500/40 space-y-3 animate-fade-in">
                <div className="text-[11px] font-bold text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Créer un module pour votre spécialité</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Code du module</label>
                    <input
                      type="text"
                      placeholder="Ex: CRYPTO, SII11-ALG"
                      value={newModuleData.code}
                      onChange={(e) => setNewModuleData({ ...newModuleData, code: e.target.value.toUpperCase() })}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 uppercase font-mono text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Semestre</label>
                    <select
                      value={newModuleData.semester}
                      onChange={(e) => setNewModuleData({ ...newModuleData, semester: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                    >
                      <option value="S1">Semestre 1 (S1)</option>
                      <option value="S2">Semestre 2 (S2)</option>
                      <option value="S3">Semestre 3 (S3)</option>
                      <option value="S4">Semestre 4 (S4)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-slate-400 mb-0.5">Intitulé du cours</label>
                    <input
                      type="text"
                      placeholder="Ex: Algorithmique Avancée et Complexité"
                      value={newModuleData.title}
                      onChange={(e) => setNewModuleData({ ...newModuleData, title: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Coefficient</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={newModuleData.coefficient}
                      onChange={(e) => setNewModuleData({ ...newModuleData, coefficient: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-xs font-mono focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowNewModuleForm(false)}
                    className="px-2.5 py-1 text-slate-400 hover:text-white"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateModuleInline}
                    disabled={creatingModule}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow transition disabled:opacity-50"
                  >
                    {creatingModule ? 'Enregistrement...' : 'Enregistrer le module'}
                  </button>
                </div>
              </div>
            )}

            {/* Sélecteur de module */}
            {modules.length > 0 ? (
              <select
                value={formData.module}
                onChange={(e) => setFormData({ ...formData, module: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:ring-1 focus:ring-cyan-500 outline-none"
              >
                {modules.map((m) => (
                  <option key={m.id || m.code} value={m.id}>
                    [{m.semester || 'S1'}] {m.code} — {m.title}
                  </option>
                ))}
              </select>
            ) : (
              <div className="p-3 rounded-xl bg-slate-950 border border-dashed border-slate-800 text-center space-y-2">
                <p className="text-slate-400">Aucun module pour le moment dans cette spécialité.</p>
                <button
                  type="button"
                  onClick={() => setShowNewModuleForm(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600/50 transition font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Créer le premier module maintenant</span>
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Type de ressource</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, resource_type: 'DRIVE' })}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-xl border font-semibold transition ${
                  formData.resource_type === 'DRIVE'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
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
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm'
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
              placeholder="Ex: Polycopié de cours complet 2026-2027"
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
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none focus:ring-1 focus:ring-cyan-500"
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
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Durée (estimée)</label>
                <input
                  type="text"
                  placeholder="Ex: 45m"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <button type="button" onClick={onClose} className="px-3.5 py-2 text-slate-400 hover:text-white transition">
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting || !formData.module}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Publication...' : 'Publier directement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
