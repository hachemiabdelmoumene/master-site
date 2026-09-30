from django.db import models


class TimeStampedModel(models.Model):
    """
    Modèle de base abstrait fournissant des champs horodatés
    de création et de mise à jour automatiques.
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
