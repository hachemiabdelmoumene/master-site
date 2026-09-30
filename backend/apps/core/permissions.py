from rest_framework import permissions


class IsDelegateOrAdmin(permissions.BasePermission):
    """
    Vérifie que l'utilisateur est authentifié et possède le rôle
    Délégué ou Administrateur/Staff.
    """
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        return bool(
            request.user.is_staff or
            request.user.is_superuser or
            getattr(request.user, 'is_delegate', False)
        )

    def has_object_permission(self, request, view, obj):
        if not (request.user and request.user.is_authenticated):
            return False

        if request.user.is_staff or request.user.is_superuser:
            return True

        if not getattr(request.user, 'is_delegate', False):
            return False

        # Si le délégué n'a pas de restriction de spécialité (None), accès à tous les Masters
        user_specialty = getattr(request.user, 'specialty', None)
        if not user_specialty:
            return True

        # Spécialité de l'objet (Module ou Resource)
        obj_specialty = getattr(obj, 'specialty', None)
        if not obj_specialty and hasattr(obj, 'module'):
            obj_specialty = obj.module.specialty

        return obj_specialty == user_specialty
