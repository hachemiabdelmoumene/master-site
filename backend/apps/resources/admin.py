from django.contrib import admin
from .models import Resource


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'module', 'resource_type', 'category',
        'status', 'contributor_name', 'views_count', 'created_at'
    )
    list_filter = ('status', 'resource_type', 'category', 'module__specialty')
    search_fields = ('title', 'url', 'contributor_name', 'module__code')
    list_editable = ('status',)
    actions = ['approve_resources', 'reject_resources']

    @admin.action(description="Approuver les ressources sélectionnées")
    def approve_resources(self, request, queryset):
        queryset.update(status=Resource.StatusChoices.APPROVED, validated_by=request.user)

    @admin.action(description="Rejeter les ressources sélectionnées")
    def reject_resources(self, request, queryset):
        queryset.update(status=Resource.StatusChoices.REJECTED)
