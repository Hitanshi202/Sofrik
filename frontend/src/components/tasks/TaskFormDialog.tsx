import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Box, Alert,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useState } from 'react'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import type { Task, TaskPayload } from '@/types'
import { extractApiError } from '@/utils/errorHandler'

const schema = yup.object({
  title: yup.string().trim().required('Title is required'),
  description: yup.string().default(''),
  status: yup.mixed<'todo' | 'in-progress' | 'done'>().oneOf(['todo', 'in-progress', 'done']).required(),
  due_date: yup.string().nullable().default(null),
})

type FormData = yup.InferType<typeof schema>

interface Props {
  open: boolean
  projectId: number
  task?: Task | null
  onClose: () => void
  onSubmit: (data: TaskPayload) => Promise<void>
}

export default function TaskFormDialog({ open, projectId, task, onClose, onSubmit }: Props) {
  const [apiError, setApiError] = useState('')
  const isEdit = !!task

  const { register, handleSubmit, reset, control, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: task?.title ?? '',
      description: task?.description ?? '',
      status: task?.status ?? 'todo',
      due_date: task?.due_date ?? null,
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
      await onSubmit({ ...data, project: projectId } as TaskPayload)
      handleClose()
    } catch (e) {
      setApiError(extractApiError(e))
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{isEdit ? 'Edit Task' : 'New Task'}</DialogTitle>
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
              rows={2}
              {...register('description')}
            />
            <TextField
              label="Status"
              select
              fullWidth
              defaultValue={task?.status ?? 'todo'}
              {...register('status')}
            >
              <MenuItem value="todo">To Do</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </TextField>

            <Controller
              name="due_date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Due date (optional)"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(val) => field.onChange(val ? val.format('YYYY-MM-DD') : null)}
                  slotProps={{ textField: { size: 'small', fullWidth: true } }}
                />
              )}
            />
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Task'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </LocalizationProvider>
  )
}
