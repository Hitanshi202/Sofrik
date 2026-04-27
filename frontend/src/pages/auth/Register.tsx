import {
  Box, Card, CardContent, TextField, Button,
  Typography, Link as MuiLink, Alert, Grid, InputAdornment, IconButton,
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
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Minimum 8 characters')
    .matches(/[A-Z]/, 'Must contain an uppercase letter')
    .matches(/[0-9]/, 'Must contain a number')
    .required('Password is required'),
  password_confirm: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
})

type FormData = yup.InferType<typeof schema>

export default function Register() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [showPwd, setShowPwd] = useState(false)
  const [apiError, setApiError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setApiError('')
    try {
      const res = await authApi.register(data)
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
      <Box sx={{ width: '100%', maxWidth: 480 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <FolderSpecial sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h4" fontWeight={700} color="primary.main">ProjectHub</Typography>
          <Typography color="text.secondary" mt={0.5}>Create your free account</Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: 4 }}>
            {apiError && <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="First name"
                    fullWidth
                    {...register('first_name')}
                    error={!!errors.first_name}
                    helperText={errors.first_name?.message}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Last name"
                    fullWidth
                    {...register('last_name')}
                    error={!!errors.last_name}
                    helperText={errors.last_name?.message}
                  />
                </Grid>
              </Grid>

              <TextField
                label="Email address"
                type="email"
                fullWidth
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                autoComplete="email"
              />

              <TextField
                label="Password"
                type={showPwd ? 'text' : 'password'}
                fullWidth
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPwd((p) => !p)} edge="end" size="small">
                        {showPwd ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Confirm password"
                type={showPwd ? 'text' : 'password'}
                fullWidth
                {...register('password_confirm')}
                error={!!errors.password_confirm}
                helperText={errors.password_confirm?.message}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isSubmitting}
                sx={{ mt: 1 }}
              >
                {isSubmitting ? 'Creating account…' : 'Create Account'}
              </Button>
            </Box>

            <Typography align="center" mt={3} variant="body2">
              Already have an account?{' '}
              <MuiLink component={Link} to="/login" fontWeight={600}>
                Sign in
              </MuiLink>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
