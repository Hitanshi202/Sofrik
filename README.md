# ProjectHub — Project Management Tool

A full-stack project management application with JWT authentication, project tracking, and kanban-style task management.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Python 3.11, Django 4.2, Django REST Framework |
| Auth | JWT (SimpleJWT) + BCrypt password hashing |
| Database | PostgreSQL 15 (SQLite fallback for local dev) |
| Frontend | React 18, TypeScript, Vite |
| UI | Material UI (MUI) v5 |
| Forms | React Hook Form + Yup validation |
| State | Zustand (with persistence) |
| API Client | Axios (with JWT auto-refresh interceptor) |
| Container | Docker + Docker Compose |

---

## Project Structure

```
asn/
├── backend/
│   ├── core/                  # Django settings, urls, wsgi
│   ├── users/                 # Custom user model, JWT auth
│   │   └── management/
│   │       └── commands/
│   │           └── seed.py    # Database seeder
│   ├── projects/              # Projects CRUD
│   ├── tasks/                 # Tasks CRUD
│   ├── requirements.txt
│   ├── Dockerfile
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── api/               # Axios instance + API calls
│   │   ├── components/        # Reusable UI + layout components
│   │   ├── hooks/             # Custom hooks (useProjects, useTasks)
│   │   ├── pages/             # Route pages
│   │   ├── store/             # Zustand stores
│   │   ├── types/             # TypeScript interfaces
│   │   └── utils/             # Helpers (date, error handler)
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## Quick Start (Docker — Recommended)

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd asn
```

### 2. Start all services
```bash
docker compose up --build
```

This single command will:
1. Start a PostgreSQL database
2. Build and start the Django backend (runs migrations + seed automatically)
3. Build and start the React frontend

### 3. Open the app
| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000/api/ |
| API Docs (Swagger) | http://localhost:8000/api/docs/ |
| Django Admin | http://localhost:8000/admin/ |

---

## Manual Setup (Without Docker)

### Backend

#### Prerequisites
- Python 3.11+
- PostgreSQL (or use SQLite by setting `DB_ENGINE=sqlite` in `.env`)

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Linux/macOS
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
python manage.py migrate

# Run the server
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Running the Seeder

The seeder creates demo users, projects, and tasks.

```bash
# With Docker (runs automatically on startup, but can re-run):
docker compose exec backend python manage.py seed

# Flush all data and re-seed:
docker compose exec backend python manage.py seed --flush

# Without Docker:
cd backend
python manage.py seed
```

### Demo Accounts (created by seeder)

| Email | Password | Role |
|-------|----------|------|
| alice@example.com | Password@123 | Regular user |
| bob@example.com | Password@123 | Regular user |
| admin@example.com | Admin@123 | Superuser |

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | Login (returns JWT tokens) |
| POST | `/api/auth/logout/` | Logout (blacklists refresh token) |
| POST | `/api/auth/token/refresh/` | Refresh access token |
| GET/PATCH | `/api/auth/profile/` | Get or update profile |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects/` | List user's projects (paginated, filterable) |
| POST | `/api/projects/` | Create project |
| GET | `/api/projects/{id}/` | Get project details |
| PATCH | `/api/projects/{id}/` | Update project |
| DELETE | `/api/projects/{id}/` | Delete project |

**Query params:** `?search=`, `?status=active|completed`, `?page=`, `?ordering=`

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks/` | List tasks (filterable by project/status) |
| POST | `/api/tasks/` | Create task |
| GET | `/api/tasks/{id}/` | Get task |
| PATCH | `/api/tasks/{id}/` | Update task |
| DELETE | `/api/tasks/{id}/` | Delete task |

**Query params:** `?project=`, `?status=todo|in-progress|done`, `?search=`, `?due_before=`, `?due_after=`

---

## Features

### Authentication
- [x] Register / Login with email & password
- [x] JWT access + refresh tokens
- [x] BCrypt password hashing
- [x] Refresh token blacklisting on logout
- [x] Auto token refresh on 401 (frontend interceptor)

### Projects
- [x] Create, Read, Update, Delete projects
- [x] Project fields: title, description, status (active/completed)
- [x] Pagination (10 per page)
- [x] Search by title/description
- [x] Filter by status
- [x] Task progress indicator (X/Y tasks completed)

### Tasks
- [x] Full CRUD operations
- [x] Task fields: title, description, status, due date
- [x] Filter by status (todo / in-progress / done)
- [x] Search tasks
- [x] Overdue task highlighting
- [x] Kanban-style columns on project detail page

### Frontend
- [x] Login & Register pages with form validation
- [x] Dashboard with project grid
- [x] Project detail page with kanban board
- [x] Add/Edit forms via dialogs (React Hook Form + Yup)
- [x] Zustand global state management
- [x] Persistent auth state (localStorage)
- [x] Protected routes
- [x] Responsive layout with MUI

### Developer Experience
- [x] Swagger/OpenAPI docs at `/api/docs/`
- [x] Django admin interface
- [x] Database seeder with demo data
- [x] Docker + Docker Compose setup

---

## Known Limitations

- No email verification on registration
- No password reset / forgot password flow
- Task assignment is available in the backend model but not exposed in the UI
- No real-time updates (would require WebSockets)
- No file attachments on tasks
- Unit tests not included in this submission (bonus item)

---

## Environment Variables

### Backend (`.env`)
```
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_ENGINE=postgresql         # or 'sqlite'
DB_NAME=projectdb
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432

CORS_ALLOWED_ORIGINS=http://localhost:5173
```
