import { useState } from 'react'
import type { User } from './types/user'
import './App.css'
import UserForm from './components/UserForm'
import UserList from './components/UserList'
import { Container, Box, Typography, Dialog, DialogTitle, DialogContent } from '@mui/material'

export default function App() {
  const [refresh, setRefresh] = useState(0)
  const [editing, setEditing] = useState<User | null>(null)
  const [showForm, setShowForm] = useState(false)

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4" component="h1" sx={{ color: 'primary.main' }}>
          User Management
        </Typography>
      </Box>

      <Box>
        <UserList
          refreshTrigger={refresh}
          onDeleted={() => setRefresh((r) => r + 1)}
          onEdit={(u) => {
            setEditing(u)
            setShowForm(true)
          }}
          onAdd={() => setShowForm(true)}
        />

        <Dialog open={showForm || Boolean(editing)} onClose={() => { setEditing(null); setShowForm(false); }} maxWidth="sm" fullWidth>
          <DialogTitle>{editing ? 'Edit User' : 'Add User'}</DialogTitle>
          <DialogContent>
            <UserForm
              initialUser={editing ?? undefined}
              onSaved={() => {
                setRefresh((r) => r + 1)
                setEditing(null)
                setShowForm(false)
              }}
              onCancel={() => {
                setEditing(null)
                setShowForm(false)
              }}
            />
          </DialogContent>
        </Dialog>
      </Box>
    </Container>
  )
}
