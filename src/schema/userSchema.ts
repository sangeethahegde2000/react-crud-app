import type { User } from '../types/user';

export type FieldDef = {
  name: keyof User;
  label: string;
  type: 'text' | 'email' | 'tel';
  required?: boolean;
};

export const userFields: FieldDef[] = [
  { name: 'firstName', label: 'First Name', type: 'text', required: true },
  { name: 'lastName', label: 'Last Name', type: 'text', required: true },
  { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
  { name: 'email', label: 'Email Address', type: 'email', required: true },
];

export function validateUser(user: Partial<User>): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  if (!user.firstName || user.firstName.trim() === '') errors.firstName = 'First name is required';
  if (!user.lastName || user.lastName.trim() === '') errors.lastName = 'Last name is required';
  if (!user.phone || !/^\+?[0-9\-\s()]{6,20}$/.test(user.phone)) errors.phone = 'Enter a valid phone number';
  if (!user.email || !/^\S+@\S+\.\S+$/.test(user.email)) errors.email = 'Enter a valid email';
  return { valid: Object.keys(errors).length === 0, errors };
}
