import { Chip } from '@mui/material'
import type { ProjectStatus, TaskStatus } from '@/types'

type Status = ProjectStatus | TaskStatus

const config: Record<Status, { label: string; color: 'success' | 'warning' | 'info' | 'default' | 'error' }> = {
  active: { label: 'Active', color: 'info' },
  completed: { label: 'Completed', color: 'success' },
  todo: { label: 'To Do', color: 'default' },
  'in-progress': { label: 'In Progress', color: 'warning' },
  done: { label: 'Done', color: 'success' },
}

interface Props {
  status: Status
  size?: 'small' | 'medium'
}

export default function StatusChip({ status, size = 'small' }: Props) {
  const { label, color } = config[status] ?? { label: status, color: 'default' }
  return <Chip label={label} color={color} size={size} />
}
