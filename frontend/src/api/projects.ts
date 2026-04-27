import api from './axios'
import type { PaginatedResponse, Project, ProjectPayload } from '@/types'

export interface ProjectParams {
  page?: number
  search?: string
  status?: string
  ordering?: string
}

export const projectsApi = {
  list: (params?: ProjectParams) =>
    api.get<PaginatedResponse<Project>>('/projects/', { params }).then((r) => r.data),

  get: (id: number) =>
    api.get<Project>(`/projects/${id}/`).then((r) => r.data),

  create: (data: ProjectPayload) =>
    api.post<Project>('/projects/', data).then((r) => r.data),

  update: (id: number, data: Partial<ProjectPayload>) =>
    api.patch<Project>(`/projects/${id}/`, data).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/projects/${id}/`).then((r) => r.data),
}
