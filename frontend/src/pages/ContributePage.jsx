import React, { useState, useEffect, useMemo } from 'react';
import { Send, CheckCircle2, ArrowLeft, Plus, AlertCircle } from 'lucide-react';
import { resourceService } from '../services/resourceService';
import { specialtyService, FALLBACK_SPECIALTIES, FALLBACK_MODULES_BY_SPECIALTY, ALL_FALLBACK_MODULES } from '../services/specialtyService';


export function ContributePage({ onBack }) {
  const [specialties, setSpecialties] = useState([]);
  const [allModules, setAllModules] = useState([]);
  const [selectedSpecialtySlug, setSelectedSpecialtySlug] = useState('');
  const [formData, setFormData] = useState({
    module: '',
    resource_type: 'DRIVE',
    title: '',
    url: '',
    contributor_name: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Chargement des spécialités
  useEffect(() => {
    specialtyService.getAllSpecialties()
      .then(data => setSpecialties(data))
      .catch(() => setSpecialties(FALLBACK_SPECIALTIES));
  }, []);

  // Chargement de tous les modules depuis l'API (avec fallback si backend en veille)
  useEffect(() => {
    specialtyService.getAllModules()
      .then(mods => setAllModules(mods))
      .catch(() => setAllModules(ALL_FALLBACK_MODULES));
  }, []);

  // Filtrage des modules par spécialité sélectionnée
  const filteredModules = useMemo(() => {
    if (!selectedSpecialtySlug) return allModules.length ? allModules : ALL_FALLBACK_MODULES;
    const spec = specialties.find(s => s.slug === selectedSpecialtySlug);
    const specCode = (spec?.code || selectedSpecialtySlug).toUpperCase();

    let filtered = allModules.filter(m => {
      if (m.specialty_slug && m.specialty_slug.toLowerCase() === selectedSpecialtySlug.toLowerCase()) return true;
      if (m.specialty_code && m.specialty_code.toUpperCase() === specCode) return true;
      return false;
    });

    if (filtered.length === 0 && FALLBACK_MODULES_BY_SPECIALTY[specCode]) {
      filtered = FALLBACK_MODULES_BY_SPECIALTY[specCode];
    }
    return filtered;
  }, [allModules, selectedSpecialtySlug, specialties]);


  // Pré-sélection du premier module quand les modules filtres changent
  useEffect(() => {
    if (filteredModules.length > 0) {
      const currentModuleValid = filteredModules.find(m => m.id === Number(formData.module));
      if (!currentModuleValid) {
        setFormData(prev => ({ ...prev, module: filteredModules[0].id }));
      }
    }
  }, [filteredModules]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.module) {
      setError('Veuillez sélectionner un module.');
      return;
    }

    const trimmedUrl = formData.url.trim();
    if (!trimmedUrl) {
      setError("Veuillez renseigner l'URL de la ressource.");
      return;
    }

    if (formData.resource_type === 'YOUTUBE' && !trimmedUrl.includes('youtube.com') && !trimmedUrl.includes('youtu.be')) {
      setError("Pour une vidéo, veuillez fournir une URL YouTube valide (youtube.com ou youtu.be).");
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await resourceService.submitContribution({
        module: Number(formData.module),
        resource_type: formData.resource_type,
        title: formData.title.trim(),
        url: trimmedUrl,
        contributor_name: formData.contributor_name.trim() || 'Étudiant Anonyme',
      });
      setSubmitting(false);
      setSubmitted(true);
    } catch (err) {
      setSubmitting(false);
      const detail = err?.data?.url?.[0] || err?.data?.title?.[0] || err?.data?.detail || err?.message || 'Erreur lors de la soumission de la ressource.';
      setError(detail);
    }
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
          <div className="text-center py-10 space-y-4 animate-fade-in">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Merci pour votre contribution !</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Votre lien a été soumis et sera rendu visible dès vérification par un délégué ou modérateur.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData(prev => ({ ...prev, title: '', url: '', contributor_name: '' }));
              }}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-xl transition"
            >
              Soumettre un autre lien
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Spécialité */}
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Spécialité visée</label>
              <select
                value={selectedSpecialtySlug}
                onChange={(e) => setSelectedSpecialtySlug(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                <option value="">— Toutes les spécialités —</option>
                {specialties.map((s) => (
                  <option key={s.slug} value={s.slug}>{s.code} - {s.name}</option>
                ))}
              </select>
            </div>

            {/* Module */}
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                Module concerné <span className="text-rose-400">*</span>
              </label>
              <select
                required
                value={formData.module}
                onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                <option value="">— Sélectionner un module —</option>
                {filteredModules.map((m) => (
                  <option key={m.id} value={m.id}>
                    [{m.semester}] {m.code} - {m.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Type de ressource */}
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
                    {type === 'DRIVE' ? '📁 Google Drive' : '▶ Vidéo YouTube'}
                  </button>
                ))}
              </div>
            </div>

            {/* Titre */}
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

            {/* URL */}
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

            {/* Pseudo */}
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
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-600/20 transition active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
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
