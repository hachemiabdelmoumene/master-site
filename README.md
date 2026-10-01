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

## 🛡️ Architecture & Sécurisation Renforcée

1. **Sécurité Django & Production :**
   - Mode `DEBUG=False` automatique en production avec clé secrète obligatoire (`DJANGO_SECRET_KEY`).
   - Protection contre le détournement d'hôte (`ALLOWED_HOSTS` strict avec support natif Render).
   - En-têtes HTTPS complets en production : `HSTS` (31536000s + sous-domaines + preload), `X-Frame-Options: DENY` (anti-clickjacking), `X-Content-Type-Options: nosniff`, `SECURE_BROWSER_XSS_FILTER`.
   - Cookies `HttpOnly` et `Secure` automatiques en HTTPS.
   - En-tête Reverse Proxy Render : `SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')`.

2. **Sécurité CORS & CSRF :**
   - Origines autorisées explicites (`CORS_ALLOWED_ORIGINS` & `CSRF_TRUSTED_ORIGINS`), interdiction de `CORS_ALLOW_ALL_ORIGINS` avec credentials.

3. **Protection Anti-Brute Force & Anti-Spam (Throttling DRF) :**
   - Endpoint de connexion délégués (`/api/v1/auth/login/`) bridé à 5 tentatives par minute.
   - Endpoint de soumission étudiante (`/api/v1/contributions/`) bridé à 10 propositions par minute.

4. **Validation des Entrées & Anti-SSRF / Anti-XSS :**
   - Assainissement systématique des champs textes (`strip_tags`) pour éliminer tout XSS stocké.
   - Validation stricte des protocoles autorisés (`http` / `https` uniquement).
   - Blocage strict des adresses IP privées / locales (`localhost`, `127.0.0.1`, `10.*`, `192.168.*`, `169.254.*`, `::1`) contre les attaques SSRF.
   - Validation de domaine pour YouTube (`youtube.com`, `youtu.be`).

5. **Optimisation des Requêtes SQL :**
   - Élimination des requêtes N+1 via les annotations Django ORM et `prefetch_related`.

---

## ☁️ Hébergement sur Render (Réponse : OUI !)

Le site est **100% prêt et configuré pour Render** avec deux options de déploiement :

### Option 1 : Déploiement Automatique Blueprint (Recommandé)
Le fichier [`render.yaml`](file:///c:/Users/hache/OneDrive/Bureau/site-master/render.yaml) est inclus à la racine du projet.
1. Poussez votre code sur votre dépôt GitHub / GitLab.
2. Connectez-vous sur [dashboard.render.com](https://dashboard.render.com/).
3. Cliquez sur **Blueprints** > **New Blueprint Instance**.
4. Sélectionnez votre dépôt : Render déploiera automatiquement :
   - La base de données **PostgreSQL** gérée
   - Le **Backend Django** avec Gunicorn et WhiteNoise
   - Le **Frontend React / Vite** en site statique haute performance

### Option 2 : Déploiement Manuel par Service

#### A. Base de données PostgreSQL :
1. Créez un **PostgreSQL Database** sur Render (Plan Free).
2. Copiez l'URL de connexion interne (`Internal Database URL`).

#### B. Backend Django (Web Service) :
- **Runtime** : Python
- **Root Directory** : `backend`
- **Build Command** : `./build.sh`
- **Start Command** : `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --threads 4`
- **Health Check Path** : `/health/`
- **Variables d'environnement** :
  - `DJANGO_DEBUG` = `False`
  - `DJANGO_SECRET_KEY` = *Générez une clé aléatoire forte*
  - `DJANGO_ALLOWED_HOSTS` = `.onrender.com`
  - `DATABASE_URL` = *URL de votre base PostgreSQL Render*
  - `CORS_ALLOWED_ORIGINS` = `https://<nom-de-votre-frontend>.onrender.com`
  - `CSRF_TRUSTED_ORIGINS` = `https://<nom-de-votre-frontend>.onrender.com`
  - `SEED_ON_BUILD` = `true` (uniquement lors du premier déploiement pour créer les données)

#### C. Frontend React (Static Site) :
- **Root Directory** : `frontend`
- **Build Command** : `npm install && npm run build`
- **Publish Directory** : `dist`
- **Redirects / Rewrites** : `/*` -> `/index.html` (type `Rewrite`)
- **Variable d'environnement** :
  - `VITE_API_URL` = `https://<nom-de-votre-backend>.onrender.com/api/v1`

---

## 💻 Démarrage en Local

### 1. Backend (Django)
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate   # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

### 2. Frontend (Vite)
```bash
cd frontend
npm install
npm run dev
```
Rendez-vous sur [http://localhost:5173](http://localhost:5173).
