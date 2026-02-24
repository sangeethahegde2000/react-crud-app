import { useEffect, useState } from 'react';
import type { User } from '../types/user';
import { getUsers, deleteUser } from '../services/api';
import {
  Card,
  CardContent,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Typography,
  Avatar,
  Chip,
  Box,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function initials(u: User) {
  const a = (u.firstName || '').trim().charAt(0) || '';
  const b = (u.lastName || '').trim().charAt(0) || '';
  return (a + b).toUpperCase();
}

export default function UserList({ refreshTrigger = 0, onDeleted, onEdit }: { refreshTrigger?: number; onDeleted?: () => void; onEdit?: (u: User) => void }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    setLoading(true);
    getUsers()
      .then((data) => setUsers(data))
      .catch((err: any) => setError(err?.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, [refreshTrigger]);

  async function handleDelete(id?: number) {
    if (!id) return;
    if (!confirm('Delete this user?')) return;
    try {
      await deleteUser(id);
      onDeleted?.();
    } catch (err: any) {
      setError(err?.message || 'Delete failed');
    }
  }

  if (loading)
    return (
      <Box display="flex" justifyContent="center" my={2}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
          Users
        </Typography>
        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: 'linear-gradient(90deg, rgba(25,118,210,0.12), rgba(156,39,176,0.08))' }}>
                <TableCell sx={{ width: '35%', fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ width: '20%', fontWeight: 700 }}>Phone</TableCell>
                <TableCell sx={{ width: '35%', fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ width: '10%', fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow
                  key={u.id}
                  hover
                  sx={{
                    '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                  }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>{initials(u)}</Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 600 }}>{u.firstName} {u.lastName}</Typography>
                        <Typography variant="caption" color="text.secondary">User ID: {u.id}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={u.phone} color="secondary" size="small" />
                  </TableCell>
                  <TableCell sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <a href={`mailto:${u.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{u.email}</a>
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" aria-label={`Edit ${u.firstName} ${u.lastName}`} onClick={() => onEdit?.(u)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" aria-label={`Delete ${u.firstName} ${u.lastName}`} onClick={() => handleDelete(u.id)}>
                      <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
