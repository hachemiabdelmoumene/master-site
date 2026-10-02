import React, { useState, useMemo, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { SpecialtyPage } from './pages/SpecialtyPage';
import { ContributePage } from './pages/ContributePage';
import { DelegateDashboardPage } from './pages/DelegateDashboardPage';
import { DelegateLoginPage } from './pages/DelegateLoginPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useSpecialties } from './hooks/useSpecialties';

function MainApp({ onReady }) {
  const { specialties, loading: specialtiesLoading } = useSpecialties();
  const { isAuthenticated, isDelegate } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedSlug, setSelectedSlug] = useState(null);

  // Remove the HTML loader once specialties have loaded
  useEffect(() => {
    if (!specialtiesLoading && onReady) {
      onReady();
    }
  }, [specialtiesLoading, onReady]);

  // Synchronize route on initial load and popstate
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();

      if (path.includes('/delegate/login') || hash.includes('/delegate/login')) {
        setCurrentPage('delegate_login');
      } else if (path.includes('/delegate/dashboard') || hash.includes('/delegate/dashboard') || path.includes('/delegate')) {
        setCurrentPage(isAuthenticated && isDelegate ? 'delegate_dashboard' : 'delegate_login');
      } else if (path.includes('/contribute') || hash.includes('/contribute')) {
        setCurrentPage('contribute');
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [isAuthenticated, isDelegate]);

  const handleSelectSpecialty = (slug) => {
    setSelectedSlug(slug);
    setCurrentPage('specialty');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page) => {
    if (page === 'delegate') {
      setCurrentPage(isAuthenticated && isDelegate ? 'delegate_dashboard' : 'delegate_login');
    } else {
      setCurrentPage(page);
    }

    if (page === 'home') setSelectedSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentSpecialty = specialties.find((s) => s.slug === selectedSlug) || specialties[0];

  // Collect all modules from all specialties for delegate forms
  const allModules = useMemo(() => {
    return specialties.flatMap((s) =>
      (s.modules || []).map((m) => ({ ...m, specialty_code: s.code, specialty_name: s.name }))
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

        {currentPage === 'delegate_login' && (
          <DelegateLoginPage
            onSuccess={() => handleNavigate('delegate_dashboard')}
            onBack={() => handleNavigate('home')}
          />
        )}

        {currentPage === 'delegate_dashboard' && (
          <ProtectedRoute onRedirectToLogin={() => handleNavigate('delegate_login')}>
            <DelegateDashboardPage
              onBack={() => handleNavigate('home')}
              allModules={allModules}
            />
          </ProtectedRoute>
        )}
      </main>

      <Footer />
    </div>
  );
}

export function App({ onReady }) {
  return (
    <AuthProvider>
      <MainApp onReady={onReady} />
    </AuthProvider>
  );
}

export default App;
