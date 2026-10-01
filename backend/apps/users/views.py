from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .serializers import CustomTokenObtainPairSerializer, UserSerializer


class LoginView(TokenObtainPairView):
    """
    POST /api/auth/login/
    Authentification JWT pour les Délégués et Administrateurs.
    Renvoie les tokens access, refresh et l'objet user complet.
    Protégé contre les attaques par force brute via ScopedRateThrottle.
    """
    serializer_class = CustomTokenObtainPairSerializer
    throttle_scope = 'login'


class RefreshTokenView(TokenRefreshView):
    """
    POST /api/auth/refresh/
    Renouvellement du token JWT d'accès.
    """
    pass


class CurrentUserView(APIView):
    """
    GET /api/auth/me/
    Renvoie les détails de l'utilisateur/délégué actuellement connecté.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
