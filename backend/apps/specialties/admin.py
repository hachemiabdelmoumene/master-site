from django.contrib import admin
from .models import Specialty, Module


class ModuleInline(admin.TabularInline):
    model = Module
    extra = 1
    fields = ('code', 'title', 'semester', 'coefficient')


@admin.register(Specialty)
class SpecialtyAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'slug', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    prepopulated_fields = {'slug': ('code',)}
    inlines = [ModuleInline]


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ('code', 'title', 'specialty', 'semester', 'coefficient')
    list_filter = ('specialty', 'semester')
    search_fields = ('code', 'title')
