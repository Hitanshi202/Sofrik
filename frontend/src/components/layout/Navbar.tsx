import {
  AppBar, Toolbar, Typography, Button, Box,
  Avatar, Menu, MenuItem, IconButton, Divider,
} from '@mui/material'
import { AccountCircle, FolderSpecial, Logout, Person } from '@mui/icons-material'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { authApi } from '@/api/auth'

export default function Navbar() {
  const { user, tokens, logout } = useAuthStore()
  const navigate = useNavigate()
  const [anchor, setAnchor] = useState<null | HTMLElement>(null)

  const handleLogout = async () => {
    try {
      if (tokens?.refresh) await authApi.logout(tokens.refresh)
    } finally {
      logout()
      navigate('/login')
    }
  }

  return (
    <AppBar position="fixed" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid #e2e8f0' }}>
      <Toolbar>
        <FolderSpecial sx={{ color: 'primary.main', mr: 1 }} />
        <Typography
          variant="h6"
          component={Link}
          to="/dashboard"
          sx={{ flexGrow: 1, color: 'primary.main', textDecoration: 'none', fontWeight: 700 }}
        >
          ProjectHub
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mr: 1 }}>
          <Button component={Link} to="/dashboard" size="small" sx={{ color: 'text.secondary' }}>
            Dashboard
          </Button>
        </Box>

        <IconButton onClick={(e) => setAnchor(e.currentTarget)} size="small">
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14 }}>
            {user?.first_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
          </Avatar>
        </IconButton>

        <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2" fontWeight={600}>{user?.full_name}</Typography>
            <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => { navigate('/profile'); setAnchor(null) }}>
            <Person fontSize="small" sx={{ mr: 1 }} /> Profile
          </MenuItem>
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <Logout fontSize="small" sx={{ mr: 1 }} /> Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
