from rest_framework import serializers
from .models import Specialty, Module


class ModuleSerializer(serializers.ModelSerializer):
    """
    Sérialiseur pour les modules avec statistiques de ressources approuvées.
    """
    drive_count = serializers.SerializerMethodField()
    youtube_count = serializers.SerializerMethodField()

    class Meta:
        model = Module
        fields = [
            'id', 'code', 'title', 'semester',
            'coefficient', 'description',
            'drive_count', 'youtube_count'
        ]

    def get_drive_count(self, obj):
        return obj.resources.filter(status='approved', resource_type='DRIVE').count()

    def get_youtube_count(self, obj):
        return obj.resources.filter(status='approved', resource_type='YOUTUBE').count()


class SpecialtyListSerializer(serializers.ModelSerializer):
    """
    Sérialiseur allégé pour la liste des 7 spécialités (Landing Page).
    """
    modules_count = serializers.SerializerMethodField()
    total_resources = serializers.SerializerMethodField()

    class Meta:
        model = Specialty
        fields = [
            'id', 'name', 'code', 'slug', 'description',
            'accent_color', 'icon_name', 'order',
            'modules_count', 'total_resources'
        ]

    def get_modules_count(self, obj):
        return obj.modules.count()

    def get_total_resources(self, obj):
        return sum(
            m.resources.filter(status='approved').count() for m in obj.modules.all()
        )


class SpecialtyDetailSerializer(serializers.ModelSerializer):
    """
    Sérialiseur complet avec modules pour le Dashboard Spécialité.
    """
    modules = ModuleSerializer(many=True, read_only=True)

    class Meta:
        model = Specialty
        fields = [
            'id', 'name', 'code', 'slug', 'description',
            'accent_color', 'icon_name', 'order', 'modules'
        ]
