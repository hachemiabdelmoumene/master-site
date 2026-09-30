from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SpecialtyViewSet, ModuleViewSet

router = DefaultRouter()
router.register(r'specialties', SpecialtyViewSet, basename='specialty')
router.register(r'modules', ModuleViewSet, basename='module')

urlpatterns = [
    path('', include(router.urls)),
]
