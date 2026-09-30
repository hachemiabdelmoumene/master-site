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
    """
    queryset = Specialty.objects.filter(is_active=True).prefetch_related('modules')
    lookup_field = 'slug'
    permission_classes = [permissions.AllowAny]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return SpecialtyDetailSerializer
        return SpecialtyListSerializer


class ModuleViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet pour consulter les modules avec filtrage par spécialité.
    """
    serializer_class = ModuleSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Module.objects.all().select_related('specialty')
        specialty_slug = self.request.query_params.get('specialty_slug')
        if specialty_slug:
            queryset = queryset.filter(specialty__slug=specialty_slug)
        return queryset
