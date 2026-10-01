from django.db.models import Count, Q
from rest_framework import viewsets, permissions
from .models import Specialty, Module
from .serializers import (
    SpecialtyListSerializer,
    SpecialtyDetailSerializer,
    ModuleSerializer
)


class SpecialtyViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet pour lister et consulter les détails des 7 spécialités de Master.
    Optimisé pour éliminer la prolifération de requêtes SQL (N+1 queries).
    """
    lookup_field = 'slug'
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        if self.action == 'list':
            return Specialty.objects.filter(is_active=True).annotate(
                modules_count_annotated=Count('modules', distinct=True),
                resources_count_annotated=Count(
                    'modules__resources',
                    filter=Q(modules__resources__status='approved'),
                    distinct=True
                )
            ).order_by('order', 'code')

        return Specialty.objects.filter(is_active=True).prefetch_related(
            'modules',
            'modules__resources'
        ).order_by('order', 'code')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return SpecialtyDetailSerializer
        return SpecialtyListSerializer


class ModuleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet pour consulter les modules avec filtrage par spécialité.
    Supporte le paramètre ?specialty_slug=<slug> pour filtrer par master.
    """
    serializer_class = ModuleSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Module.objects.all().select_related('specialty').prefetch_related('resources').order_by('specialty__order', 'semester', 'code')
        specialty_slug = self.request.query_params.get('specialty_slug')
        if specialty_slug:
            queryset = queryset.filter(specialty__slug=specialty_slug)
        return queryset
