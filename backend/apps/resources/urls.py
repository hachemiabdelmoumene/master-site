from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DriveResourceViewSet,
    YouTubeResourceViewSet,
    ContributionViewSet
)
from .delegate_views import DelegateResourceViewSet

router = DefaultRouter()
router.register(r'drives', DriveResourceViewSet, basename='drive')
router.register(r'youtube', YouTubeResourceViewSet, basename='youtube')
router.register(r'contributions', ContributionViewSet, basename='contribution')
router.register(r'delegate/resources', DelegateResourceViewSet, basename='delegate-resource')

urlpatterns = [
    path('', include(router.urls)),
    # Endpoints dédiés spécifiés dans les exigences
    path(
        'delegate/pending-resources/',
        DelegateResourceViewSet.as_view({'get': 'pending_resources'}),
        name='delegate-pending-resources'
    ),
    path(
        'delegate/resources/<int:pk>/approve/',
        DelegateResourceViewSet.as_view({'patch': 'approve'}),
        name='delegate-resource-approve'
    ),
    path(
        'delegate/resources/<int:pk>/reject/',
        DelegateResourceViewSet.as_view({'patch': 'reject'}),
        name='delegate-resource-reject'
    ),
    path(
        'delegate/resources/create/',
        DelegateResourceViewSet.as_view({'post': 'create_direct'}),
        name='delegate-resource-create'
    ),
    path(
        'delegate/stats/',
        DelegateResourceViewSet.as_view({'get': 'stats'}),
        name='delegate-stats'
    ),
]
