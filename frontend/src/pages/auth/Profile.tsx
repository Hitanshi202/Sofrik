import {
  Container, Box, Typography, Card, CardContent,
  TextField, Button, Divider, Alert, Avatar,
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/auth'
import { extractApiError } from '@/utils/errorHandler'

const profileSchema = yup.object({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
})

type ProfileData = yup.InferType<typeof profileSchema>

export default function Profile() {
  const { user, setUser } = useAuthStore()
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProfileData>({
    resolver: yupResolver(profileSchema),
    defaultValues: { first_name: user?.first_name ?? '', last_name: user?.last_name ?? '' },
  })

  const onSubmit = async (data: ProfileData) => {
    setSuccess('')
    setError('')
    try {
      const updated = await authApi.updateProfile(data)
      setUser(updated)
      setSuccess('Profile updated successfully.')
    } catch (e) {
      setError(extractApiError(e))
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Avatar sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: 28, mx: 'auto', mb: 1 }}>
          {user?.first_name?.[0]?.toUpperCase()}
        </Avatar>
        <Typography variant="h5">{user?.full_name}</Typography>
        <Typography color="text.secondary">{user?.email}</Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Edit Profile</Typography>
          <Divider sx={{ mb: 2 }} />

          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="First name"
              fullWidth
              {...register('first_name')}
              error={!!errors.first_name}
              helperText={errors.first_name?.message}
            />
            <TextField
              label="Last name"
              fullWidth
              {...register('last_name')}
              error={!!errors.last_name}
              helperText={errors.last_name?.message}
            />
            <TextField
              label="Email"
              fullWidth
              value={user?.email ?? ''}
              disabled
            />
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Save Changes'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}
