import re
from urllib.parse import urlparse
from rest_framework import serializers
from django.utils.html import strip_tags
from .models import Resource

# Domaines autorisés pour YouTube
ALLOWED_YOUTUBE_DOMAINS = {
    'youtube.com',
    'www.youtube.com',
    'm.youtube.com',
    'youtu.be',
    'music.youtube.com'
}

# Domaines à risque d'adresses internes / SSRF à interdire formellement
DISALLOWED_HOSTS = {
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '169.254.169.254',
    '[::1]',
}


def sanitize_text(value):
    """Supprime les balises HTML et scripts pour éliminer tout risque XSS stocké."""
    if not value:
        return value
    cleaned = strip_tags(value).strip()
    return cleaned


def validate_resource_url(url, resource_type):
    """
    Validation stricte des URLs pour prévenir le phishing, le XSS et le SSRF.
    """
    if not url:
        raise serializers.ValidationError("L'URL de la ressource est requise.")

    parsed = urlparse(url.strip())
    if parsed.scheme not in ('http', 'https'):
        raise serializers.ValidationError("Seuls les protocoles HTTP et HTTPS sont autorisés.")

    netloc = parsed.netloc.lower().split(':')[0]

    # Vérification SSRF / Hôtes internes
    if (
        netloc in DISALLOWED_HOSTS or
        netloc.startswith('10.') or
        netloc.startswith('192.168.') or
        (netloc.startswith('172.') and netloc.split('.')[1].isdigit() and 16 <= int(netloc.split('.')[1]) <= 31)
    ):
        raise serializers.ValidationError("Les adresses réseau internes ou locales sont interdites.")

    if resource_type == Resource.ResourceTypeChoices.YOUTUBE:
        if netloc not in ALLOWED_YOUTUBE_DOMAINS:
            raise serializers.ValidationError(
                "L'URL doit être une vidéo YouTube valide (ex: youtube.com ou youtu.be)."
            )

    if resource_type == Resource.ResourceTypeChoices.DRIVE:
        # Recommandation pour les liens partagés Drive / Cloud
        if not ('.' in netloc and len(netloc) >= 4):
            raise serializers.ValidationError("Nom de domaine invalide pour le lien Drive.")

    return url.strip()


class DriveResourceSerializer(serializers.ModelSerializer):
    """Sérialiseur pour l'affichage public des liens Drive approuvés."""
    module_code = serializers.CharField(source='module.code', read_only=True)
    module_title = serializers.CharField(source='module.title', read_only=True)
    semester = serializers.CharField(source='module.semester', read_only=True)
    drive_url = serializers.CharField(source='url', read_only=True)

    class Meta:
        model = Resource
        fields = [
            'id', 'module', 'module_code', 'module_title',
            'semester', 'title', 'category', 'drive_url',
            'views_count', 'created_at'
        ]


class YouTubeResourceSerializer(serializers.ModelSerializer):
    """Sérialiseur pour l'affichage public des vidéos YouTube approuvées."""
    module_code = serializers.CharField(source='module.code', read_only=True)
    module_title = serializers.CharField(source='module.title', read_only=True)
    youtube_url = serializers.CharField(source='url', read_only=True)

    class Meta:
        model = Resource
        fields = [
            'id', 'module', 'module_code', 'module_title',
            'title', 'youtube_url', 'channel_name',
            'duration', 'created_at'
        ]


class ContributionSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les propositions libres soumises par les étudiants avec validation et assainissement."""
    class Meta:
        model = Resource
        fields = [
            'id', 'module', 'resource_type', 'title',
            'url', 'category', 'contributor_name', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def validate_title(self, value):
        cleaned = sanitize_text(value)
        if len(cleaned) < 3:
            raise serializers.ValidationError("Le titre doit contenir au moins 3 caractères.")
        return cleaned

    def validate_contributor_name(self, value):
        cleaned = sanitize_text(value)
        return cleaned or "Étudiant Anonyme"

    def validate(self, attrs):
        resource_type = attrs.get('resource_type', Resource.ResourceTypeChoices.DRIVE)
        url = attrs.get('url')
        if url:
            attrs['url'] = validate_resource_url(url, resource_type)
        return attrs

    def create(self, validated_data):
        validated_data['status'] = Resource.StatusChoices.PENDING
        return super().create(validated_data)


class DelegateResourceSerializer(serializers.ModelSerializer):
    """Sérialiseur complet pour l'espace d'administration Délégué."""
    specialty_name = serializers.CharField(source='module.specialty.name', read_only=True)
    specialty_code = serializers.CharField(source='module.specialty.code', read_only=True)
    specialty_slug = serializers.CharField(source='module.specialty.slug', read_only=True)
    module_code = serializers.CharField(source='module.code', read_only=True)
    module_title = serializers.CharField(source='module.title', read_only=True)
    semester = serializers.CharField(source='module.semester', read_only=True)

    class Meta:
        model = Resource
        fields = [
            'id', 'module', 'module_code', 'module_title',
            'specialty_name', 'specialty_code', 'specialty_slug',
            'semester', 'resource_type', 'title', 'url',
            'category', 'channel_name', 'duration',
            'contributor_name', 'status', 'rejection_reason',
            'views_count', 'created_at', 'updated_at'
        ]


class DirectAddResourceSerializer(serializers.ModelSerializer):
    """Sérialiseur pour l'ajout direct de ressources approuvées par un délégué."""
    class Meta:
        model = Resource
        fields = [
            'id', 'module', 'resource_type', 'title', 'url',
            'category', 'channel_name', 'duration', 'contributor_name'
        ]

    def validate_title(self, value):
        cleaned = sanitize_text(value)
        if len(cleaned) < 3:
            raise serializers.ValidationError("Le titre doit contenir au moins 3 caractères.")
        return cleaned

    def validate_channel_name(self, value):
        return sanitize_text(value)

    def validate_contributor_name(self, value):
        return sanitize_text(value) or "Délégué Promotion"

    def validate(self, attrs):
        resource_type = attrs.get('resource_type', Resource.ResourceTypeChoices.DRIVE)
        url = attrs.get('url')
        if url:
            attrs['url'] = validate_resource_url(url, resource_type)
        return attrs

    def create(self, validated_data):
        validated_data['status'] = Resource.StatusChoices.APPROVED
        user = self.context.get('request').user if self.context.get('request') else None
        if user and user.is_authenticated:
            validated_data['validated_by'] = user
        return super().create(validated_data)
