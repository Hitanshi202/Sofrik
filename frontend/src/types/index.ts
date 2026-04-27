// ── Auth ─────────────────────────────────────────────
export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  full_name: string
  created_at: string
}

export interface AuthTokens {
  access: string
  refresh: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  first_name: string
  last_name: string
  password: string
  password_confirm: string
}

export interface AuthResponse extends AuthTokens {
  user: User
}

// ── Projects ──────────────────────────────────────────
export type ProjectStatus = 'active' | 'completed'

export interface Project {
  id: number
  title: string
  description: string
  status: ProjectStatus
  owner: string
  task_count: number
  completed_task_count: number
  created_at: string
  updated_at: string
}

export interface ProjectPayload {
  title: string
  description: string
  status: ProjectStatus
}

// ── Tasks ─────────────────────────────────────────────
export type TaskStatus = 'todo' | 'in-progress' | 'done'

export interface Task {
  id: number
  project: number
  project_title: string
  title: string
  description: string
  status: TaskStatus
  due_date: string | null
  assigned_to: number | null
  assigned_to_email: string | null
  created_at: string
  updated_at: string
}

export interface TaskPayload {
  project: number
  title: string
  description: string
  status: TaskStatus
  due_date: string | null
}

// ── Pagination ────────────────────────────────────────
export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// ── API Error ─────────────────────────────────────────
export interface ApiError {
  [key: string]: string | string[]
}
