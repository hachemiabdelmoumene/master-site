from django.db.models import Count, Q
from rest_framework import viewsets, permissions
from .models import Specialty, Module
from .serializers import (
    SpecialtyListSerializer,
    SpecialtyDetailSerializer,
    ModuleSerializer
)


from apps.core.permissions import IsDelegateOrAdmin


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


class ModuleViewSet(viewsets.ModelViewSet):
    """
    ViewSet pour consulter et créer des modules.
    Lecture publique, création réservée aux délégués et administrateurs.
    """
    serializer_class = ModuleSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsDelegateOrAdmin()]

    def get_queryset(self):
        queryset = Module.objects.all().select_related('specialty').prefetch_related('resources').order_by('specialty__order', 'semester', 'code')
        specialty_slug = self.request.query_params.get('specialty_slug')
        specialty_code = self.request.query_params.get('specialty_code')
        if specialty_slug:
            queryset = queryset.filter(specialty__slug=specialty_slug)
        elif specialty_code:
            queryset = queryset.filter(specialty__code__iexact=specialty_code)
        return queryset

    def perform_create(self, serializer):
        user = self.request.user
        # Si le délégué est assigné à une spécialité spécifique et qu'elle n'est pas passée, on l'associe d'office
        user_specialty = getattr(user, 'specialty', None)
        if user_specialty and not serializer.validated_data.get('specialty'):
            serializer.save(specialty=user_specialty)
        else:
            serializer.save()

