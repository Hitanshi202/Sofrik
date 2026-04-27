import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Box, Alert,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useState } from 'react'
import type { Project, ProjectPayload } from '@/types'
import { extractApiError } from '@/utils/errorHandler'

const schema = yup.object({
  title: yup.string().trim().required('Title is required'),
  description: yup.string().default(''),
  status: yup.mixed<'active' | 'completed'>().oneOf(['active', 'completed']).required(),
})

type FormData = yup.InferType<typeof schema>

interface Props {
  open: boolean
  project?: Project | null
  onClose: () => void
  onSubmit: (data: ProjectPayload) => Promise<void>
}

export default function ProjectFormDialog({ open, project, onClose, onSubmit }: Props) {
  const [apiError, setApiError] = useState('')
  const isEdit = !!project

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: project?.title ?? '',
      description: project?.description ?? '',
      status: project?.status ?? 'active',
    },
  })

  const handleClose = () => {
    reset()
    setApiError('')
    onClose()
  }

  const handleFormSubmit = async (data: FormData) => {
    setApiError('')
    try {
      await onSubmit(data as ProjectPayload)
      handleClose()
    } catch (e) {
      setApiError(extractApiError(e))
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Project' : 'New Project'}</DialogTitle>
      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {apiError && <Alert severity="error">{apiError}</Alert>}

          <TextField
            label="Title"
            fullWidth
            autoFocus
            {...register('title')}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            {...register('description')}
          />
          <TextField
            label="Status"
            select
            fullWidth
            defaultValue={project?.status ?? 'active'}
            {...register('status')}
            error={!!errors.status}
            helperText={errors.status?.message}
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Project'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}
