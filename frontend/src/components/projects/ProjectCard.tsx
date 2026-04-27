import {
  Card, CardContent, CardActions, Typography, Box,
  IconButton, Tooltip, LinearProgress, Chip,
} from '@mui/material'
import { Edit, Delete, ArrowForward, CheckCircle, RadioButtonUnchecked } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import type { Project } from '@/types'
import StatusChip from '@/components/ui/StatusChip'
import { formatRelative } from '@/utils/formatDate'

interface Props {
  project: Project
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
}

export default function ProjectCard({ project, onEdit, onDelete }: Props) {
  const navigate = useNavigate()
  const progress = project.task_count > 0
    ? Math.round((project.completed_task_count / project.task_count) * 100)
    : 0

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', '&:hover': { boxShadow: 4 }, transition: 'box-shadow 0.2s' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <StatusChip status={project.status} />
          <Typography variant="caption" color="text.secondary">{formatRelative(project.created_at)}</Typography>
        </Box>

        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mt: 1, lineHeight: 1.3 }}>
          {project.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 2,
        }}>
          {project.description || 'No description provided.'}
        </Typography>

        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CheckCircle sx={{ fontSize: 14, color: 'success.main' }} />
              <Typography variant="caption">{project.completed_task_count}/{project.task_count} tasks</Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">{progress}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3 }} />
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => onEdit(project)}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => onDelete(project)} sx={{ color: 'error.main' }}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Tooltip title="View tasks">
          <IconButton size="small" color="primary" onClick={() => navigate(`/projects/${project.id}`)}>
            <ArrowForward fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  )
}
