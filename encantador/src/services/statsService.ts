import { apiRequest } from './api';

export interface ProductByCategory {
  category: string;
  total: number;
}

export interface OrderByStatus {
  status: string;
  total: number;
}

export interface DashboardSummary {
  activeProducts: number;
  inactiveProducts: number;
  totalOrders: number;
  totalSales: number;
}

export function getProductsByCategory() {
  return apiRequest<ProductByCategory[]>('/stats/products-by-category');
}

export function getOrdersByStatus() {
  return apiRequest<OrderByStatus[]>('/stats/orders-by-status');
}

export function getDashboardSummary() {
  return apiRequest<DashboardSummary>('/stats/dashboard-summary');
}