from django.db import models
from django.contrib.auth.models import User
from apps.core.models import TimeStampedModel
from apps.specialties.models import Module


class Resource(TimeStampedModel):
    """
    Modèle unifié pour les ressources étudiantes (Drive & YouTube)
    avec workflow de validation par les délégués.
    """
    class ResourceTypeChoices(models.TextChoices):
        DRIVE = 'DRIVE', 'Google Drive'
        YOUTUBE = 'YOUTUBE', 'Vidéo YouTube'

    class CategoryChoices(models.TextChoices):
        COURS = 'COURS', 'Cours Magistral'
        TD = 'TD', 'Travaux Dirigés (TD)'
        TP = 'TP', 'Travaux Pratiques (TP)'
        EXAM = 'EXAM', 'Examens & Corrigés'
        SUMMARY = 'SUMMARY', 'Fiches & Résumés'

    class StatusChoices(models.TextChoices):
        PENDING = 'pending', 'En attente'
        APPROVED = 'approved', 'Approuvé'
        REJECTED = 'rejected', 'Refusé'

    module = models.ForeignKey(
        Module,
        on_delete=models.CASCADE,
        related_name="resources",
        verbose_name="Module associé"
    )
    resource_type = models.CharField(
        max_length=10,
        choices=ResourceTypeChoices.choices,
        default=ResourceTypeChoices.DRIVE,
        verbose_name="Type de ressource"
    )
    title = models.CharField(
        max_length=200,
        verbose_name="Titre du document ou de la vidéo"
    )
    url = models.URLField(
        max_length=500,
        verbose_name="Lien direct (Drive ou YouTube)"
    )
    category = models.CharField(
        max_length=15,
        choices=CategoryChoices.choices,
        default=CategoryChoices.COURS,
        blank=True,
        verbose_name="Catégorie (Drive)"
    )
    channel_name = models.CharField(
        max_length=120,
        blank=True,
        verbose_name="Nom de la chaîne (YouTube)"
    )
    duration = models.CharField(
        max_length=30,
        blank=True,
        verbose_name="Durée (YouTube)"
    )
    contributor_name = models.CharField(
        max_length=100,
        blank=True,
        default="Étudiant Anonyme",
        verbose_name="Auteur de la proposition"
    )
    status = models.CharField(
        max_length=10,
        choices=StatusChoices.choices,
        default=StatusChoices.PENDING,
        db_index=True,
        verbose_name="Statut de validation"
    )
    rejection_reason = models.TextField(
        blank=True,
        verbose_name="Motif de refus (optionnel)"
    )
    views_count = models.PositiveIntegerField(
        default=0,
        verbose_name="Vues / Téléchargements"
    )
    validated_by = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="validated_resources",
        verbose_name="Délégué validateur"
    )

    class Meta:
        verbose_name = "Ressource"
        verbose_name_plural = "Ressources"
        ordering = ['-created_at']

    @property
    def specialty(self):
        return self.module.specialty

    def __str__(self):
        return f"[{self.status.upper()}] {self.resource_type} - {self.title} ({self.module.code})"
