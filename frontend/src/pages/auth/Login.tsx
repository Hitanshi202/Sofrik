import {
  Box, Card, CardContent, TextField, Button,
  Typography, Link as MuiLink, Alert, InputAdornment, IconButton,
} from '@mui/material'
import { Visibility, VisibilityOff, FolderSpecial } from '@mui/icons-material'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'
import { extractApiError } from '@/utils/errorHandler'

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
})

type FormData = yup.InferType<typeof schema>

export default function Login() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setApiError('')
    try {
      const res = await authApi.login(data)
      setAuth(res.user, { access: res.access, refresh: res.refresh })
      navigate('/dashboard')
    } catch (e) {
      setApiError(extractApiError(e))
    }
  }

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      bgcolor: 'background.default', p: 2,
    }}>
      <Box sx={{ width: '100%', maxWidth: 420 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <FolderSpecial sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h4" fontWeight={700} color="primary.main">ProjectHub</Typography>
          <Typography color="text.secondary" mt={0.5}>Sign in to your account</Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: 4 }}>
            {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Email address"
                type="email"
                fullWidth
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                autoComplete="email"
                autoFocus
              />
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((p) => !p)} edge="end" size="small">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isSubmitting}
                sx={{ mt: 1 }}
              >
                {isSubmitting ? 'Signing in…' : 'Sign In'}
              </Button>
            </Box>

            <Typography align="center" mt={3} variant="body2">
              Don't have an account?{' '}
              <MuiLink component={Link} to="/register" fontWeight={600}>
                Create one
              </MuiLink>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
