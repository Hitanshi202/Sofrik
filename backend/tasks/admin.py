from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'status', 'due_date', 'assigned_to', 'created_at')
    list_filter = ('status',)
    search_fields = ('title', 'description', 'project__title')
    ordering = ('due_date', '-created_at')
