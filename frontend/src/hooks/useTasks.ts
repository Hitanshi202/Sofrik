import { useCallback } from 'react'
import { tasksApi, type TaskParams } from '@/api/tasks'
import { useTaskStore } from '@/store/taskStore'
import { extractApiError } from '@/utils/errorHandler'
import type { TaskPayload } from '@/types'

export function useTasks() {
  const store = useTaskStore()

  const fetchTasks = useCallback(async (params?: TaskParams) => {
    store.setLoading(true)
    store.setError(null)
    try {
      const data = await tasksApi.list(params)
      store.setTasks(data.results, data.count)
    } catch (e) {
      store.setError(extractApiError(e))
    } finally {
      store.setLoading(false)
    }
  }, [store])

  const createTask = useCallback(async (data: TaskPayload) => {
    const task = await tasksApi.create(data)
    store.addTask(task)
    return task
  }, [store])

  const updateTask = useCallback(async (id: number, data: Partial<TaskPayload>) => {
    const task = await tasksApi.update(id, data)
    store.updateTask(task)
    return task
  }, [store])

  const deleteTask = useCallback(async (id: number) => {
    await tasksApi.delete(id)
    store.removeTask(id)
  }, [store])

  return {
    ...store,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  }
}
