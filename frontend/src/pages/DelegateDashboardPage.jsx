import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Clock, CheckCircle2, XCircle, Database, ArrowLeft, Trash2, ExternalLink } from 'lucide-react';
import { delegateService } from '../services/delegateService';
import { PendingResourcesTable } from '../components/delegate/PendingResourcesTable';
import { DirectAddResourceModal } from '../components/delegate/DirectAddResourceModal';

export function DelegateDashboardPage({ onBack, allModules = [] }) {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'published'
  const [pendingList, setPendingList] = useState([]);
  const [stats, setStats] = useState({ pending_count: 0, approved_count: 0, rejected_count: 0, total_resources: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const loadData = async () => {
    const [pendingData, statsData] = await Promise.all([
      delegateService.getPendingResources(),
      delegateService.getStats(),
    ]);
    setPendingList(pendingData);
    setStats(statsData);
  };

  useEffect(() => { loadData(); }, []);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleApprove = async (id) => {
    await delegateService.approveResource(id);
    setPendingList((prev) => prev.filter((item) => item.id !== id));
    setStats((prev) => ({ ...prev, pending_count: Math.max(0, prev.pending_count - 1), approved_count: prev.approved_count + 1 }));
    showNotification("Ressource approuvée et publiée avec succès !");
  };

  const handleReject = async (id, reason) => {
    await delegateService.rejectResource(id, reason);
    setPendingList((prev) => prev.filter((item) => item.id !== id));
    setStats((prev) => ({ ...prev, pending_count: Math.max(0, prev.pending_count - 1), rejected_count: prev.rejected_count + 1 }));
    showNotification("La proposition a été rejetée.");
  };

  const handleDirectAdd = async (formData) => {
    await delegateService.createDirect(formData);
    setStats((prev) => ({ ...prev, approved_count: prev.approved_count + 1, total_resources: prev.total_resources + 1 }));
    showNotification("Nouvelle ressource publiée directement !");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span>Espace Délégué & Modération</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">Admin</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Validation des propositions étudiantes et gestion des cours</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/20 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Ajout direct de ressource</span>
        </button>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 animate-fade-in flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-amber-500/30">
          <div className="flex items-center justify-between text-xs text-amber-400 mb-1">
            <span>En attente</span> <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.pending_count}</div>
          <p className="text-[11px] text-slate-500 mt-1">À modérer</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-emerald-500/30">
          <div className="flex items-center justify-between text-xs text-emerald-400 mb-1">
            <span>Approuvées</span> <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.approved_count}</div>
          <p className="text-[11px] text-slate-500 mt-1">Publiées sur le site</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-rose-400 mb-1">
            <span>Rejetées</span> <XCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.rejected_count}</div>
          <p className="text-[11px] text-slate-500 mt-1">Refusées</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-cyan-400 mb-1">
            <span>Total Ressources</span> <Database className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.total_resources}</div>
          <p className="text-[11px] text-slate-500 mt-1">7 Masters combinés</p>
        </div>
      </div>

      {/* Main Content: Pending Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Propositions étudiantes en attente</span>
            <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {pendingList.length}
            </span>
          </h2>
        </div>

        <PendingResourcesTable
          resources={pendingList}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>

      {/* Direct Add Modal */}
      <DirectAddResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSuccess={handleDirectAdd}
        modules={allModules}
      />
    </div>
  );
}
