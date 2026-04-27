from rest_framework import serializers
from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.email')
    task_count = serializers.ReadOnlyField()
    completed_task_count = serializers.ReadOnlyField()

    class Meta:
        model = Project
        fields = (
            'id', 'title', 'description', 'status',
            'owner', 'task_count', 'completed_task_count',
            'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'owner', 'created_at', 'updated_at')

    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError('Title cannot be blank.')
        return value.strip()

    def validate_status(self, value):
        valid = [Project.STATUS_ACTIVE, Project.STATUS_COMPLETED]
        if value not in valid:
            raise serializers.ValidationError(f'Status must be one of: {", ".join(valid)}')
        return value
