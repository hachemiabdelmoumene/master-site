import React, { useState, useMemo } from 'react';
import { HardDrive, RotateCcw, Loader2 } from 'lucide-react';
import { YoutubeIcon } from '../components/common/YoutubeIcon';
import { SpecialtyHeader } from '../components/specialties/SpecialtyHeader';
import { ResourceSearchFilter } from '../components/resources/ResourceSearchFilter';
import { DriveLinkList } from '../components/resources/DriveLinkList';
import { YouTubeCard } from '../components/resources/YouTubeCard';
import { useResources } from '../hooks/useResources';
import { useSpecialtyDetail } from '../hooks/useSpecialties';

export function SpecialtyPage({ specialty: specialtyBasic, onBack }) {
  // Charge les détails complets avec modules depuis l'API
  const { specialty: specialtyFull, loading: loadingSpec } = useSpecialtyDetail(specialtyBasic?.slug);
  const specialty = specialtyFull || specialtyBasic;
  const [activeTab, setActiveTab] = useState('drives'); // 'drives' | 'youtube'

  // Drives filter states
  const [driveSearch, setDriveSearch] = useState('');
  const [driveModule, setDriveModule] = useState('');
  const [driveSemester, setDriveSemester] = useState('');
  const [driveCategory, setDriveCategory] = useState('');

  // YouTube filter states
  const [ytSearch, setYtSearch] = useState('');
  const [ytModule, setYtModule] = useState('');

  const { drives: rawDrives, videos: rawVideos, loading } = useResources({
    specialtySlug: specialty.slug,
  });

  const modules = specialty.modules || [];

  const filteredDrives = useMemo(() => {
    return rawDrives.filter((d) => {
      const matchMod = !driveModule || d.module_code === driveModule;
      const matchSem = !driveSemester || d.semester === driveSemester;
      const matchCat = !driveCategory || d.category === driveCategory;
      const q = driveSearch.trim().toLowerCase();
      const matchQ = !q || 
        d.title?.toLowerCase().includes(q) || 
        d.module_code?.toLowerCase().includes(q) ||
        d.module_title?.toLowerCase().includes(q);
      return matchMod && matchSem && matchCat && matchQ;
    });
  }, [rawDrives, driveModule, driveSemester, driveCategory, driveSearch]);

  const filteredVideos = useMemo(() => {
    return rawVideos.filter((v) => {
      const matchMod = !ytModule || v.module_code === ytModule;
      const q = ytSearch.trim().toLowerCase();
      const matchQ = !q ||
        v.title?.toLowerCase().includes(q) ||
        v.module_code?.toLowerCase().includes(q) ||
        v.module_title?.toLowerCase().includes(q) ||
        v.channel_name?.toLowerCase().includes(q);
      return matchMod && matchQ;
    });
  }, [rawVideos, ytModule, ytSearch]);

  const resetFilters = () => {
    if (activeTab === 'drives') {
      setDriveSearch(''); setDriveModule(''); setDriveSemester(''); setDriveCategory('');
    } else {
      setYtSearch(''); setYtModule('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Top Header with prominent back button */}
      <SpecialtyHeader specialty={specialty} onBack={onBack} />

      {/* Tabs navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('drives')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'drives'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/40 shadow-lg shadow-cyan-950/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Google Drives & Cours ({filteredDrives.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('youtube')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'youtube'
                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/40 shadow-lg shadow-rose-950/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <YoutubeIcon className="w-4 h-4" />
            <span>Vidéos YouTube ({filteredVideos.length})</span>
          </button>
        </div>
      </div>

      {/* Dedicated Search & Filter per Tab */}
      {activeTab === 'drives' ? (
        <ResourceSearchFilter
          type="drives"
          searchQuery={driveSearch}
          onSearchChange={setDriveSearch}
          modules={modules}
          selectedModule={driveModule}
          onModuleChange={setDriveModule}
          selectedSemester={driveSemester}
          onSemesterChange={setDriveSemester}
          selectedCategory={driveCategory}
          onCategoryChange={setDriveCategory}
          totalResults={filteredDrives.length}
        />
      ) : (
        <ResourceSearchFilter
          type="youtube"
          searchQuery={ytSearch}
          onSearchChange={setYtSearch}
          modules={modules}
          selectedModule={ytModule}
          onModuleChange={setYtModule}
          totalResults={filteredVideos.length}
        />
      )}

      {/* Results Display */}
      {loading ? (
        <div className="text-center py-16 text-slate-500 text-sm animate-pulse">
          Chargement des ressources...
        </div>
      ) : activeTab === 'drives' ? (
        filteredDrives.length > 0 ? (
          <DriveLinkList drives={filteredDrives} />
        ) : (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-900/40 space-y-3">
            <p className="text-sm text-slate-400">Aucun document ne correspond à vos filtres.</p>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-cyan-400 hover:text-white transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser les filtres</span>
            </button>
          </div>
        )
      ) : (
        filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos.map((vid) => (
              <YouTubeCard key={vid.id} video={vid} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-900/40 space-y-3">
            <p className="text-sm text-slate-400">Aucune vidéo ne correspond à votre recherche.</p>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-rose-400 hover:text-white transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser les filtres</span>
            </button>
          </div>
        )
      )}
    </div>
  );
}
