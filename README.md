# 🎓 Master Info Hub

> Plateforme collaborative moderne centralisant les ressources académiques (liens Google Drive de cours, TD, examens) et les vidéos/playlists YouTube pour les étudiants de **Master Informatique**.

---

## 🗂️ Les 7 Spécialités Prises en Charge

| Code | Nom de la Spécialité | Thème Visuel |
| :--- | :--- | :--- |
| **SSI** | Sécurité des Systèmes Informatiques | Cyber Emerald / Néon Vert |
| **SII** | Systèmes d'Information Intelligents | AI Violet / Indigo |
| **IL** | Ingénierie du Logiciel | Amber / Jaune Doré |
| **M1 HPC** | High Performance Computing | Crimson / Rouge Rose |
| **BIGDATA** | Big Data et Analytics | Sky Blue / Cyan |
| **BIOINFO** | Bioinformatique | Mint / Séquence ADN Vert |
| **RSD** | Réseaux et Systèmes Distribués | Fuchsia / Pourpre Maillage |

---

## 🚀 Démarrage Rapide

### 1. Backend (Django Rest Framework)

```bash
cd backend
# Créer et activer un environnement virtuel
python -m venv venv
.\venv\Scripts\activate   # Windows

# Installer les dépendances
pip install -r requirements.txt

# Appliquer les migrations
python manage.py makemigrations core specialties resources
python manage.py migrate

# Peupler la base avec les 7 spécialités et modules de démonstration
python manage.py seed_data

# Lancer le serveur d'API (port 8000)
python manage.py runserver
```

Endpoints d'API disponibles sur `http://localhost:8000/api/v1/` :
- `GET /api/v1/specialties/` : Liste des 7 spécialités
- `GET /api/v1/specialties/:slug/` : Détails d'une spécialité avec ses modules
- `GET /api/v1/drives/` : Liens Google Drive (filtres par `specialty_slug`, `semester`, `category`)
- `GET /api/v1/drives/popular/` : Drives les plus consultés
- `GET /api/v1/youtube/` : Vidéos et playlists YouTube
- `GET /api/v1/youtube/latest/` : Dernières vidéos ajoutées
- `POST /api/v1/contributions/` : Formulaire de soumission étudiante

---

### 2. Frontend (React 18 + Vite + Tailwind CSS)

```bash
cd frontend
# Installer les dépendances
npm install

# Lancer le serveur de développement (port 5173)
npm run dev
```

Rendez-vous sur [http://localhost:5173](http://localhost:5173).
