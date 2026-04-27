import {
  Box, Container, Typography, Button, Grid, TextField,
  InputAdornment, MenuItem, Select, FormControl, InputLabel,
  Pagination, Alert, Skeleton,
} from '@mui/material'
import { Add, Search, FolderOff } from '@mui/icons-material'
import { useEffect, useState, useCallback } from 'react'
import { useProjects } from '@/hooks/useProjects'
import ProjectCard from '@/components/projects/ProjectCard'
import ProjectFormDialog from '@/components/projects/ProjectFormDialog'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import EmptyState from '@/components/ui/EmptyState'
import type { Project, ProjectPayload } from '@/types'

const PAGE_SIZE = 6

export default function Dashboard() {
  const { projects, totalCount, loading, error, fetchProjects, createProject, updateProject, deleteProject } = useProjects()

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(() => {
    fetchProjects({ page, search: search || undefined, status: statusFilter || undefined })
  }, [fetchProjects, page, search, statusFilter])

  useEffect(() => { load() }, [load])

  const handleSearchChange = (val: string) => {
    setSearch(val)
    setPage(1)
  }

  const handleCreate = async (data: ProjectPayload) => {
    await createProject(data)
    load()
  }

  const handleUpdate = async (data: ProjectPayload) => {
    if (!editProject) return
    await updateProject(editProject.id, data)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteProject(deleteTarget.id)
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4">My Projects</Typography>
          <Typography color="text.secondary" mt={0.5}>{totalCount} project{totalCount !== 1 ? 's' : ''}</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => { setEditProject(null); setFormOpen(true) }}
        >
          New Project
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search projects…"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          sx={{ flexGrow: 1, maxWidth: 360 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Error */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Grid */}
      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={<FolderOff />}
          title="No projects yet"
          description={search || statusFilter ? 'No projects match your filters.' : 'Create your first project to get started.'}
          actionLabel={!search && !statusFilter ? 'Create Project' : undefined}
          onAction={!search && !statusFilter ? () => setFormOpen(true) : undefined}
        />
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <ProjectCard
                project={project}
                onEdit={(p) => { setEditProject(p); setFormOpen(true) }}
                onDelete={(p) => setDeleteTarget(p)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" />
        </Box>
      )}

      {/* Dialogs */}
      <ProjectFormDialog
        open={formOpen}
        project={editProject}
        onClose={() => { setFormOpen(false); setEditProject(null) }}
        onSubmit={editProject ? handleUpdate : handleCreate}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? All associated tasks will also be deleted.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </Container>
  )
}
