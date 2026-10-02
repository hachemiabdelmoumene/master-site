import { request } from './api';

export const FALLBACK_SPECIALTIES = [
  { id: 1, code: 'SSI', name: 'Sécurité des Systèmes Informatiques', slug: 'ssi', description: 'Cryptographie, cybersécurité offensive, audit et sécurité cloud.', modules_count: 8, total_resources: 34 },
  { id: 2, code: 'SII', name: "Systèmes d'Information Intelligents", slug: 'sii', description: 'Algorithmique, compilation, systèmes d\'exploitation et réseaux.', modules_count: 7, total_resources: 29 },
  { id: 3, code: 'IL', name: 'Ingénierie du Logiciel', slug: 'il', description: 'Architectures modernes, DevOps, micro-services et tests logiciels.', modules_count: 8, total_resources: 41 },
  { id: 4, code: 'M1 HPC', name: 'High Performance Computing', slug: 'm1-hpc', description: 'Calcul parallèle, accélération GPU (CUDA) et clusters MPI.', modules_count: 7, total_resources: 22 },
  { id: 5, code: 'BIGDATA', name: 'Big Data et Analytics', slug: 'bigdata', description: 'Écosystèmes distribués Spark/Hadoop, NoSQL et data engineering.', modules_count: 8, total_resources: 38 },
  { id: 6, code: 'BIOINFO', name: 'Bioinformatique', slug: 'bioinfo', description: 'Algorithmique génomique, biostatistiques et phylogénie.', modules_count: 7, total_resources: 19 },
  { id: 7, code: 'RSD', name: 'Réseaux et Systèmes Distribués', slug: 'rsd', description: 'Protocoles réseaux avancés, SDN, virtualisation et IoT.', modules_count: 8, total_resources: 26 },
];

export const specialtyService = {
  async getAllSpecialties() {
    try {
      const data = await request('/specialties/');
      return data.results || data;
    } catch {
      return FALLBACK_SPECIALTIES;
    }
  },

  async getSpecialtyBySlug(slug) {
    try {
      return await request(`/specialties/${slug}/`);
    } catch {
      const base = FALLBACK_SPECIALTIES.find((s) => s.slug === slug) || FALLBACK_SPECIALTIES[0];

      // Modules réels pour SII
      const SII_MODULES = [
        { id: 201, code: 'SII11-ALG', title: 'Algorithmique Avancée et Complexité', semester: 'S1', coefficient: 4, drive_count: 0, youtube_count: 0 },
        { id: 202, code: 'SII11-RDP', title: 'Résolution de Problèmes', semester: 'S1', coefficient: 4, drive_count: 0, youtube_count: 0 },
        { id: 203, code: 'SII12-COMP', title: 'Compilation : Génération du Code et Optimisation', semester: 'S1', coefficient: 4, drive_count: 0, youtube_count: 0 },
        { id: 204, code: 'SII12-SE', title: "Systèmes d'Exploitation", semester: 'S1', coefficient: 4, drive_count: 0, youtube_count: 0 },
        { id: 205, code: 'SII13-MEPS', title: 'Modélisation et Évaluation des Performances des Systèmes', semester: 'S1', coefficient: 3, drive_count: 0, youtube_count: 0 },
        { id: 206, code: 'SII13-AAR', title: 'Architecture et Administration des Réseaux', semester: 'S1', coefficient: 3, drive_count: 0, youtube_count: 0 },
        { id: 207, code: 'SII14-ANG', title: 'Anglais', semester: 'S1', coefficient: 2, drive_count: 0, youtube_count: 0 },
      ];

      const fallbackModules = base.slug === 'sii' ? SII_MODULES : [
        { id: 101, code: `${base.code}-101`, title: 'Fondements Théoriques & Algorithmes', semester: 'S1', coefficient: 4, drive_count: 6, youtube_count: 3 },
        { id: 102, code: `${base.code}-102`, title: 'Architectures Avancées & Systèmes', semester: 'S1', coefficient: 3, drive_count: 4, youtube_count: 2 },
        { id: 201, code: `${base.code}-201`, title: 'Séminaire Pratique & Études de Cas', semester: 'S2', coefficient: 3, drive_count: 5, youtube_count: 4 },
        { id: 202, code: `${base.code}-202`, title: 'Projet Intégrateur & Recherche', semester: 'S2', coefficient: 5, drive_count: 3, youtube_count: 2 },
      ];

      return { ...base, modules: fallbackModules };
    }
  },
};
