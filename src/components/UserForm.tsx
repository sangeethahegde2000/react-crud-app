import { useEffect, useState } from 'react';
import type { User } from '../types/user';
import { userFields, validateUser } from '../schema/userSchema';
import { addUser, updateUser } from '../services/api';
import { Card, CardContent, TextField, Button, Stack, Typography } from '@mui/material';

export default function UserForm({ initialUser, onSaved, onCancel }: { initialUser?: User; onSaved?: () => void; onCancel?: () => void }) {
  const [user, setUser] = useState<Partial<User>>(initialUser ?? {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function handleChange(name: keyof User, value: string) {
    setUser((u) => ({ ...(u || {}), [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validateUser(user);
    setErrors(v.errors);
    if (!v.valid) return;
    setLoading(true);
    try {
      if (initialUser && initialUser.id) {
        await updateUser(initialUser.id, user as Partial<User>);
      } else {
        await addUser(user as Omit<User, 'id'>);
      }
      setUser({});
      onSaved?.();
    } catch (err: any) {
      setErrors({ _global: err?.message || 'Submit failed' });
    } finally {
      setLoading(false);
    }
  }

  // keep form in sync when switching to edit mode
  useEffect(() => {
    setUser(initialUser ?? {});
    setErrors({});
  }, [initialUser]);

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" component="div" sx={{ mb: 1 }}>
            {initialUser ? 'Edit User' : 'Add User'}
          </Typography>
          <Stack spacing={2}>
            {userFields.map((f) => (
              <TextField
                key={String(f.name)}
                label={f.label}
                type={f.type}
                value={(user[f.name] as string) || ''}
                onChange={(e) => handleChange(f.name, e.target.value)}
                required={f.required}
                error={Boolean(errors[f.name as string])}
                helperText={errors[f.name as string]}
                fullWidth
              />
            ))}

            {errors._global && (
              <Typography color="error">{errors._global}</Typography>
            )}

            <Stack direction="row" spacing={1}>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? 'Saving...' : (initialUser ? 'Save' : 'Add User')}
              </Button>
              {initialUser && (
                <Button variant="outlined" onClick={() => onCancel?.()} disabled={loading}>
                  Cancel
                </Button>
              )}
            </Stack>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
}
