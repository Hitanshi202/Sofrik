import { useCallback } from 'react'
import { projectsApi, type ProjectParams } from '@/api/projects'
import { useProjectStore } from '@/store/projectStore'
import { extractApiError } from '@/utils/errorHandler'
import type { ProjectPayload } from '@/types'

export function useProjects() {
  const store = useProjectStore()

  const fetchProjects = useCallback(async (params?: ProjectParams) => {
    store.setLoading(true)
    store.setError(null)
    try {
      const data = await projectsApi.list(params)
      store.setProjects(data.results, data.count)
    } catch (e) {
      store.setError(extractApiError(e))
    } finally {
      store.setLoading(false)
    }
  }, [store])

  const fetchProject = useCallback(async (id: number) => {
    store.setLoading(true)
    try {
      const project = await projectsApi.get(id)
      store.setCurrentProject(project)
      return project
    } catch (e) {
      store.setError(extractApiError(e))
      return null
    } finally {
      store.setLoading(false)
    }
  }, [store])

  const createProject = useCallback(async (data: ProjectPayload) => {
    const project = await projectsApi.create(data)
    store.addProject(project)
    return project
  }, [store])

  const updateProject = useCallback(async (id: number, data: Partial<ProjectPayload>) => {
    const project = await projectsApi.update(id, data)
    store.updateProject(project)
    return project
  }, [store])

  const deleteProject = useCallback(async (id: number) => {
    await projectsApi.delete(id)
    store.removeProject(id)
  }, [store])

  return {
    ...store,
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
  }
}
