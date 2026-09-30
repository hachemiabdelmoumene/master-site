import React, { useState } from 'react';
import { Layers, Plus, ChevronDown, Sparkles, Menu, X, Home, ShieldCheck, LogOut, UserCheck } from 'lucide-react';
import { SPECIALTY_THEMES } from '../../theme/specialties';
import { useAuth } from '../../context/AuthContext';

export function Navbar({ currentSlug, onSelectSpecialty, onNavigate }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isDelegate, logout } = useAuth();

  const handleSelectMobile = (slug) => {
    onSelectSpecialty(slug);
    setMobileMenuOpen(false);
  };

  const handleNavigateMobile = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-sm sm:text-base font-bold text-slate-100 tracking-tight flex items-center gap-1">
              MASTER <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">INFO</span> HUB
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 tracking-wider uppercase block font-mono">Drives & Vidéos</span>
          </div>
        </div>

        {/* Center / Desktop Specialty Selector */}
        <div className="hidden md:flex items-center relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-700 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Spécialités ({Object.keys(SPECIALTY_THEMES).length})</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div 
              className="absolute top-full mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 animate-fade-in"
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                Choisir un Master
              </div>
              {Object.values(SPECIALTY_THEMES).map((theme) => {
                const Icon = theme.icon;
                const isActive = currentSlug === theme.slug;
                return (
                  <button
                    key={theme.slug}
                    onClick={() => {
                      onSelectSpecialty(theme.slug);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition ${
                      isActive ? 'bg-slate-800 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" style={{ color: theme.color }} />
                    <span className="truncate">{theme.code} - {theme.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Delegate Authentication & Button */}
          {isAuthenticated && isDelegate ? (
            <div className="hidden sm:flex items-center gap-2 bg-slate-900/90 border border-cyan-500/30 rounded-xl px-2.5 py-1 shadow-lg shadow-cyan-950/20">
              <button
                onClick={() => onNavigate('delegate_dashboard')}
                className="flex items-center gap-1.5 text-xs text-slate-200 hover:text-cyan-400 transition"
                title="Accéder au dashboard de modération"
              >
                <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px]">
                  {user.specialty_code || 'ALL'}
                </div>
                <span className="font-semibold text-white max-w-[100px] truncate">{user.username}</span>
                {user.is_superuser && (
                  <span className="text-[9px] uppercase px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 rounded font-mono">
                    Admin
                  </span>
                )}
              </button>

              <button
                onClick={handleLogout}
                className="p-1 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition"
                title="Déconnexion"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate('delegate_login')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:border-cyan-500/40 text-xs font-semibold text-slate-300 hover:text-white transition group"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Espace Délégué</span>
            </button>
          )}

          {/* Proposer une ressource */}
          <button
            onClick={() => onNavigate('contribute')}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-lg shadow-cyan-600/20 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Proposer une ressource</span>
            <span className="sm:hidden">Contribuer</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white transition"
            aria-label="Menu de navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 py-4 space-y-4 animate-fade-in shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <button
              onClick={() => handleNavigateMobile('home')}
              className="flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:underline"
            >
              <Home className="w-4 h-4" />
              <span>Accueil</span>
            </button>

            {isAuthenticated && isDelegate ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavigateMobile('delegate_dashboard')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{user.username} ({user.specialty_code || 'Tous'})</span>
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="p-1 text-rose-400 hover:text-rose-300"
                  title="Déconnexion"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavigateMobile('delegate_login')}
                className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:underline"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Espace Délégué</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.values(SPECIALTY_THEMES).map((theme) => {
              const Icon = theme.icon;
              const isActive = currentSlug === theme.slug;
              return (
                <button
                  key={theme.slug}
                  onClick={() => handleSelectMobile(theme.slug)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs text-left transition ${
                    isActive
                      ? 'border-cyan-500/50 bg-slate-900 text-white font-semibold'
                      : 'border-slate-800/80 bg-slate-900/50 text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${theme.color}20` }}>
                    <Icon className="w-4 h-4" style={{ color: theme.color }} />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold block" style={{ color: theme.color }}>{theme.code}</span>
                    <span className="text-[11px] text-slate-400 truncate block">{theme.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
