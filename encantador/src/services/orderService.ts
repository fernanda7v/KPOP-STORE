import type { CheckoutFormData } from '../types';
import { apiRequest } from './api';

export type OrderStatus =
  | 'pendiente'
  | 'pagado'
  | 'preparando'
  | 'enviado'
  | 'entregado'
  | 'cancelado';

interface OrderCartItem {
  id: number;
  quantity: number;
}

interface BackendProduct {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  artist: string;
}

interface BackendOrderDetail {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product: BackendProduct;
}

export interface BackendOrder {
  id: number;
  userId: number;
  fullName: string;
  address: string;
  city: string;
  phone: string;
  paymentMethod: 'qr' | 'transferencia' | 'contraentrega';
  status: OrderStatus;
  notes: string;
  total: number;
  containsPreorder: boolean;
  details: BackendOrderDetail[];
  createdAt: string;
  updatedAt: string;
}

export function createOrderInBackend(
  form: CheckoutFormData,
  cartItems: OrderCartItem[],
) {
  return apiRequest<BackendOrder>('/orders', {
    method: 'POST',
    body: JSON.stringify({
      fullName: form.fullName,
      address: form.address,
      city: form.city,
      phone: form.phone,
      paymentMethod: form.paymentMethod,
      notes: form.notes,
      items: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    }),
  });
}

export function getMyOrdersFromBackend() {
  return apiRequest<BackendOrder[]>('/orders/my-orders');
}

export function getAdminOrdersFromBackend() {
  return apiRequest<BackendOrder[]>('/orders');
}

export function updateOrderStatusInBackend(id: number, status: OrderStatus) {
  return apiRequest<BackendOrder>(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({
      status,
    }),
  });
}