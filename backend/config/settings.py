import os
from pathlib import Path
from datetime import timedelta
from django.core.exceptions import ImproperlyConfigured
from dotenv import load_dotenv

# Charger les variables d'environnement depuis le fichier .env (si présent)
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# --- SÉCURITÉ : Mode DEBUG et Clé Secrète ---
# Détecte automatiquement l'environnement Render ou la variable DJANGO_DEBUG
is_render = os.getenv('RENDER') == 'true' or bool(os.getenv('RENDER_EXTERNAL_HOSTNAME'))

debug_env = os.getenv('DJANGO_DEBUG')
if debug_env is not None:
    DEBUG = debug_env.lower() in ('true', '1', 't', 'yes')
else:
    DEBUG = not is_render  # True par défaut en local, False automatiquement sur Render

SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')
if not SECRET_KEY:
    if DEBUG:
        SECRET_KEY = 'django-insecure-dev-temporary-key-master-info-hub-local-2024-secure-seed-987654321'
    else:
        raise ImproperlyConfigured("DJANGO_SECRET_KEY est obligatoire en production ! Définissez cette variable d'environnement sur Render.")

# --- SÉCURITÉ : Hôtes autorisés (ALLOWED_HOSTS) ---
allowed_hosts_raw = os.getenv('DJANGO_ALLOWED_HOSTS', '')
if allowed_hosts_raw:
    ALLOWED_HOSTS = [h.strip() for h in allowed_hosts_raw.split(',') if h.strip()]
elif DEBUG:
    ALLOWED_HOSTS = ['localhost', '127.0.0.1', '[::1]']
else:
    # Détection automatique de Render
    ALLOWED_HOSTS = ['.onrender.com']

# Prise en charge automatique de l'hôte externe Render
render_external_hostname = os.getenv('RENDER_EXTERNAL_HOSTNAME')
if render_external_hostname and render_external_hostname not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append(render_external_hostname)

# Applications installées
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'whitenoise.runserver_nostatic',
    'django.contrib.staticfiles',
    # Bibliothèques tierces sécurisées
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    # Applications locales du projet
    'apps.core.apps.CoreConfig',
    'apps.users.apps.UsersConfig',
    'apps.specialties.apps.SpecialtiesConfig',
    'apps.resources.apps.ResourcesConfig',
]

AUTH_USER_MODEL = 'users.User'

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# --- BASE DE DONNÉES (Render PostgreSQL ou SQLite local) ---
DATABASE_URL = os.getenv('DATABASE_URL')
if DATABASE_URL:
    import dj_database_url
    DATABASES = {
        'default': dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=600,
            conn_health_checks=True,
            ssl_require=not DEBUG,
        )
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# --- VALIDATION DES MOTS DE PASSE (Sécurité renforcée) ---
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', 'OPTIONS': {'min_length': 8}},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'fr-fr'
TIME_ZONE = 'Europe/Paris'
USE_I18N = True
USE_TZ = True

# --- FICHIERS STATIQUES (WhiteNoise pour Render) ---
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# --- SÉCURITÉ REST FRAMEWORK & THROTTLING (Anti-Brute Force / Anti-Spam) ---
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 50,
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ] + (['rest_framework.renderers.BrowsableAPIRenderer'] if DEBUG else []),
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
        'rest_framework.throttling.ScopedRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': os.getenv('THROTTLE_ANON', '100/minute'),
        'user': os.getenv('THROTTLE_USER', '400/minute'),
        'login': os.getenv('THROTTLE_LOGIN', '5/minute'),        # Bloque les attaques par force brute
        'contributions': os.getenv('THROTTLE_CONTRIBUTIONS', '10/minute'),  # Bloque le spam de soumission
    },
}

# --- SÉCURITÉ JWT ---
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=2),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': False,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}

# --- SÉCURITÉ CORS & CSRF ---
cors_origins_raw = os.getenv('CORS_ALLOWED_ORIGINS', '')
if cors_origins_raw:
    CORS_ALLOWED_ORIGINS = [o.strip() for o in cors_origins_raw.split(',') if o.strip()]
elif DEBUG:
    CORS_ALLOWED_ORIGINS = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',
    ]
else:
    CORS_ALLOWED_ORIGINS = []

CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# CSRF Trusted Origins
csrf_origins_raw = os.getenv('CSRF_TRUSTED_ORIGINS', '')
if csrf_origins_raw:
    CSRF_TRUSTED_ORIGINS = [o.strip() for o in csrf_origins_raw.split(',') if o.strip()]
elif DEBUG:
    CSRF_TRUSTED_ORIGINS = [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ]
else:
    CSRF_TRUSTED_ORIGINS = []

if render_external_hostname:
    render_csrf = f"https://{render_external_hostname}"
    if render_csrf not in CSRF_TRUSTED_ORIGINS:
        CSRF_TRUSTED_ORIGINS.append(render_csrf)

# --- EN-TÊTES DE SÉCURITÉ & HTTPS PRODUCTION ---
if not DEBUG:
    # Détection SSL via le Reverse Proxy Render
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_SSL_REDIRECT = os.getenv('DJANGO_SECURE_SSL_REDIRECT', 'True').lower() in ('true', '1')

    # Cookies sécurisés
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    CSRF_COOKIE_HTTPONLY = False

    # Protection contre le détournement de clics, le sniffing MIME et XSS
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'

    # HSTS (Strict Transport Security)
    SECURE_HSTS_SECONDS = int(os.getenv('DJANGO_HSTS_SECONDS', '31536000'))
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True

    # Durée de validité de session
    SESSION_COOKIE_AGE = 86400  # 24h
