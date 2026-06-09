import { apiRequest, removeToken, saveToken } from './api';

export interface BackendUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'cliente';
  passwordStrength: 'debil' | 'intermedia' | 'fuerte';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LoginResponse {
  accessToken: string;
  user: BackendUser;
}

interface RegisterResponse {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'cliente';
  passwordStrength: 'debil' | 'intermedia' | 'fuerte';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function loginRequest(email: string, password: string) {
  const response = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  });

  saveToken(response.accessToken);
  localStorage.setItem('kpop-user', JSON.stringify(response.user));

  return response;
}

export async function registerRequest(
  name: string,
  email: string,
  password: string,
) {
  return apiRequest<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
}

export async function profileRequest() {
  return apiRequest<BackendUser>('/auth/profile');
}

export async function logoutRequest() {
  await apiRequest<{ message: string }>('/auth/logout', {
    method: 'POST',
  });

  removeToken();
  localStorage.removeItem('kpop-user');
}