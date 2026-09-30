from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User


class UserSerializer(serializers.ModelSerializer):
    specialty_id = serializers.IntegerField(source='specialty.id', read_only=True, default=None)
    specialty_code = serializers.CharField(source='specialty.code', read_only=True, default=None)
    specialty_name = serializers.CharField(source='specialty.name', read_only=True, default=None)
    specialty_slug = serializers.CharField(source='specialty.slug', read_only=True, default=None)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'is_delegate',
            'is_staff',
            'is_superuser',
            'is_active',
            'specialty',
            'specialty_id',
            'specialty_code',
            'specialty_name',
            'specialty_slug',
        ]
        read_only_fields = ['id', 'is_delegate', 'is_staff', 'is_superuser']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Sérialiseur JWT étendu validant l'accès Délégué/Admin et renvoyant
    les tokens JWT avec le profil utilisateur complet.
    """
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user

        if not user.is_active:
            raise serializers.ValidationError({"detail": "Ce compte utilisateur est désactivé."})

        # Vérification du rôle délégué ou administrateur
        if not (user.is_delegate or user.is_staff or user.is_superuser):
            raise serializers.ValidationError({
                "detail": "Accès refusé : Ce compte n'a pas les droits de Délégué ni d'Administrateur."
            })

        data['user'] = UserSerializer(user).data
        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        token['is_delegate'] = user.is_delegate
        token['is_staff'] = user.is_staff
        token['is_superuser'] = user.is_superuser
        if user.specialty:
            token['specialty_id'] = user.specialty.id
            token['specialty_code'] = user.specialty.code
            token['specialty_slug'] = user.specialty.slug
        else:
            token['specialty_id'] = None
            token['specialty_code'] = None
            token['specialty_slug'] = None
        return token
