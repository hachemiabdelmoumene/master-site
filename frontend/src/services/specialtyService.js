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

export const FALLBACK_MODULES_BY_SPECIALTY = {
  SSI: [
    { id: 101, code: 'CRYPTO', title: 'Cryptographie Avancée', semester: 'S1', coefficient: 4, specialty_code: 'SSI', specialty_slug: 'ssi', specialty_name: 'Sécurité des Systèmes Informatiques' },
    { id: 102, code: 'SECNET', title: 'Sécurité des Réseaux et Protocoles', semester: 'S1', coefficient: 4, specialty_code: 'SSI', specialty_slug: 'ssi', specialty_name: 'Sécurité des Systèmes Informatiques' },
    { id: 103, code: 'MALWARE', title: 'Analyse de Malwares & Rétro-ingénierie', semester: 'S2', coefficient: 3, specialty_code: 'SSI', specialty_slug: 'ssi', specialty_name: 'Sécurité des Systèmes Informatiques' },
    { id: 104, code: 'AUDIT', title: "Audit et Sécurité des Systèmes d'Information", semester: 'S2', coefficient: 3, specialty_code: 'SSI', specialty_slug: 'ssi', specialty_name: 'Sécurité des Systèmes Informatiques' },
    { id: 105, code: 'CLOUDSEC', title: 'Sécurité Cloud et Virtualisation', semester: 'S2', coefficient: 3, specialty_code: 'SSI', specialty_slug: 'ssi', specialty_name: 'Sécurité des Systèmes Informatiques' },
  ],
  SII: [
    { id: 201, code: 'SII11-ALG', title: 'Algorithmique Avancée et Complexité', semester: 'S1', coefficient: 4, specialty_code: 'SII', specialty_slug: 'sii', specialty_name: "Systèmes d'Information Intelligents" },
    { id: 202, code: 'SII11-RDP', title: 'Résolution de Problèmes', semester: 'S1', coefficient: 4, specialty_code: 'SII', specialty_slug: 'sii', specialty_name: "Systèmes d'Information Intelligents" },
    { id: 203, code: 'SII12-COMP', title: 'Compilation : Génération du Code et Optimisation', semester: 'S1', coefficient: 4, specialty_code: 'SII', specialty_slug: 'sii', specialty_name: "Systèmes d'Information Intelligents" },
    { id: 204, code: 'SII12-SE', title: "Systèmes d'Exploitation", semester: 'S1', coefficient: 4, specialty_code: 'SII', specialty_slug: 'sii', specialty_name: "Systèmes d'Information Intelligents" },
    { id: 205, code: 'SII13-MEPS', title: 'Modélisation et Évaluation des Performances des Systèmes', semester: 'S1', coefficient: 3, specialty_code: 'SII', specialty_slug: 'sii', specialty_name: "Systèmes d'Information Intelligents" },
    { id: 206, code: 'SII13-AAR', title: 'Architecture et Administration des Réseaux', semester: 'S1', coefficient: 3, specialty_code: 'SII', specialty_slug: 'sii', specialty_name: "Systèmes d'Information Intelligents" },
    { id: 207, code: 'SII14-ANG', title: 'Anglais', semester: 'S1', coefficient: 2, specialty_code: 'SII', specialty_slug: 'sii', specialty_name: "Systèmes d'Information Intelligents" },
  ],
  IL: [
    { id: 301, code: 'ARCHI', title: 'Architectures Logicielles et Design Patterns', semester: 'S1', coefficient: 4, specialty_code: 'IL', specialty_slug: 'il', specialty_name: 'Ingénierie du Logiciel' },
    { id: 302, code: 'DEVOPS', title: 'DevOps, CI/CD et Conteneurisation', semester: 'S1', coefficient: 4, specialty_code: 'IL', specialty_slug: 'il', specialty_name: 'Ingénierie du Logiciel' },
    { id: 303, code: 'TEST', title: 'Qualité et Tests Logiciels', semester: 'S2', coefficient: 3, specialty_code: 'IL', specialty_slug: 'il', specialty_name: 'Ingénierie du Logiciel' },
  ],
  'M1 HPC': [
    { id: 401, code: 'PARAL', title: 'Calcul Parallèle et Distribué', semester: 'S1', coefficient: 4, specialty_code: 'M1 HPC', specialty_slug: 'm1-hpc', specialty_name: 'High Performance Computing' },
    { id: 402, code: 'CUDA', title: 'Programmation GPU & Accélération CUDA', semester: 'S1', coefficient: 4, specialty_code: 'M1 HPC', specialty_slug: 'm1-hpc', specialty_name: 'High Performance Computing' },
  ],
  BIGDATA: [
    { id: 501, code: 'SPARK', title: 'Traitement Distribué avec Apache Spark', semester: 'S1', coefficient: 4, specialty_code: 'BIGDATA', specialty_slug: 'bigdata', specialty_name: 'Big Data et Analytics' },
    { id: 502, code: 'STREAM', title: 'Streaming de Données Temps Réel (Kafka)', semester: 'S2', coefficient: 4, specialty_code: 'BIGDATA', specialty_slug: 'bigdata', specialty_name: 'Big Data et Analytics' },
  ],
  BIOINFO: [
    { id: 601, code: 'GENOM', title: 'Algorithmique du Séquençage Génomique', semester: 'S1', coefficient: 4, specialty_code: 'BIOINFO', specialty_slug: 'bioinfo', specialty_name: 'Bioinformatique' },
    { id: 602, code: 'STRUCT', title: 'Bioinformatique Structurale et Protéines', semester: 'S2', coefficient: 4, specialty_code: 'BIOINFO', specialty_slug: 'bioinfo', specialty_name: 'Bioinformatique' },
  ],
  RSD: [
    { id: 701, code: 'PROTOC', title: 'Protocoles Réseaux Avancés & SDN', semester: 'S1', coefficient: 4, specialty_code: 'RSD', specialty_slug: 'rsd', specialty_name: 'Réseaux et Systèmes Distribués' },
    { id: 702, code: 'DISTRIB', title: 'Systèmes et Algorithmes Distribués', semester: 'S1', coefficient: 4, specialty_code: 'RSD', specialty_slug: 'rsd', specialty_name: 'Réseaux et Systèmes Distribués' },
  ],
};

export const ALL_FALLBACK_MODULES = Object.values(FALLBACK_MODULES_BY_SPECIALTY).flat();

export const specialtyService = {
  async getAllSpecialties() {
    try {
      const data = await request('/specialties/');
      return data.results || data;
    } catch {
      return FALLBACK_SPECIALTIES;
    }
  },

  async getAllModules() {
    try {
      const data = await request('/modules/?limit=200');
      const list = data.results || data;
      if (Array.isArray(list) && list.length > 0) return list;
    } catch {
      // ignore
    }
    return ALL_FALLBACK_MODULES;
  },

  async createModule(moduleData) {
    try {
      return await request('/modules/', {
        method: 'POST',
        body: JSON.stringify(moduleData),
      });
    } catch (err) {
      console.warn("Création backend indisponible, utilisation locale:", err);
      return {
        id: Date.now(),
        ...moduleData,
        drive_count: 0,
        youtube_count: 0,
      };
    }
  },

  async getSpecialtyBySlug(slug) {
    try {
      return await request(`/specialties/${slug}/`);
    } catch {
      const base = FALLBACK_SPECIALTIES.find((s) => s.slug === slug) || FALLBACK_SPECIALTIES[0];
      const fallbackModules =
        FALLBACK_MODULES_BY_SPECIALTY[base.code] || [
          { id: 101, code: `${base.code}-101`, title: 'Fondements Théoriques & Algorithmes', semester: 'S1', coefficient: 4, drive_count: 6, youtube_count: 3 },
          { id: 102, code: `${base.code}-102`, title: 'Architectures Avancées & Systèmes', semester: 'S1', coefficient: 3, drive_count: 4, youtube_count: 2 },
          { id: 201, code: `${base.code}-201`, title: 'Séminaire Pratique & Études de Cas', semester: 'S2', coefficient: 3, drive_count: 5, youtube_count: 4 },
          { id: 202, code: `${base.code}-202`, title: 'Projet Intégrateur & Recherche', semester: 'S2', coefficient: 5, drive_count: 3, youtube_count: 2 },
        ];

      return { ...base, modules: fallbackModules };
    }
  },
};

