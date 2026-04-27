import { Box, Typography, Button } from '@mui/material'
import type { ReactNode } from 'react'

interface Props {
  icon: ReactNode
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({ icon, title, description, actionLabel, onAction }: Props) {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Box sx={{ mb: 2, color: 'text.disabled', '& svg': { fontSize: 64 } }}>{icon}</Box>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>{description}</Typography>
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction}>{actionLabel}</Button>
      )}
    </Box>
  )
}
