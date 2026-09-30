from django.contrib import admin
from .models import DelegateProfile


@admin.register(DelegateProfile)
class DelegateProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'specialty', 'is_active_delegate', 'created_at')
    list_filter = ('is_active_delegate', 'specialty')
    search_fields = ('user__username', 'user__email')
