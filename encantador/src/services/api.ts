const API_URL = 'http://localhost:3000';

export function getToken() {
  return localStorage.getItem('kpop-token');
}

export function saveToken(token: string) {
  localStorage.setItem('kpop-token', token);
}

export function removeToken() {
  localStorage.removeItem('kpop-token');
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Error en la petición al servidor');
  }

  return response.json();
}

export async function downloadFile(endpoint: string, filename: string) {
  const token = getToken();

  const headers = new Headers();

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error('No se pudo descargar el archivo');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();

  window.URL.revokeObjectURL(url);
}