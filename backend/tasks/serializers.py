from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    project_title = serializers.ReadOnlyField(source='project.title')
    assigned_to_email = serializers.ReadOnlyField(source='assigned_to.email')

    class Meta:
        model = Task
        fields = (
            'id', 'project', 'project_title', 'title', 'description',
            'status', 'due_date', 'assigned_to', 'assigned_to_email',
            'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError('Title cannot be blank.')
        return value.strip()

    def validate_status(self, value):
        valid = [Task.STATUS_TODO, Task.STATUS_IN_PROGRESS, Task.STATUS_DONE]
        if value not in valid:
            raise serializers.ValidationError(f'Status must be one of: {", ".join(valid)}')
        return value

    def validate(self, attrs):
        request = self.context.get('request')
        project = attrs.get('project') or (self.instance.project if self.instance else None)
        if project and request and project.owner != request.user:
            raise serializers.ValidationError({'project': 'You do not own this project.'})
        return attrs


class TaskListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing tasks within a project."""
    class Meta:
        model = Task
        fields = ('id', 'title', 'status', 'due_date', 'created_at')
