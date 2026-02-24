import { useState } from 'react'
import type { User } from './types/user'
import './App.css'
import UserForm from './components/UserForm'
import UserList from './components/UserList'
import { Container, Box, Typography } from '@mui/material'

export default function App() {
  const [refresh, setRefresh] = useState(0)
  const [editing, setEditing] = useState<User | null>(null)

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4" component="h1" sx={{ color: 'primary.main' }}>
          User Management
        </Typography>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={{ xs: '1fr', md: '340px 1fr' }}
        gap={3}
      >
        <Box>
          <UserForm
            initialUser={editing ?? undefined}
            onSaved={() => {
              setRefresh((r) => r + 1)
              setEditing(null)
            }}
            onCancel={() => setEditing(null)}
          />
        </Box>

        <Box>
          <UserList
            refreshTrigger={refresh}
            onDeleted={() => setRefresh((r) => r + 1)}
            onEdit={(u) => setEditing(u)}
          />
        </Box>
      </Box>
    </Container>
  )
}
