import { request } from './api';

const FALLBACK_DRIVES = [
  { id: 1, title: 'Polycopié de Cours Magistral 2024', category: 'COURS', drive_url: 'https://drive.google.com', views_count: 142, module_code: 'CRYPTO', semester: 'S1' },
  { id: 2, title: 'Recueil des TD & Corrigés Types', category: 'TD', drive_url: 'https://drive.google.com', views_count: 98, module_code: 'SECNET', semester: 'S1' },
  { id: 3, title: 'Sujets Examens & Rattrapages (2020-2023)', category: 'EXAM', drive_url: 'https://drive.google.com', views_count: 215, module_code: 'CRYPTO', semester: 'S1' },
  { id: 4, title: 'Fiche Synthèse Protocoles & Normes', category: 'SUMMARY', drive_url: 'https://drive.google.com', views_count: 76, module_code: 'MALWARE', semester: 'S2' },
  { id: 5, title: 'TP Pratique Wireshark & Pentest', category: 'TP', drive_url: 'https://drive.google.com', views_count: 110, module_code: 'AUDIT', semester: 'S2' },
];

const FALLBACK_YOUTUBE = [
  { id: 1, title: 'Comprendre RSA et les Courbes Elliptiques', youtube_url: 'https://youtube.com', channel_name: 'CyberDef France', duration: '45m', module_code: 'CRYPTO' },
  { id: 2, title: 'Analyse Dynamique de Malware sous Sandbox', youtube_url: 'https://youtube.com', channel_name: 'RootMe Academy', duration: '1h 12m', module_code: 'MALWARE' },
  { id: 3, title: 'Architecture des Réseaux SDN & OpenFlow', youtube_url: 'https://youtube.com', channel_name: 'TechNetwork Hub', duration: '35m', module_code: 'SECNET' },
  { id: 4, title: 'Masterclass Algorithmique Avancée & Complexité', youtube_url: 'https://youtube.com', channel_name: 'AI Insights', duration: '58m', module_code: 'SII11-ALG' },
];

export const resourceService = {
  async getDrives(params = {}) {
    const query = new URLSearchParams(params).toString();
    try {
      const data = await request(`/drives/?${query}`);
      return data.results || data;
    } catch {
      return FALLBACK_DRIVES;
    }
  },

  async getYouTubeVideos(params = {}) {
    const query = new URLSearchParams(params).toString();
    try {
      const data = await request(`/youtube/?${query}`);
      return data.results || data;
    } catch {
      return FALLBACK_YOUTUBE;
    }
  },

  async getPopularDrives() {
    try {
      return await request('/drives/popular/');
    } catch {
      return FALLBACK_DRIVES.slice(0, 4);
    }
  },

  async getLatestYouTube() {
    try {
      return await request('/youtube/latest/');
    } catch {
      return FALLBACK_YOUTUBE.slice(0, 4);
    }
  },

  async submitContribution(data) {
    return await request('/contributions/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
