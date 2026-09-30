from django.db import models
from django.utils.text import slugify
from apps.core.models import TimeStampedModel


class Specialty(TimeStampedModel):
    """
    Modèle représentant une spécialité de Master Informatique
    (SSI, SII, IL, M1 HPC, BIGDATA, BIOINFO, RSD).
    """
    name = models.CharField(
        max_length=150,
        verbose_name="Nom complet du Master"
    )
    code = models.CharField(
        max_length=20,
        unique=True,
        verbose_name="Code acronyme (ex: SSI, BIGDATA)"
    )
    slug = models.SlugField(
        max_length=50,
        unique=True,
        blank=True,
        verbose_name="Slug URL"
    )
    description = models.TextField(
        verbose_name="Description détaillée"
    )
    accent_color = models.CharField(
        max_length=30,
        default="#3b82f6",
        verbose_name="Couleur d'accent (Hex / Theme token)"
    )
    icon_name = models.CharField(
        max_length=50,
        default="BookOpen",
        verbose_name="Nom de l'icône"
    )
    order = models.PositiveSmallIntegerField(
        default=0,
        verbose_name="Ordre d'affichage"
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name="Actif"
    )

    class Meta:
        verbose_name = "Spécialité"
        verbose_name_plural = "Spécialités"
        ordering = ['order', 'code']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.code.lower())
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.code} - {self.name}"


class Module(TimeStampedModel):
    """
    Modèle représentant un module / matière d'une spécialité
    avec son semestre associé (S1, S2, etc.).
    """
    class SemesterChoices(models.TextChoices):
        S1 = 'S1', 'Semestre 1'
        S2 = 'S2', 'Semestre 2'
        S3 = 'S3', 'Semestre 3'
        S4 = 'S4', 'Semestre 4'

    specialty = models.ForeignKey(
        Specialty,
        on_delete=models.CASCADE,
        related_name="modules",
        verbose_name="Spécialité associée"
    )
    code = models.CharField(
        max_length=30,
        verbose_name="Code du module"
    )
    title = models.CharField(
        max_length=200,
        verbose_name="Intitulé du module"
    )
    semester = models.CharField(
        max_length=2,
        choices=SemesterChoices.choices,
        default=SemesterChoices.S1,
        verbose_name="Semestre"
    )
    coefficient = models.PositiveSmallIntegerField(
        default=3,
        verbose_name="Coefficient"
    )
    description = models.TextField(
        blank=True,
        verbose_name="Description / Objectifs"
    )

    class Meta:
        verbose_name = "Module"
        verbose_name_plural = "Modules"
        ordering = ['semester', 'code']
        unique_together = ('specialty', 'code')

    def __str__(self):
        return f"[{self.specialty.code} - {self.semester}] {self.code}: {self.title}"
