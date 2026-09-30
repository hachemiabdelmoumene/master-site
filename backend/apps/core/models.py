from django.db import models
from django.contrib.auth.models import User


class TimeStampedModel(models.Model):
    """
    Modèle de base abstrait fournissant des champs horodatés
    création et mise à jour automatiques.
    """
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de création"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Dernière mise à jour"
    )

    class Meta:
        abstract = True
        ordering = ['-created_at']


class DelegateProfile(TimeStampedModel):
    """
    Profil d'authentification pour les Délégués et Modérateurs.
    Peut être restreint à une spécialité spécifique ou global.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="delegate_profile",
        verbose_name="Compte utilisateur"
    )
    specialty = models.ForeignKey(
        'specialties.Specialty',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="delegates",
        verbose_name="Spécialité restreinte (vide = toutes)"
    )
    is_active_delegate = models.BooleanField(
        default=True,
        verbose_name="Délégué actif"
    )

    class Meta:
        verbose_name = "Profil Délégué"
        verbose_name_plural = "Profils Délégués"

    def __str__(self):
        spec = self.specialty.code if self.specialty else "Toutes les spécialités"
        return f"Délégué {self.user.username} ({spec})"
