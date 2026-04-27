import { create } from 'zustand'
import type { Task } from '@/types'

interface TaskState {
  tasks: Task[]
  totalCount: number
  loading: boolean
  error: string | null
  setTasks: (tasks: Task[], count: number) => void
  addTask: (task: Task) => void
  updateTask: (task: Task) => void
  removeTask: (id: number) => void
  setLoading: (v: boolean) => void
  setError: (v: string | null) => void
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  totalCount: 0,
  loading: false,
  error: null,

  setTasks: (tasks, count) => set({ tasks, totalCount: count }),
  addTask: (task) =>
    set((s) => ({ tasks: [task, ...s.tasks], totalCount: s.totalCount + 1 })),
  updateTask: (task) =>
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === task.id ? task : t)) })),
  removeTask: (id) =>
    set((s) => ({
      tasks: s.tasks.filter((t) => t.id !== id),
      totalCount: Math.max(0, s.totalCount - 1),
    })),
  setLoading: (v) => set({ loading: v }),
  setError: (v) => set({ error: v }),
}))
