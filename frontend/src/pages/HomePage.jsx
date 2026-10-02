import React, { useState, useEffect } from 'react';
import { Sparkles, HardDrive, ArrowRight } from 'lucide-react';
import { YoutubeIcon } from '../components/common/YoutubeIcon';
import { SpecialtyCard } from '../components/specialties/SpecialtyCard';
import { SearchBar } from '../components/common/SearchBar';
import { DriveLinkList } from '../components/resources/DriveLinkList';
import { YouTubeCard } from '../components/resources/YouTubeCard';
import { resourceService } from '../services/resourceService';

export function HomePage({ specialties, onSelectSpecialty, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [popularDrives, setPopularDrives] = useState([]);
  const [latestVideos, setLatestVideos] = useState([]);

  useEffect(() => {
    resourceService.getPopularDrives().then(setPopularDrives);
    resourceService.getLatestYouTube().then(setLatestVideos);
  }, []);

  const filteredSpecialties = specialties.filter((s) => {
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto px-4 pt-6 pb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Plateforme Ouverte • {specialties.length || 8} Masters Informatique</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
          Tous vos cours, TD & vidéos <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            centralisés en un seul endroit
          </span>
        </h1>

        <p className="mt-5 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Accédez directement aux liens Google Drive organisés par semestre et par module, ainsi qu'aux meilleures playlists vidéo pour réussir votre Master.
        </p>

        {/* Global Search Bar */}
        <div className="mt-8 max-w-xl mx-auto">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Rechercher une spécialité (SSI, BIGDATA...), un cours..."
          />
        </div>
      </section>

      {/* Specialties Interactive Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>Spécialités de Master</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-slate-700">
                {filteredSpecialties.length} / {specialties.length || 8}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">Sélectionnez votre cursus pour accéder aux modules et drives</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredSpecialties.map((spec) => (
            <SpecialtyCard
              key={spec.slug}
              specialty={spec}
              onClick={() => onSelectSpecialty(spec.slug)}
            />
          ))}
        </div>
      </section>

      {/* Quick Access Sections: Popular Drives & Latest YouTube */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Drives les plus consultés */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-cyan-400" />
                <span>Drives les plus consultés</span>
              </h3>
            </div>
            <DriveLinkList drives={popularDrives} />
          </div>

          {/* Dernières vidéos YouTube */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <YoutubeIcon className="w-4 h-4 text-rose-500" />
                <span>Dernières vidéos recommandées</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {latestVideos.map((video) => (
                <YouTubeCard key={video.id} video={video} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
