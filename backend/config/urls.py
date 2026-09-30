from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # API endpoints v1
    path('api/v1/', include('apps.specialties.urls')),
    path('api/v1/', include('apps.resources.urls')),
    path('api/v1/', include('apps.users.urls')),
    # Direct aliases for /api/
    path('api/', include('apps.resources.urls')),
    path('api/', include('apps.users.urls')),
]
