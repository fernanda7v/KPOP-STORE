import type { User } from '../types';

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Administrador',
    email: 'admin@kpopstore.com',
    password: '123456',
    role: 'admin',
  },
  {
    id: 2,
    name: 'Cliente Demo',
    email: 'cliente@kpopstore.com',
    password: '123456',
    role: 'cliente',
  },
];