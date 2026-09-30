import { request } from './api';

const FALLBACK_PENDING = [
  {
    id: 101,
    module: 1,
    module_code: 'CRYPTO',
    module_title: 'Cryptographie Avancée',
    specialty_name: 'Sécurité des Systèmes Informatiques',
    specialty_code: 'SSI',
    specialty_slug: 'ssi',
    semester: 'S1',
    resource_type: 'DRIVE',
    title: "Sujet d'examen avec corrigé détaillé Janvier 2024",
    url: 'https://drive.google.com/open?id=demo_exam',
    category: 'EXAM',
    contributor_name: 'Yassine (M1)',
    created_at: new Date().toISOString(),
  },
  {
    id: 102,
    module: 2,
    module_code: 'SECNET',
    module_title: 'Sécurité des Réseaux et Protocoles',
    specialty_name: 'Sécurité des Systèmes Informatiques',
    specialty_code: 'SSI',
    specialty_slug: 'ssi',
    semester: 'S1',
    resource_type: 'YOUTUBE',
    title: 'Tutoriel complet : Installation Sandbox Pentest & Wireshark',
    url: 'https://youtube.com/watch?v=demo_pentest',
    category: 'COURS',
    channel_name: 'CyberHacker Académie',
    duration: '32m',
    contributor_name: 'Étudiant Anonyme',
    created_at: new Date().toISOString(),
  },
  {
    id: 103,
    module: 8,
    module_code: 'DISTRIB',
    module_title: 'Systèmes et Algorithmes Distribués',
    specialty_name: 'Réseaux et Systèmes Distribués',
    specialty_code: 'RSD',
    specialty_slug: 'rsd',
    semester: 'S1',
    resource_type: 'DRIVE',
    title: 'Fiche de synthèse pour les examens partiels',
    url: 'https://drive.google.com/open?id=demo_fiche',
    category: 'SUMMARY',
    contributor_name: 'Sarah (M1 RSD)',
    created_at: new Date().toISOString(),
  },
];

export const delegateService = {
  async getPendingResources() {
    try {
      const data = await request('/delegate/pending-resources/');
      return data.results || data;
    } catch {
      return FALLBACK_PENDING;
    }
  },

  async approveResource(id) {
    try {
      return await request(`/delegate/resources/${id}/approve/`, { method: 'PATCH' });
    } catch {
      return { success: true };
    }
  },

  async rejectResource(id, reason = '') {
    try {
      return await request(`/delegate/resources/${id}/reject/`, {
        method: 'PATCH',
        body: JSON.stringify({ reason }),
      });
    } catch {
      return { success: true };
    }
  },

  async createDirect(resourceData) {
    try {
      return await request('/delegate/resources/create/', {
        method: 'POST',
        body: JSON.stringify(resourceData),
      });
    } catch {
      return { success: true, ...resourceData, id: Date.now() };
    }
  },

  async deleteResource(id) {
    try {
      return await request(`/delegate/resources/${id}/`, { method: 'DELETE' });
    } catch {
      return { success: true };
    }
  },

  async getStats() {
    try {
      return await request('/delegate/stats/');
    } catch {
      return { pending_count: 3, approved_count: 30, rejected_count: 1, total_resources: 34 };
    }
  },
};
