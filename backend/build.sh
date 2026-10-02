#!/usr/bin/env bash
# Script de build et initialisation pour le déploiement sur Render
set -o errexit

echo "📦 [1/4] Installation des dépendances Python..."
pip install --upgrade pip
pip install -r requirements.txt

echo "🎨 [2/4] Collecte des fichiers statiques (WhiteNoise)..."
python manage.py collectstatic --no-input

echo "🗄️ [3/4] Application des migrations de base de données..."
python manage.py migrate --no-input

echo "🌱 [4/4] Vérification de l'initialisation des données..."
if [ "$SEED_ON_BUILD" = "true" ]; then
    echo "Exécution de seed_data pour initialiser les spécialités et utilisateurs par défaut..."
    python manage.py seed_data
fi

echo "👤 [5/5] Création du superuser admin (si configuré)..."
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
    python manage.py createsuperuser --no-input || echo "⚠️ Superuser existe déjà, ignoré."
else
    echo "ℹ️ Variables DJANGO_SUPERUSER_* non définies, superuser ignoré."
fi

echo "✅ Build terminé avec succès ! Prêt pour le démarrage."
