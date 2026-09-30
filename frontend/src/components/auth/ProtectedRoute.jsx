import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Loader2 } from 'lucide-react';

export function ProtectedRoute({ children, onRedirectToLogin }) {
  const { isAuthenticated, isDelegate, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isDelegate)) {
      if (onRedirectToLogin) {
        onRedirectToLogin();
      }
    }
  }, [isLoading, isAuthenticated, isDelegate, onRedirectToLogin]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-sm text-slate-400">Vérification de l'authentification Délégué...</p>
      </div>
    );
  }

  if (!isAuthenticated || !isDelegate) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 px-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-950/20">
          <ShieldAlert className="w-7 h-7 text-amber-400" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white">Espace Délégué Protégé</h2>
          <p className="text-sm text-slate-400 max-w-md">
            Veuillez vous connecter avec vos identifiants de Délégué de promotion ou d'Administrateur pour accéder à la modération.
          </p>
        </div>
        <button
          onClick={onRedirectToLogin}
          className="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-cyan-600/20 transition active:scale-95"
        >
          Accéder à la page de connexion
        </button>
      </div>
    );
  }

  return children;
}
