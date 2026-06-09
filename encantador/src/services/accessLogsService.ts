import { apiRequest } from './api';

export type AccessLogUser = {
  id: number;
  name: string;
  email: string;
};

export type AccessLog = {
  id: number;
  event: string;
  ip: string;
  browser: string;
  createdAt: string;
  user: AccessLogUser | null;
};

export function getAccessLogs() {
  return apiRequest('/access-logs') as Promise<AccessLog[]>;
}