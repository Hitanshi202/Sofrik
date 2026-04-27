"""
Seed command: python manage.py seed
Creates demo users, projects, and tasks for development/testing.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from projects.models import Project
from tasks.models import Task
from datetime import date, timedelta

User = get_user_model()

USERS = [
    {
        'email': 'alice@example.com',
        'password': 'Password@123',
        'first_name': 'Alice',
        'last_name': 'Johnson',
    },
    {
        'email': 'bob@example.com',
        'password': 'Password@123',
        'first_name': 'Bob',
        'last_name': 'Smith',
    },
]

PROJECTS = [
    {
        'title': 'Website Redesign',
        'description': 'Complete overhaul of the company website with modern design and improved UX.',
        'status': 'active',
    },
    {
        'title': 'Mobile App Development',
        'description': 'Build a cross-platform mobile application using React Native.',
        'status': 'active',
    },
    {
        'title': 'API Integration',
        'description': 'Integrate third-party payment and analytics APIs into existing platform.',
        'status': 'completed',
    },
    {
        'title': 'DevOps Setup',
        'description': 'Set up CI/CD pipelines, Docker containers, and cloud infrastructure.',
        'status': 'active',
    },
]

TASKS_TEMPLATE = [
    {
        'title': 'Create wireframes',
        'description': 'Design wireframes for all main screens.',
        'status': 'done',
        'days_offset': -10,
    },
    {
        'title': 'Set up development environment',
        'description': 'Install dependencies and configure local dev setup.',
        'status': 'done',
        'days_offset': -7,
    },
    {
        'title': 'Implement authentication',
        'description': 'Build login, registration, and JWT token flow.',
        'status': 'in-progress',
        'days_offset': 3,
    },
    {
        'title': 'Write unit tests',
        'description': 'Cover core business logic with unit tests (>80% coverage).',
        'status': 'todo',
        'days_offset': 7,
    },
    {
        'title': 'Deploy to staging',
        'description': 'Deploy the current build to the staging environment.',
        'status': 'todo',
        'days_offset': 14,
    },
]


class Command(BaseCommand):
    help = 'Seeds the database with demo users, projects, and tasks'

    def add_arguments(self, parser):
        parser.add_argument(
            '--flush',
            action='store_true',
            help='Delete all existing data before seeding',
        )

    def handle(self, *args, **options):
        if options['flush']:
            self.stdout.write('Flushing existing data...')
            Task.objects.all().delete()
            Project.objects.all().delete()
            User.objects.filter(is_superuser=False).delete()

        self.stdout.write('Seeding users...')
        created_users = []
        for user_data in USERS:
            user, created = User.objects.get_or_create(
                email=user_data['email'],
                defaults={
                    'first_name': user_data['first_name'],
                    'last_name': user_data['last_name'],
                },
            )
            if created:
                user.set_password(user_data['password'])
                user.save()
                self.stdout.write(self.style.SUCCESS(f'  Created user: {user.email}'))
            else:
                self.stdout.write(f'  User already exists: {user.email}')
            created_users.append(user)

        self.stdout.write('Seeding projects and tasks...')
        today = date.today()
        for i, project_data in enumerate(PROJECTS):
            owner = created_users[i % len(created_users)]
            project, created = Project.objects.get_or_create(
                title=project_data['title'],
                owner=owner,
                defaults={
                    'description': project_data['description'],
                    'status': project_data['status'],
                },
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'  Created project: {project.title}'))
            else:
                self.stdout.write(f'  Project already exists: {project.title}')

            for task_data in TASKS_TEMPLATE:
                task_title = f"{task_data['title']} ({project.title[:15]})"
                task, t_created = Task.objects.get_or_create(
                    title=task_title,
                    project=project,
                    defaults={
                        'description': task_data['description'],
                        'status': task_data['status'],
                        'due_date': today + timedelta(days=task_data['days_offset']),
                    },
                )
                if t_created:
                    self.stdout.write(f'    + Task: {task.title}')

        # Create a superuser for admin access
        if not User.objects.filter(email='admin@example.com').exists():
            admin = User.objects.create_superuser(
                email='admin@example.com',
                password='Admin@123',
                first_name='Admin',
                last_name='User',
            )
            self.stdout.write(self.style.SUCCESS(f'  Created superuser: {admin.email}'))

        self.stdout.write(self.style.SUCCESS('\nSeeding complete!'))
        self.stdout.write('Demo accounts:')
        self.stdout.write('  alice@example.com / Password@123')
        self.stdout.write('  bob@example.com   / Password@123')
        self.stdout.write('  admin@example.com / Admin@123  (superuser)')
