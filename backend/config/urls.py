from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # API endpoints v1
    path('api/v1/', include('apps.specialties.urls')),
    path('api/v1/', include('apps.resources.urls')),
    # Direct alias for /api/delegate/
    path('api/', include('apps.resources.urls')),
]
