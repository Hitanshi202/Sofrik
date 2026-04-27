from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Task
from .serializers import TaskSerializer
from .filters import TaskFilter


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = TaskFilter
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at', 'due_date', 'status', 'title']
    ordering = ['due_date', '-created_at']

    def get_queryset(self):
        return Task.objects.filter(
            project__owner=self.request.user
        ).select_related('project', 'assigned_to')

    def perform_create(self, serializer):
        project = serializer.validated_data.get('project')
        if project.owner != self.request.user:
            raise PermissionDenied('You do not own this project.')
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'detail': 'Task deleted successfully.'}, status=status.HTTP_200_OK)
