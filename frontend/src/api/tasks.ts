import api from './axios'
import type { PaginatedResponse, Task, TaskPayload } from '@/types'

export interface TaskParams {
  page?: number
  project?: number
  status?: string
  search?: string
  ordering?: string
}

export const tasksApi = {
  list: (params?: TaskParams) =>
    api.get<PaginatedResponse<Task>>('/tasks/', { params }).then((r) => r.data),

  get: (id: number) =>
    api.get<Task>(`/tasks/${id}/`).then((r) => r.data),

  create: (data: TaskPayload) =>
    api.post<Task>('/tasks/', data).then((r) => r.data),

  update: (id: number, data: Partial<TaskPayload>) =>
    api.patch<Task>(`/tasks/${id}/`, data).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/tasks/${id}/`).then((r) => r.data),
}
