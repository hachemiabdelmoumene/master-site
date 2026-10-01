from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import F

from .models import Resource
from .serializers import (
    DriveResourceSerializer,
    YouTubeResourceSerializer,
    ContributionSerializer
)


class DriveResourceViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet public pour les ressources Google Drive approuvées.
    """
    serializer_class = DriveResourceSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Resource.objects.filter(
            status=Resource.StatusChoices.APPROVED,
            resource_type=Resource.ResourceTypeChoices.DRIVE
        ).select_related('module', 'module__specialty')

        slug = self.request.query_params.get('specialty_slug')
        if slug:
            queryset = queryset.filter(module__specialty__slug=slug)

        module_id = self.request.query_params.get('module_id')
        if module_id:
            queryset = queryset.filter(module_id=module_id)

        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)

        semester = self.request.query_params.get('semester')
        if semester:
            queryset = queryset.filter(module__semester=semester)

        return queryset

    @action(detail=True, methods=['post'], url_path='increment-view')
    def increment_view(self, request, pk=None):
        resource = self.get_object()
        Resource.objects.filter(pk=resource.pk).update(views_count=F('views_count') + 1)
        resource.refresh_from_db()
        return Response({'views_count': resource.views_count}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='popular')
    def popular(self, request):
        limit = int(request.query_params.get('limit', 6))
        drives = Resource.objects.filter(
            status=Resource.StatusChoices.APPROVED,
            resource_type=Resource.ResourceTypeChoices.DRIVE
        ).order_by('-views_count')[:limit]
        serializer = self.get_serializer(drives, many=True)
        return Response(serializer.data)


class YouTubeResourceViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet public pour les vidéos YouTube approuvées.
    """
    serializer_class = YouTubeResourceSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Resource.objects.filter(
            status=Resource.StatusChoices.APPROVED,
            resource_type=Resource.ResourceTypeChoices.YOUTUBE
        ).select_related('module', 'module__specialty')

        slug = self.request.query_params.get('specialty_slug')
        if slug:
            queryset = queryset.filter(module__specialty__slug=slug)

        module_id = self.request.query_params.get('module_id')
        if module_id:
            queryset = queryset.filter(module_id=module_id)

        return queryset

    @action(detail=False, methods=['get'], url_path='latest')
    def latest(self, request):
        limit = int(request.query_params.get('limit', 6))
        videos = Resource.objects.filter(
            status=Resource.StatusChoices.APPROVED,
            resource_type=Resource.ResourceTypeChoices.YOUTUBE
        ).order_by('-created_at')[:limit]
        serializer = self.get_serializer(videos, many=True)
        return Response(serializer.data)


class ContributionViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """
    ViewSet public permettant aux étudiants de soumettre une ressource.
    Protégé contre le spam d'envois via un limiteur de débit (ScopedRateThrottle).
    """
    queryset = Resource.objects.all()
    serializer_class = ContributionSerializer
    permission_classes = [AllowAny]
    throttle_scope = 'contributions'
