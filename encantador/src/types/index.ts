export type Category =
  | 'albumes'
  | 'ropa'
  | 'accesorios'
  | 'lightsticks'
  | 'posters'
  | 'papeleria'
  | 'pedidos-especiales';

export type UserRole = 'admin' | 'cliente';

export type OrderStatus =
  | 'pendiente'
  | 'pagado'
  | 'preparando'
  | 'enviado'
  | 'entregado';

export type PaymentMethod = 'qr' | 'transferencia' | 'contraentrega';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  stock: number;
  featured: boolean;
  artist: string;
  isPreorder: boolean;
  estimatedDelivery?: string;
}

export type ProductFormData = Omit<Product, 'id'>;

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface OrderItem {
  productId: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: number | null;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  address: string;
  paymentMethod: PaymentMethod;
  notes: string;
  containsPreorder: boolean;
}

export interface CheckoutFormData {
  fullName: string;
  address: string;
  city: string;
  phone: string;
  paymentMethod: PaymentMethod;
  notes: string;
}