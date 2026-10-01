from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.core.permissions import IsDelegateOrAdmin
from .models import Resource
from .serializers import (
    DelegateResourceSerializer,
    DirectAddResourceSerializer
)


class DelegateResourceViewSet(viewsets.ModelViewSet):
    """
    ViewSet sécurisé réservé aux Délégués et Administrateurs pour la modération
    et l'ajout direct de ressources académiques.
    """
    serializer_class = DelegateResourceSerializer
    permission_classes = [IsAuthenticated, IsDelegateOrAdmin]

    def get_queryset(self):
        queryset = Resource.objects.all().select_related('module', 'module__specialty')
        user = self.request.user

        # Filtrage par spécialité assignée au délégué (si non admin)
        if user.is_authenticated and not (user.is_staff or user.is_superuser):
            if getattr(user, 'specialty', None):
                queryset = queryset.filter(module__specialty=user.specialty)

        specialty_slug = self.request.query_params.get('specialty_slug')
        if specialty_slug:
            queryset = queryset.filter(module__specialty__slug=specialty_slug)

        resource_status = self.request.query_params.get('status')
        if resource_status:
            queryset = queryset.filter(status=resource_status)

        return queryset

    @action(detail=False, methods=['get'], url_path='pending')
    def pending_resources(self, request):
        """GET /api/delegate/pending-resources/"""
        pending = self.get_queryset().filter(status=Resource.StatusChoices.PENDING)
        serializer = self.get_serializer(pending, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], url_path='approve')
    def approve(self, request, pk=None):
        """PATCH /api/delegate/resources/{id}/approve/"""
        resource = self.get_object()
        resource.status = Resource.StatusChoices.APPROVED
        if request.user.is_authenticated:
            resource.validated_by = request.user
        resource.save()
        return Response(
            {'message': 'Ressource approuvée et publiée avec succès.', 'status': resource.status},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['patch'], url_path='reject')
    def reject(self, request, pk=None):
        """PATCH /api/delegate/resources/{id}/reject/"""
        from django.utils.html import strip_tags
        resource = self.get_object()
        raw_reason = request.data.get('reason', '')
        reason = strip_tags(str(raw_reason))[:500].strip()
        resource.status = Resource.StatusChoices.REJECTED
        resource.rejection_reason = reason
        if request.user.is_authenticated:
            resource.validated_by = request.user
        resource.save()
        return Response(
            {'message': 'Ressource rejetée.', 'reason': reason, 'status': resource.status},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['post'], url_path='create-direct')
    def create_direct(self, request):
        """POST /api/delegate/resources/create/"""
        serializer = DirectAddResourceSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            # Vérification si le délégué a une spécialité restreinte
            user = request.user
            if not (user.is_staff or user.is_superuser) and getattr(user, 'specialty', None):
                module = serializer.validated_data.get('module')
                if module and module.specialty != user.specialty:
                    return Response(
                        {'detail': f"Vous n'avez pas l'autorisation d'ajouter une ressource pour le Master {module.specialty.code}."},
                        status=status.HTTP_403_FORBIDDEN
                    )
            resource = serializer.save(validated_by=request.user)
            return Response(
                DelegateResourceSerializer(resource).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='stats')
    def stats(self, request):
        """Statistiques consolidées (adaptées à la spécialité du délégué)"""
        qs = self.get_queryset()
        return Response({
            'pending_count': qs.filter(status=Resource.StatusChoices.PENDING).count(),
            'approved_count': qs.filter(status=Resource.StatusChoices.APPROVED).count(),
            'rejected_count': qs.filter(status=Resource.StatusChoices.REJECTED).count(),
            'total_resources': qs.count(),
        })
