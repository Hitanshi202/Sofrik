import { create } from 'zustand'
import type { Project } from '@/types'

interface ProjectState {
  projects: Project[]
  currentProject: Project | null
  totalCount: number
  loading: boolean
  error: string | null
  setProjects: (projects: Project[], count: number) => void
  setCurrentProject: (project: Project | null) => void
  addProject: (project: Project) => void
  updateProject: (project: Project) => void
  removeProject: (id: number) => void
  setLoading: (v: boolean) => void
  setError: (v: string | null) => void
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  totalCount: 0,
  loading: false,
  error: null,

  setProjects: (projects, count) => set({ projects, totalCount: count }),
  setCurrentProject: (project) => set({ currentProject: project }),
  addProject: (project) =>
    set((s) => ({ projects: [project, ...s.projects], totalCount: s.totalCount + 1 })),
  updateProject: (project) =>
    set((s) => ({
      projects: s.projects.map((p) => (p.id === project.id ? project : p)),
      currentProject: s.currentProject?.id === project.id ? project : s.currentProject,
    })),
  removeProject: (id) =>
    set((s) => ({
      projects: s.projects.filter((p) => p.id !== id),
      totalCount: Math.max(0, s.totalCount - 1),
    })),
  setLoading: (v) => set({ loading: v }),
  setError: (v) => set({ error: v }),
}))
