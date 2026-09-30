import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Database, 
  ArrowLeft, 
  LogOut, 
  RefreshCw, 
  User, 
  GraduationCap 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { delegateService } from '../services/delegateService';
import { PendingResourcesTable } from '../components/delegate/PendingResourcesTable';
import { DirectAddResourceModal } from '../components/delegate/DirectAddResourceModal';

export function DelegateDashboardPage({ onBack, allModules = [] }) {
  const { user, logout, isSuperAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'published'
  const [pendingList, setPendingList] = useState([]);
  const [stats, setStats] = useState({ pending_count: 0, approved_count: 0, rejected_count: 0, total_resources: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter modules for direct addition: if user has a specific specialty, restrict to that specialty
  const scopedModules = React.useMemo(() => {
    if (isSuperAdmin || !user?.specialty_code) {
      return allModules;
    }
    return allModules.filter(
      (m) => m.specialty_code === user.specialty_code || m.specialty === user.specialty
    );
  }, [allModules, user, isSuperAdmin]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pendingData, statsData] = await Promise.all([
        delegateService.getPendingResources(),
        delegateService.getStats(),
      ]);
      setPendingList(pendingData);
      setStats(statsData);
    } catch (err) {
      console.error('Erreur chargement données dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleApprove = async (id) => {
    try {
      await delegateService.approveResource(id);
      setPendingList((prev) => prev.filter((item) => item.id !== id));
      setStats((prev) => ({
        ...prev,
        pending_count: Math.max(0, prev.pending_count - 1),
        approved_count: prev.approved_count + 1,
      }));
      showNotification("Ressource approuvée et publiée avec succès !");
    } catch (err) {
      showNotification("Erreur lors de l'approbation de la ressource.");
    }
  };

  const handleReject = async (id, reason) => {
    try {
      await delegateService.rejectResource(id, reason);
      setPendingList((prev) => prev.filter((item) => item.id !== id));
      setStats((prev) => ({
        ...prev,
        pending_count: Math.max(0, prev.pending_count - 1),
        rejected_count: prev.rejected_count + 1,
      }));
      showNotification("La proposition étudiante a été refusée.");
    } catch (err) {
      showNotification("Erreur lors du refus de la ressource.");
    }
  };

  const handleDirectAdd = async (formData) => {
    try {
      await delegateService.createDirect(formData);
      setStats((prev) => ({
        ...prev,
        approved_count: prev.approved_count + 1,
        total_resources: prev.total_resources + 1,
      }));
      showNotification("Nouvelle ressource publiée directement avec succès !");
      loadData();
    } catch (err) {
      const msg = err?.data?.detail || "Erreur lors de l'ajout de la ressource.";
      showNotification(msg);
    }
  };

  const handleLogout = () => {
    logout();
    onBack();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
            title="Retour à l'accueil"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
                Espace Délégué & Modération
              </h1>
              {user?.is_superuser ? (
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
                  Super Admin
                </span>
              ) : (
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">
                  Délégué
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <strong className="text-slate-200">{user?.username}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-cyan-400 font-medium">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>
                  {user?.specialty_code
                    ? `Master ${user.specialty_code} (${user.specialty_name})`
                    : 'Tous les parcours de Master (Accès global)'}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700 transition"
            title="Rafraîchir les données"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/20 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Ajout direct</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold transition"
            title="Se déconnecter"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-300 animate-fade-in flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-amber-500/30">
          <div className="flex items-center justify-between text-xs text-amber-400 mb-1">
            <span>En attente</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.pending_count}</div>
          <p className="text-[11px] text-slate-500 mt-1">À modérer</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-emerald-500/30">
          <div className="flex items-center justify-between text-xs text-emerald-400 mb-1">
            <span>Approuvées</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.approved_count}</div>
          <p className="text-[11px] text-slate-500 mt-1">En ligne</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-rose-500/30">
          <div className="flex items-center justify-between text-xs text-rose-400 mb-1">
            <span>Refusées</span>
            <XCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.rejected_count}</div>
          <p className="text-[11px] text-slate-500 mt-1">Rejetées</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-cyan-500/30">
          <div className="flex items-center justify-between text-xs text-cyan-400 mb-1">
            <span>Total suivi</span>
            <Database className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.total_resources}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            {user?.specialty_code ? `Master ${user.specialty_code}` : 'Tous masters'}
          </p>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
            activeTab === 'pending'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-lg shadow-amber-950/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Propositions en attente ({pendingList.length})</span>
        </button>
      </div>

      {/* Table of pending proposals */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-4 sm:p-6 backdrop-blur-md">
        {loading ? (
          <div className="text-center py-16 text-slate-400 text-sm animate-pulse">
            Chargement des propositions étudiantes...
          </div>
        ) : (
          <PendingResourcesTable
            resources={pendingList}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </div>

      {/* Direct Add Modal */}
      {isModalOpen && (
        <DirectAddResourceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleDirectAdd}
          modules={scopedModules}
          defaultSpecialtyCode={user?.specialty_code}
        />
      )}
    </div>
  );
}
