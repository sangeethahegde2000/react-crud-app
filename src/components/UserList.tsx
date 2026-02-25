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
  TablePagination,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Typography,
  Avatar,
  Chip,
  Box,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function initials(u: User) {
  const a = (u.firstName || '').trim().charAt(0) || '';
  const b = (u.lastName || '').trim().charAt(0) || '';
  return (a + b).toUpperCase();
}

export default function UserList({ refreshTrigger = 0, onDeleted, onEdit, onAdd }: { refreshTrigger?: number; onDeleted?: () => void; onEdit?: (u: User) => void; onAdd?: () => void }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');

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

  const filteredUsers = (() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const name = `${u.firstName ?? ''} ${u.lastName ?? ''}`.toLowerCase();
      const id = String(u.id ?? '').toLowerCase();
      return (
        name.includes(q) || (u.email ?? '').toLowerCase().includes(q) || (u.phone ?? '').toLowerCase().includes(q) || id.includes(q)
      );
    });
  })();

  if (loading)
    return (
      <Box display="flex" justifyContent="center" my={2}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Card>
      <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Typography variant="h6" sx={{ color: 'primary.main' }}>
        Users
        </Typography>
        <Button size="small" variant="contained" onClick={() => onAdd?.()} sx={{textTransform:'none'}}>
        Add User
        </Button>
      </Box>
      <TextField
        size="small"
        placeholder="Search ID, name, email or phone"
        value={search}
        onChange={(e) => {
        setSearch(e.target.value);
        setPage(0);
        }}
        InputProps={{
        startAdornment: (
          <InputAdornment position="start">
          <SearchIcon fontSize="small" />
          </InputAdornment>
        ),
        }}
        sx={{ mb: 2 }}
        fullWidth
      />
        <TableContainer component={Paper} sx={{ boxShadow: 'none', minHeight: 300, overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ background: 'linear-gradient(90deg, rgba(25,118,210,0.12), rgba(156,39,176,0.08))' }}>
          <TableCell sx={{ width: '35%', fontWeight: 700 }}>Name</TableCell>
          <TableCell sx={{ width: '20%', fontWeight: 700 }}>Phone</TableCell>
          <TableCell sx={{ width: '35%', fontWeight: 700 }}>Email</TableCell>
          <TableCell sx={{ width: '10%', fontWeight: 700 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((u) => (
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
            <Box display="flex" flexDirection="row" alignItems="center" gap={0.5}>
              <IconButton size="small" aria-label={`Edit ${u.firstName} ${u.lastName}`} onClick={() => onEdit?.(u)}>
              <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" aria-label={`Delete ${u.firstName} ${u.lastName}`} onClick={() => handleDelete(u.id)}>
              <DeleteIcon fontSize="small" color="error" />
              </IconButton>
            </Box>
            </TableCell>
          </TableRow>
          ))}
        </TableBody>
        </Table>
        <TablePagination
        rowsPerPageOptions={[10]}
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_e: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => setPage(newPage)}
        onRowsPerPageChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        />
      </TableContainer>
      </CardContent>
    </Card>
  );
}
