from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Modèle utilisateur personnalisé avec gestion du rôle Délégué
    et association à une spécialité de Master Informatique.
    """
    is_delegate = models.BooleanField(
        default=False,
        verbose_name="Est Délégué",
        help_text="Cochez pour attribuer le rôle Délégué et donner accès à l'espace de modération des ressources."
    )
    specialty = models.ForeignKey(
        'specialties.Specialty',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='delegates',
        verbose_name="Spécialité assignée",
        help_text="Spécialité gérée par ce délégué. Laisser vide pour 'Tous les Masters' (accès global)."
    )

    class Meta:
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs & Délégués"
        ordering = ['username']

    def __str__(self):
        role = "Admin" if self.is_superuser else ("Délégué" if self.is_delegate else "Utilisateur")
        spec = f" [{self.specialty.code}]" if self.specialty else " [Tous les Masters]"
        return f"{self.username} ({role}{spec})"
