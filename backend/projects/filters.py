import django_filters
from .models import Project


class ProjectFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(choices=Project.STATUS_CHOICES)
    created_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')

    class Meta:
        model = Project
        fields = ['status']
