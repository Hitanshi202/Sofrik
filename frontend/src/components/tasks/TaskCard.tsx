import {
  Card, CardContent, Box, Typography, IconButton, Tooltip, Chip,
} from '@mui/material'
import { Edit, Delete, CalendarToday, Warning } from '@mui/icons-material'
import type { Task } from '@/types'
import StatusChip from '@/components/ui/StatusChip'
import { formatDate, isOverdue } from '@/utils/formatDate'

interface Props {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

export default function TaskCard({ task, onEdit, onDelete }: Props) {
  const overdue = task.status !== 'done' && isOverdue(task.due_date)

  return (
    <Card sx={{
      '&:hover': { boxShadow: 3 }, transition: 'box-shadow 0.2s',
      borderLeft: 4,
      borderColor: task.status === 'done' ? 'success.main' : task.status === 'in-progress' ? 'warning.main' : 'grey.300',
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography
                variant="subtitle2"
                fontWeight={600}
                sx={{ textDecoration: task.status === 'done' ? 'line-through' : 'none', color: task.status === 'done' ? 'text.secondary' : 'inherit' }}
              >
                {task.title}
              </Typography>
              <StatusChip status={task.status} />
            </Box>

            {task.description && (
              <Typography variant="body2" color="text.secondary" sx={{
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 1,
              }}>
                {task.description}
              </Typography>
            )}

            {task.due_date && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {overdue ? (
                  <Warning sx={{ fontSize: 14, color: 'error.main' }} />
                ) : (
                  <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
                )}
                <Typography variant="caption" color={overdue ? 'error' : 'text.secondary'}>
                  {overdue ? 'Overdue · ' : ''}{formatDate(task.due_date)}
                </Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', ml: 1 }}>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => onEdit(task)}>
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" onClick={() => onDelete(task)} sx={{ color: 'error.main' }}>
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
