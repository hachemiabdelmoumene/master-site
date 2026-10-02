import { request } from './api';

export const FALLBACK_SPECIALTIES = [
  { id: 1, code: 'SSI',     name: 'Sécurité des Systèmes Informatiques',   slug: 'ssi',     description: "Arithmétique modulaire, réseaux, sécurité informatique et systèmes d'exploitation.", modules_count: 8,  total_resources: 16 },
  { id: 2, code: 'SII',     name: "Systèmes d'Information Intelligents",   slug: 'sii',     description: "Algorithmique, compilation, systèmes d'exploitation et réseaux.", modules_count: 7, total_resources: 14 },
  { id: 3, code: 'IL',      name: 'Ingénierie du Logiciel',                 slug: 'il',      description: "Génie logiciel, BDD, systèmes d'exploitation et gestion de projets.", modules_count: 7, total_resources: 14 },
  { id: 4, code: 'HPC',     name: 'High Performance Computing',             slug: 'hpc',     description: 'Architectures avancées, simulation, calcul haute performance et mathématiques.', modules_count: 7, total_resources: 14 },
  { id: 5, code: 'BIGDATA', name: 'Big Data et Analytics',                  slug: 'bigdata', description: 'Programmation avancée, Big Data, bases de données et stratégie décisionnelle.', modules_count: 11, total_resources: 22 },
  { id: 6, code: 'BIOINFO', name: 'Bioinformatique',                        slug: 'bioinfo', description: 'Génomique, biostatistique, biomathématique et programmation scientifique.', modules_count: 7, total_resources: 14 },
  { id: 7, code: 'RSD',     name: 'Réseaux et Systèmes Distribués',         slug: 'rsd',     description: 'Algorithmique, réseaux et protocoles, SGBD, performances et exploitation.', modules_count: 7, total_resources: 14 },
  { id: 8, code: 'IV',      name: 'Master Informatique Visuelle',           slug: 'iv',      description: "Algorithmes, traitement d'images, multimédia, BDD et systèmes.", modules_count: 7, total_resources: 14 },
];

export const FALLBACK_MODULES_BY_SPECIALTY = {
  SSI: [
    { id: 101, code: 'ARMO',  title: 'Arithmétique modulaire',                                      semester: 'S1', coefficient: 4, specialty_code: 'SSI', specialty_slug: 'ssi', specialty_name: 'Sécurité des Systèmes Informatiques' },
    { id: 102, code: 'ARIN',  title: 'Architectures des réseaux informatiques',                     semester: 'S1', coefficient: 5, specialty_code: 'SSI', specialty_slug: 'ssi', specialty_name: 'Sécurité des Systèmes Informatiques' },
    { id: 103, code: 'INSI',  title: 'Introduction à la sécurité informatique',                     semester: 'S1', coefficient: 5, specialty_code: 'SSI', specialty_slug: 'ssi', specialty_name: 'Sécurité des Systèmes Informatiques' },
    { id: 104, code: 'SYEX',  title: "Systèmes d'exploitation",                                     semester: 'S1', coefficient: 5, specialty_code: 'SSI', specialty_slug: 'ssi', specialty_name: 'Sécurité des Systèmes Informatiques' },
    { id: 105, code: 'VTB D', title: 'Veille technologique et Bases de données avancées',           semester: 'S1', coefficient: 5, specialty_code: 'SSI', specialty_slug: 'ssi', specialty_name: 'Sécurité des Systèmes Informatiques' },
    { id: 106, code: 'CALG',  title: 'Complexité algorithmique',                                     semester: 'S1', coefficient: 3, specialty_code: 'SSI', specialty_slug: 'ssi', specialty_name: 'Sécurité des Systèmes Informatiques' },
    { id: 107, code: 'AJSI',  title: 'Aspects juridiques dans la sécurité informatique',             semester: 'S1', coefficient: 1, specialty_code: 'SSI', specialty_slug: 'ssi', specialty_name: 'Sécurité des Systèmes Informatiques' },
    { id: 108, code: 'ANIN',  title: "Anglais pour l'informatique",                                  semester: 'S1', coefficient: 2, specialty_code: 'SSI', specialty_slug: 'ssi', specialty_name: 'Sécurité des Systèmes Informatiques' },
  ],
  SII: [
    { id: 201, code: 'algo',          title: 'Algorithmique Avancée et Complexité',                          semester: 'S1', coefficient: 3, specialty_code: 'SII', specialty_slug: 'sii', specialty_name: "Systèmes d'Information Intelligents" },
    { id: 202, code: 'RP',            title: 'Résolution de problèmes',                                      semester: 'S1', coefficient: 3, specialty_code: 'SII', specialty_slug: 'sii', specialty_name: "Systèmes d'Information Intelligents" },
    { id: 203, code: 'compil',        title: 'Compilation : génération du code et optimisation',             semester: 'S1', coefficient: 3, specialty_code: 'SII', specialty_slug: 'sii', specialty_name: "Systèmes d'Information Intelligents" },
    { id: 204, code: 'SE',            title: "Systèmes d'exploitation",                                      semester: 'S1', coefficient: 3, specialty_code: 'SII', specialty_slug: 'sii', specialty_name: "Systèmes d'Information Intelligents" },
    { id: 205, code: 'MEPS',          title: 'Modélisation et évaluation des performances des systèmes',     semester: 'S1', coefficient: 3, specialty_code: 'SII', specialty_slug: 'sii', specialty_name: "Systèmes d'Information Intelligents" },
    { id: 206, code: 'admin reseau',  title: 'Architecture et administration des réseaux',                    semester: 'S1', coefficient: 3, specialty_code: 'SII', specialty_slug: 'sii', specialty_name: "Systèmes d'Information Intelligents" },
    { id: 207, code: 'Anglais',       title: 'Anglais',                                                       semester: 'S1', coefficient: 2, specialty_code: 'SII', specialty_slug: 'sii', specialty_name: "Systèmes d'Information Intelligents" },
  ],
  IL: [
    { id: 301, code: 'ALGO',               title: 'Algorithmique Avancée et Complexité',                       semester: 'S1', coefficient: 3, specialty_code: 'IL', specialty_slug: 'il', specialty_name: 'Ingénierie du Logiciel' },
    { id: 302, code: 'compil 1 ou GL',     title: "Systèmes d'Information et Génie Logiciel OU Compilation1", semester: 'S1', coefficient: 3, specialty_code: 'IL', specialty_slug: 'il', specialty_name: 'Ingénierie du Logiciel' },
    { id: 303, code: 'Arch et admin bdd',  title: 'Architecture et Administration de bases de Données',        semester: 'S1', coefficient: 3, specialty_code: 'IL', specialty_slug: 'il', specialty_name: 'Ingénierie du Logiciel' },
    { id: 304, code: 'MEPS',               title: 'Modélisation et évaluation des performances des systèmes', semester: 'S1', coefficient: 3, specialty_code: 'IL', specialty_slug: 'il', specialty_name: 'Ingénierie du Logiciel' },
    { id: 305, code: 'SE',                 title: "Systèmes d'exploitation",                                   semester: 'S1', coefficient: 3, specialty_code: 'IL', specialty_slug: 'il', specialty_name: 'Ingénierie du Logiciel' },
    { id: 306, code: 'GP',                 title: 'Gestion de Projets de Logiciels',                          semester: 'S1', coefficient: 3, specialty_code: 'IL', specialty_slug: 'il', specialty_name: 'Ingénierie du Logiciel' },
    { id: 307, code: 'Anglais',            title: 'Anglais',                                                   semester: 'S1', coefficient: 3, specialty_code: 'IL', specialty_slug: 'il', specialty_name: 'Ingénierie du Logiciel' },
  ],
  HPC: [
    { id: 401, code: 'ALGO',     title: 'Algorithmique Avancée et Complexité',          semester: 'S1', coefficient: 3, specialty_code: 'HPC', specialty_slug: 'hpc', specialty_name: 'High Performance Computing' },
    { id: 402, code: 'ARCH',     title: 'Architectures Avancées',                        semester: 'S1', coefficient: 3, specialty_code: 'HPC', specialty_slug: 'hpc', specialty_name: 'High Performance Computing' },
    { id: 403, code: 'bdd AVAN', title: 'Bases de données Avancées',                    semester: 'S1', coefficient: 3, specialty_code: 'HPC', specialty_slug: 'hpc', specialty_name: 'High Performance Computing' },
    { id: 404, code: 'SE',       title: "Systèmes d'exploitation",                      semester: 'S1', coefficient: 3, specialty_code: 'HPC', specialty_slug: 'hpc', specialty_name: 'High Performance Computing' },
    { id: 405, code: 'MS',       title: 'Modélisation et Simulation',                   semester: 'S1', coefficient: 2, specialty_code: 'HPC', specialty_slug: 'hpc', specialty_name: 'High Performance Computing' },
    { id: 406, code: 'MATH',     title: 'Mathématiques appliquées (Analyse numérique)', semester: 'S1', coefficient: 2, specialty_code: 'HPC', specialty_slug: 'hpc', specialty_name: 'High Performance Computing' },
    { id: 407, code: 'ANG',      title: 'Anglais',                                       semester: 'S1', coefficient: 1, specialty_code: 'HPC', specialty_slug: 'hpc', specialty_name: 'High Performance Computing' },
  ],
  BIGDATA: [
    { id: 501, code: 'PRAVEAN', title: 'Programmation avancée',                                                 semester: 'S1', coefficient: 3, specialty_code: 'BIGDATA', specialty_slug: 'bigdata', specialty_name: 'Big Data et Analytics' },
    { id: 502, code: 'GDB',     title: 'Graphes et Big Data',                                                   semester: 'S1', coefficient: 3, specialty_code: 'BIGDATA', specialty_slug: 'bigdata', specialty_name: 'Big Data et Analytics' },
    { id: 503, code: 'BADO',    title: 'Bases de Données (Option)',                                              semester: 'S1', coefficient: 3, specialty_code: 'BIGDATA', specialty_slug: 'bigdata', specialty_name: 'Big Data et Analytics' },
    { id: 504, code: 'GP',      title: 'Gestion de projet',                                                     semester: 'S1', coefficient: 3, specialty_code: 'BIGDATA', specialty_slug: 'bigdata', specialty_name: 'Big Data et Analytics' },
    { id: 505, code: 'ANG',     title: 'Anglais',                                                                semester: 'S1', coefficient: 3, specialty_code: 'BIGDATA', specialty_slug: 'bigdata', specialty_name: 'Big Data et Analytics' },
    { id: 506, code: 'SAAD',    title: "Stratégie de sécurité pour l'aide à la décision",                      semester: 'S1', coefficient: 3, specialty_code: 'BIGDATA', specialty_slug: 'bigdata', specialty_name: 'Big Data et Analytics' },
    { id: 507, code: 'THOR',    title: "Théorie de l'ordonnancement",                                           semester: 'S1', coefficient: 3, specialty_code: 'BIGDATA', specialty_slug: 'bigdata', specialty_name: 'Big Data et Analytics' },
    { id: 508, code: 'VT',      title: 'Veille Technologie',                                                    semester: 'S1', coefficient: 3, specialty_code: 'BIGDATA', specialty_slug: 'bigdata', specialty_name: 'Big Data et Analytics' },
    { id: 509, code: 'OL',      title: 'Optimisation linéaire (option)',                                        semester: 'S1', coefficient: 3, specialty_code: 'BIGDATA', specialty_slug: 'bigdata', specialty_name: 'Big Data et Analytics' },
    { id: 510, code: 'POO',     title: 'Programmation Orientée Objet (option)',                                  semester: 'S1', coefficient: 3, specialty_code: 'BIGDATA', specialty_slug: 'bigdata', specialty_name: 'Big Data et Analytics' },
    { id: 511, code: 'CPSI',    title: 'Calcul de probabilités et statistique inférentielle (option)',          semester: 'S1', coefficient: 3, specialty_code: 'BIGDATA', specialty_slug: 'bigdata', specialty_name: 'Big Data et Analytics' },
  ],
  BIOINFO: [
    { id: 601, code: 'AAC',     title: 'Algorithmique Avancée et Complicité',  semester: 'S1', coefficient: 3, specialty_code: 'BIOINFO', specialty_slug: 'bioinfo', specialty_name: 'Bioinformatique' },
    { id: 602, code: 'BIOGEN',  title: 'Bioinfo et Génomique',                 semester: 'S1', coefficient: 4, specialty_code: 'BIOINFO', specialty_slug: 'bioinfo', specialty_name: 'Bioinformatique' },
    { id: 603, code: 'BIOSTAT', title: 'Biostatistique',                       semester: 'S1', coefficient: 3, specialty_code: 'BIOINFO', specialty_slug: 'bioinfo', specialty_name: 'Bioinformatique' },
    { id: 604, code: 'BIOMATH', title: 'Biomathématique',                      semester: 'S1', coefficient: 3, specialty_code: 'BIOINFO', specialty_slug: 'bioinfo', specialty_name: 'Bioinformatique' },
    { id: 605, code: 'SPS',     title: 'Système et Programmation de Scripts',  semester: 'S1', coefficient: 3, specialty_code: 'BIOINFO', specialty_slug: 'bioinfo', specialty_name: 'Bioinformatique' },
    { id: 606, code: 'GPR',     title: 'Gestion de Projet',                    semester: 'S1', coefficient: 3, specialty_code: 'BIOINFO', specialty_slug: 'bioinfo', specialty_name: 'Bioinformatique' },
    { id: 607, code: 'ANG1',    title: 'ANGLAIS',                               semester: 'S1', coefficient: 3, specialty_code: 'BIOINFO', specialty_slug: 'bioinfo', specialty_name: 'Bioinformatique' },
  ],
  RSD: [
    { id: 701, code: 'Algo',    title: 'Algorithmique Avancée et Complexité',                     semester: 'S1', coefficient: 3, specialty_code: 'RSD', specialty_slug: 'rsd', specialty_name: 'Réseaux et Systèmes Distribués' },
    { id: 702, code: 'RP',      title: 'Réseaux et Protocoles',                                   semester: 'S1', coefficient: 3, specialty_code: 'RSD', specialty_slug: 'rsd', specialty_name: 'Réseaux et Systèmes Distribués' },
    { id: 703, code: 'ASGBD',   title: 'Architecture et Administration de SGBD',                  semester: 'S1', coefficient: 3, specialty_code: 'RSD', specialty_slug: 'rsd', specialty_name: 'Réseaux et Systèmes Distribués' },
    { id: 704, code: 'GP',      title: 'Gestion de Projet de Développement de Logiciels',         semester: 'S1', coefficient: 3, specialty_code: 'RSD', specialty_slug: 'rsd', specialty_name: 'Réseaux et Systèmes Distribués' },
    { id: 705, code: 'MEPS',    title: 'Modélisation et Evaluation de Performances des Systèmes', semester: 'S1', coefficient: 3, specialty_code: 'RSD', specialty_slug: 'rsd', specialty_name: 'Réseaux et Systèmes Distribués' },
    { id: 706, code: 'SE',      title: "Systèmes d'exploitation",                                 semester: 'S1', coefficient: 3, specialty_code: 'RSD', specialty_slug: 'rsd', specialty_name: 'Réseaux et Systèmes Distribués' },
    { id: 707, code: 'Anglais', title: 'Anglais',                                                  semester: 'S1', coefficient: 1, specialty_code: 'RSD', specialty_slug: 'rsd', specialty_name: 'Réseaux et Systèmes Distribués' },
  ],
  IV: [
    { id: 801, code: 'ALGC', title: 'Algorithmes Avancé et Complexité',  semester: 'S1', coefficient: 3, specialty_code: 'IV', specialty_slug: 'iv', specialty_name: 'Master Informatique Visuelle' },
    { id: 802, code: 'ABD',  title: 'Architecture des Bases de données', semester: 'S1', coefficient: 3, specialty_code: 'IV', specialty_slug: 'iv', specialty_name: 'Master Informatique Visuelle' },
    { id: 803, code: 'RP',   title: 'Résolution de problèmes',           semester: 'S1', coefficient: 3, specialty_code: 'IV', specialty_slug: 'iv', specialty_name: 'Master Informatique Visuelle' },
    { id: 804, code: 'SE',   title: "Systèmes d'exploitation",           semester: 'S1', coefficient: 3, specialty_code: 'IV', specialty_slug: 'iv', specialty_name: 'Master Informatique Visuelle' },
    { id: 805, code: 'TAI',  title: "Traitement et analyse d'images",    semester: 'S1', coefficient: 3, specialty_code: 'IV', specialty_slug: 'iv', specialty_name: 'Master Informatique Visuelle' },
    { id: 806, code: 'CM',   title: 'Communication Multimédia',          semester: 'S1', coefficient: 3, specialty_code: 'IV', specialty_slug: 'iv', specialty_name: 'Master Informatique Visuelle' },
    { id: 807, code: 'ANG',  title: 'Anglais',                            semester: 'S1', coefficient: 1, specialty_code: 'IV', specialty_slug: 'iv', specialty_name: 'Master Informatique Visuelle' },
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
      if (Array.isArray(list) && list.length > 0) {
        // Combiner les modules de la BDD avec les modules de secours pour les spécialités non encore en BDD
        const dbCodes = new Set(list.map((m) => `${(m.specialty_code || '').toUpperCase()}_${(m.code || '').toUpperCase()}`));
        const missingFallbacks = ALL_FALLBACK_MODULES.filter(
          (m) => !dbCodes.has(`${(m.specialty_code || '').toUpperCase()}_${(m.code || '').toUpperCase()}`)
        );
        return [...list, ...missingFallbacks];
      }
    } catch {
      // ignore — fallback below
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
      console.warn('Création backend indisponible, utilisation locale:', err);
      return {
        id: Date.now(),
        ...moduleData,
        drive_count: 0,
        youtube_count: 0,
      };
    }
  },

  async getSpecialtyBySlug(slug) {
    const slugUpper = (slug || '').toUpperCase();
    try {
      const data = await request(`/specialties/${slug}/`);
      if (data) {
        const specCode = (data.code || slugUpper).toUpperCase();
        if (!data.modules || data.modules.length === 0) {
          data.modules = FALLBACK_MODULES_BY_SPECIALTY[specCode] || [];
        }
        return data;
      }
    } catch {
      // ignore — fallback below
    }
    const base = FALLBACK_SPECIALTIES.find((s) => s.slug === slug) || FALLBACK_SPECIALTIES[0];
    const fallbackModules =
      FALLBACK_MODULES_BY_SPECIALTY[base.code] ||
      FALLBACK_MODULES_BY_SPECIALTY[slugUpper] || [];
    return { ...base, modules: fallbackModules };
  },
};

