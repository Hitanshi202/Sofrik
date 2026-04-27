import django_filters
from .models import Task


class TaskFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(choices=Task.STATUS_CHOICES)
    project = django_filters.NumberFilter(field_name='project__id')
    due_before = django_filters.DateFilter(field_name='due_date', lookup_expr='lte')
    due_after = django_filters.DateFilter(field_name='due_date', lookup_expr='gte')

    class Meta:
        model = Task
        fields = ['status', 'project', 'due_before', 'due_after']
