import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { request, tokenStorage } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => tokenStorage.getUser());
  const [token, setToken] = useState(() => tokenStorage.getAccessToken());
  const [isLoading, setIsLoading] = useState(true);

  // Validate or synchronize session on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = tokenStorage.getAccessToken();
      const storedUser = tokenStorage.getUser();

      if (storedToken && storedUser) {
        try {
          // Verify token validity by calling /auth/me/
          const freshUser = await request('/auth/me/');
          setUser(freshUser);
          tokenStorage.setSession({ access: storedToken }, freshUser);
        } catch (err) {
          console.warn('Session expirée ou invalide:', err);
          tokenStorage.clearSession();
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();

    // Listener for unauthorized API responses
    const handleUnauthorized = () => {
      tokenStorage.clearSession();
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = useCallback(async (username, password) => {
    try {
      const data = await request('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const { access, refresh, user: userData } = data;

      tokenStorage.setSession({ access, refresh }, userData);
      setToken(access);
      setUser(userData);

      return { success: true, user: userData };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clearSession();
    setUser(null);
    setToken(null);
  }, []);

  const isAuthenticated = Boolean(user && token);
  const isDelegate = Boolean(user && (user.is_delegate || user.is_staff || user.is_superuser));
  const isSuperAdmin = Boolean(user && (user.is_superuser || user.is_staff));
  const specialtySlug = user?.specialty_slug || null;
  const specialtyCode = user?.specialty_code || null;

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    isDelegate,
    isSuperAdmin,
    specialtySlug,
    specialtyCode,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
