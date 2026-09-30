import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Eye, EyeOff, AlertCircle, ArrowLeft, Loader2, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function DelegateLoginPage({ onSuccess, onBack }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMessage("Veuillez saisir votre nom d'utilisateur et votre mot de passe.");
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await login(username, password);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const msg =
        err?.data?.detail ||
        err?.message ||
        "Identifiants incorrects ou compte non autorisé.";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (u, p) => {
    setUsername(u);
    setPassword(p);
    setErrorMessage('');
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="w-full max-w-md space-y-6">
        {/* Back Link */}
        <button
          onClick={onBack}
          type="button"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil</span>
        </button>

        {/* Card Container */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Neon decorative background glow */}
          <div className="absolute -top-20 -right-20 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-lg shadow-cyan-600/30 mb-2">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Connexion Espace Délégué
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Modération des cours et validation des propositions de Master
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 mb-5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-3 text-rose-300 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Nom d'utilisateur (Username)
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  autoFocus
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ex: delegue_ssi ou admin"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Mot de passe (Password)
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-cyan-600/25 transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Se connecter au Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Login Helper Box */}
          <div className="mt-6 pt-5 border-t border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Comptes de test rapide
              </span>
              <span className="text-[10px] text-cyan-400">1 clic pour remplir</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin', 'admin123')}
                className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 text-left transition hover:bg-slate-950 group"
              >
                <div className="text-[11px] font-semibold text-slate-200 group-hover:text-cyan-400">
                  Admin
                </div>
                <div className="text-[10px] text-slate-400 truncate">Tous Masters</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('delegue_ssi', 'ssi123')}
                className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-emerald-500/40 text-left transition hover:bg-slate-950 group"
              >
                <div className="text-[11px] font-semibold text-emerald-400">
                  Dél. SSI
                </div>
                <div className="text-[10px] text-slate-400 truncate">Sécurité</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickFill('delegue_rsd', 'rsd123')}
                className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-fuchsia-500/40 text-left transition hover:bg-slate-950 group"
              >
                <div className="text-[11px] font-semibold text-fuchsia-400">
                  Dél. RSD
                </div>
                <div className="text-[10px] text-slate-400 truncate">Réseaux</div>
              </button>
            </div>
          </div>
        </div>

        {/* Info footer */}
        <p className="text-center text-[11px] text-slate-400">
          Les comptes délégués sont créés et assignés par les administrateurs via Django Admin.
        </p>
      </div>
    </div>
  );
}
