from rest_framework import serializers
from .models import Resource


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
    """Sérialiseur pour les propositions libres soumises par les étudiants."""
    class Meta:
        model = Resource
        fields = [
            'id', 'module', 'resource_type', 'title',
            'url', 'category', 'contributor_name', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

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

    def create(self, validated_data):
        validated_data['status'] = Resource.StatusChoices.APPROVED
        user = self.context.get('request').user if self.context.get('request') else None
        if user and user.is_authenticated:
            validated_data['validated_by'] = user
        return super().create(validated_data)
