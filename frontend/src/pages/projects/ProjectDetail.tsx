import {
  Box, Container, Typography, Button, Grid, Chip,
  Alert, Skeleton, TextField, InputAdornment,
  FormControl, InputLabel, Select, MenuItem,
  Paper, Divider, Breadcrumbs, Link as MuiLink,
} from '@mui/material'
import { Add, Search, ArrowBack, Edit, AssignmentTurnedIn } from '@mui/icons-material'
import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useProjects } from '@/hooks/useProjects'
import { useTasks } from '@/hooks/useTasks'
import TaskCard from '@/components/tasks/TaskCard'
import TaskFormDialog from '@/components/tasks/TaskFormDialog'
import ProjectFormDialog from '@/components/projects/ProjectFormDialog'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import StatusChip from '@/components/ui/StatusChip'
import EmptyState from '@/components/ui/EmptyState'
import PageLoader from '@/components/ui/PageLoader'
import type { Task, TaskPayload, ProjectPayload } from '@/types'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const projectId = Number(id)

  const { currentProject, loading: pLoading, fetchProject, updateProject } = useProjects()
  const { tasks, loading: tLoading, fetchTasks, createTask, updateTask, deleteTask } = useTasks()

  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [taskFormOpen, setTaskFormOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)
  const [deleteTask_, setDeleteTask] = useState<Task | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [projectEditOpen, setProjectEditOpen] = useState(false)

  useEffect(() => { fetchProject(projectId) }, [projectId])

  const loadTasks = useCallback(() => {
    fetchTasks({ project: projectId, status: statusFilter || undefined, search: search || undefined })
  }, [fetchTasks, projectId, statusFilter, search])

  useEffect(() => { loadTasks() }, [loadTasks])

  const handleCreateTask = async (data: TaskPayload) => {
    await createTask(data)
    loadTasks()
    fetchProject(projectId)
  }

  const handleUpdateTask = async (data: TaskPayload) => {
    if (!editTask) return
    await updateTask(editTask.id, data)
  }

  const handleDeleteTask = async () => {
    if (!deleteTask_) return
    setDeleting(true)
    try {
      await deleteTask(deleteTask_.id)
      setDeleteTask(null)
      fetchProject(projectId)
    } finally {
      setDeleting(false)
    }
  }

  const handleUpdateProject = async (data: ProjectPayload) => {
    await updateProject(projectId, data)
  }

  const todoTasks = tasks.filter((t) => t.status === 'todo')
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress')
  const doneTasks = tasks.filter((t) => t.status === 'done')

  const renderColumn = (title: string, items: Task[], color: string) => (
    <Grid item xs={12} md={4}>
      <Paper sx={{ p: 2, bgcolor: 'grey.50', height: '100%', minHeight: 200 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>{title}</Typography>
          <Chip label={items.length} size="small" sx={{ bgcolor: color, color: 'white', minWidth: 24 }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {items.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={(t) => { setEditTask(t); setTaskFormOpen(true) }}
              onDelete={(t) => setDeleteTask(t)}
            />
          ))}
        </Box>
      </Paper>
    </Grid>
  )

  if (pLoading && !currentProject) return <PageLoader />

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumb */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <MuiLink component={Link} to="/dashboard" underline="hover" color="inherit">
          Projects
        </MuiLink>
        <Typography color="text.primary">{currentProject?.title ?? 'Project'}</Typography>
      </Breadcrumbs>

      {/* Project Header */}
      {currentProject && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                <Typography variant="h4">{currentProject.title}</Typography>
                <StatusChip status={currentProject.status} size="medium" />
              </Box>
              <Typography color="text.secondary">{currentProject.description || 'No description.'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button startIcon={<Edit />} variant="outlined" onClick={() => setProjectEditOpen(true)}>
                Edit Project
              </Button>
              <Button startIcon={<Add />} variant="contained" onClick={() => { setEditTask(null); setTaskFormOpen(true) }}>
                Add Task
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Chip icon={<AssignmentTurnedIn />} label={`${currentProject.completed_task_count}/${currentProject.task_count} done`} variant="outlined" size="small" />
          </Box>
        </Box>
      )}

      <Divider sx={{ mb: 3 }} />

      {/* Task Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search tasks…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flexGrow: 1, maxWidth: 300 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="todo">To Do</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Kanban Board */}
      {tLoading ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((i) => <Grid item xs={12} md={4} key={i}><Skeleton height={300} sx={{ borderRadius: 2 }} /></Grid>)}
        </Grid>
      ) : tasks.length === 0 && (search || statusFilter) ? (
        <EmptyState icon={<AssignmentTurnedIn />} title="No tasks found" description="Try adjusting your filters." />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={<AssignmentTurnedIn />}
          title="No tasks yet"
          description="Add the first task to this project."
          actionLabel="Add Task"
          onAction={() => setTaskFormOpen(true)}
        />
      ) : (
        <Grid container spacing={3}>
          {renderColumn('To Do', todoTasks, '#94a3b8')}
          {renderColumn('In Progress', inProgressTasks, '#f59e0b')}
          {renderColumn('Done', doneTasks, '#22c55e')}
        </Grid>
      )}

      {/* Dialogs */}
      <TaskFormDialog
        open={taskFormOpen}
        projectId={projectId}
        task={editTask}
        onClose={() => { setTaskFormOpen(false); setEditTask(null) }}
        onSubmit={editTask ? handleUpdateTask : handleCreateTask}
      />

      <ProjectFormDialog
        open={projectEditOpen}
        project={currentProject}
        onClose={() => setProjectEditOpen(false)}
        onSubmit={handleUpdateProject}
      />

      <ConfirmDialog
        open={!!deleteTask_}
        title="Delete Task"
        message={`Delete "${deleteTask_?.title}"?`}
        onConfirm={handleDeleteTask}
        onCancel={() => setDeleteTask(null)}
        loading={deleting}
      />
    </Container>
  )
}
