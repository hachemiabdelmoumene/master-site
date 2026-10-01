from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def health_check(request):
    """Endpoint de surveillance de santé pour Render / Uptime monitors."""
    return JsonResponse({"status": "healthy", "service": "master-info-api"}, status=200)


urlpatterns = [
    # Health checks
    path('health/', health_check, name='health_check'),
    path('api/health/', health_check, name='api_health_check'),

    # Django Administration
    path('admin/', admin.site.urls),

    # API v1 (Standard)
    path('api/v1/', include('apps.specialties.urls')),
    path('api/v1/', include('apps.resources.urls')),
    path('api/v1/', include('apps.users.urls')),

    # Alias /api/ pour compatibilité ascendante
    path('api/', include('apps.specialties.urls')),
    path('api/', include('apps.resources.urls')),
    path('api/', include('apps.users.urls')),
]
