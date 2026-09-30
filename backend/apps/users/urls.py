from django.urls import path
from .views import LoginView, RefreshTokenView, CurrentUserView

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='auth_login'),
    path('auth/refresh/', RefreshTokenView.as_view(), name='auth_refresh'),
    path('auth/me/', CurrentUserView.as_view(), name='auth_me'),
]
