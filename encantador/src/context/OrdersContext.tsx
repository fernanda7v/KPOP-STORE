import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, CheckoutFormData, Order, OrderStatus, User } from '../types';

interface CreateOrderPayload {
  items: CartItem[];
  customer: CheckoutFormData;
  user: User | null;
}

interface OrdersContextType {
  orders: Order[];
  createOrder: (payload: CreateOrderPayload) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const ORDERS_STORAGE_KEY = 'kpop-store-orders';

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

function getStoredOrders(): Order[] {
  const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (!stored) return [];
  return JSON.parse(stored) as Order[];
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => getStoredOrders());

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const createOrder = ({ items, customer, user }: CreateOrderPayload): Order => {
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const containsPreorder = items.some((item) => item.isPreorder);

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      userId: user?.id ?? null,
      customerName: customer.fullName,
      items: items.map((item) => ({
        productId: item.id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      })),
      total,
      status: customer.paymentMethod === 'contraentrega' ? 'pendiente' : 'pagado',
      createdAt: new Date().toISOString(),
      address: `${customer.address}, ${customer.city}`,
      paymentMethod: customer.paymentMethod,
      notes: customer.notes,
      containsPreorder,
    };

    setOrders((prev) => [newOrder, ...prev]);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  };

  const value = useMemo(
    () => ({
      orders,
      createOrder,
      updateOrderStatus,
    }),
    [orders]
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders debe usarse dentro de OrdersProvider');
  }
  return context;
}