const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

export const tokenStorage = {
  getAccessToken() {
    return localStorage.getItem('access_token');
  },
  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  },
  getUser() {
    const raw = localStorage.getItem('user_data');
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setSession(tokens, user) {
    if (tokens?.access) localStorage.setItem('access_token', tokens.access);
    if (tokens?.refresh) localStorage.setItem('refresh_token', tokens.refresh);
    if (user) localStorage.setItem('user_data', JSON.stringify(user));
  },
  clearSession() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
  },
};

export async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const token = tokenStorage.getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message =
        errorData.detail ||
        errorData.message ||
        (Array.isArray(errorData.non_field_errors) ? errorData.non_field_errors[0] : null) ||
        `Erreur HTTP ${response.status}`;

      const error = new Error(message);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    // Handles empty 204 No Content responses cleanly
    if (response.status === 204) return null;

    return await response.json();
  } catch (error) {
    if (error.status === 401 && endpoint !== '/auth/login/') {
      // Dispatches custom event for AuthContext to react cleanly
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    console.warn(`[API Warning] Échec sur ${endpoint}:`, error.message);
    throw error;
  }
}
