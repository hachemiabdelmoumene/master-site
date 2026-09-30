from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):
    list_display = (
        'username',
        'email',
        'is_delegate',
        'get_specialty_display',
        'is_staff',
        'is_superuser',
        'is_active',
        'date_joined',
    )
    list_filter = (
        'is_delegate',
        'specialty',
        'is_staff',
        'is_superuser',
        'is_active',
    )
    search_fields = ('username', 'first_name', 'last_name', 'email')
    ordering = ('username',)

    fieldsets = BaseUserAdmin.fieldsets + (
        (
            'Rôle Délégué & Attribution Master',
            {
                'fields': ('is_delegate', 'specialty'),
                'description': 'Configurez les droits de modération et la spécialité de rattachement du délégué. Laisser la spécialité vide pour un accès à tous les Masters.',
            },
        ),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        (
            'Rôle Délégué & Attribution Master',
            {
                'fields': ('is_delegate', 'specialty'),
                'description': 'Attribution immédiate du rôle délégué et de sa spécialité lors de la création.',
            },
        ),
    )

    @admin.display(description="Spécialité Master")
    def get_specialty_display(self, obj):
        if obj.specialty:
            return f"{obj.specialty.code} - {obj.specialty.name}"
        if obj.is_delegate or obj.is_staff or obj.is_superuser:
            return "Tous les Masters (Accès global)"
        return "-"
