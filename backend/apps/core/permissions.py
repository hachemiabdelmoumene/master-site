from rest_framework import permissions


class IsDelegateOrAdmin(permissions.BasePermission):
    """
    Vérifie que l'utilisateur est authentifié et possède le rôle
    Délégué actif ou Administrateur/Staff.
    """
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.is_staff or request.user.is_superuser:
            return True
        profile = getattr(request.user, 'delegate_profile', None)
        return bool(profile and profile.is_active_delegate)

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff or request.user.is_superuser:
            return True

        profile = getattr(request.user, 'delegate_profile', None)
        if not profile or not profile.is_active_delegate:
            return False

        # Si le délégué n'a pas de restriction de spécialité, accès total
        if not profile.specialty:
            return True

        # Vérification de la spécialité de l'objet (Module ou Resource)
        obj_specialty = getattr(obj, 'specialty', None)
        if not obj_specialty and hasattr(obj, 'module'):
            obj_specialty = obj.module.specialty

        return obj_specialty == profile.specialty
