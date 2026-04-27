import api from './axios'
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '@/types'

export const authApi = {
  login: (data: LoginPayload) =>
    api.post<AuthResponse>('/auth/login/', data).then((r) => r.data),

  register: (data: RegisterPayload) =>
    api.post<AuthResponse>('/auth/register/', data).then((r) => r.data),

  logout: (refresh: string) =>
    api.post('/auth/logout/', { refresh }).then((r) => r.data),

  getProfile: () =>
    api.get<User>('/auth/profile/').then((r) => r.data),

  updateProfile: (data: Partial<Pick<User, 'first_name' | 'last_name'>>) =>
    api.patch<User>('/auth/profile/', data).then((r) => r.data),
}
