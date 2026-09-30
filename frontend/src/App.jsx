import React, { useState, useMemo } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { SpecialtyPage } from './pages/SpecialtyPage';
import { ContributePage } from './pages/ContributePage';
import { DelegateDashboardPage } from './pages/DelegateDashboardPage';
import { useSpecialties } from './hooks/useSpecialties';

export function App() {
  const { specialties } = useSpecialties();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedSlug, setSelectedSlug] = useState(null);

  const handleSelectSpecialty = (slug) => {
    setSelectedSlug(slug);
    setCurrentPage('specialty');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    if (page === 'home') setSelectedSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentSpecialty = specialties.find((s) => s.slug === selectedSlug) || specialties[0];

  // Collect all modules from all specialties for delegate forms
  const allModules = useMemo(() => {
    return specialties.flatMap((s) =>
      (s.modules || []).map((m) => ({ ...m, specialty_code: s.code }))
    );
  }, [specialties]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-slate-100 selection:bg-cyan-500 selection:text-black">
      <Navbar
        currentSlug={selectedSlug}
        onSelectSpecialty={handleSelectSpecialty}
        onNavigate={handleNavigate}
      />

      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            specialties={specialties}
            onSelectSpecialty={handleSelectSpecialty}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'specialty' && currentSpecialty && (
          <SpecialtyPage
            specialty={currentSpecialty}
            onBack={() => handleNavigate('home')}
          />
        )}

        {currentPage === 'contribute' && (
          <ContributePage onBack={() => handleNavigate('home')} />
        )}

        {currentPage === 'delegate' && (
          <DelegateDashboardPage
            onBack={() => handleNavigate('home')}
            allModules={allModules}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
