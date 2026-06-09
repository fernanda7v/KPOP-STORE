import { useEffect, useState } from 'react';
import AdminMenu from '../components/AdminMenu';
import {
  getAdminOrdersFromBackend,
  updateOrderStatusInBackend,
} from '../services/orderService';
import type { BackendOrder, OrderStatus } from '../services/orderService';
import { formatCurrency } from '../utils/currency';

const statuses: OrderStatus[] = [
  'pendiente',
  'pagado',
  'preparando',
  'enviado',
  'entregado',
  'cancelado',
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [filter, setFilter] = useState<'todos' | OrderStatus>('todos');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await getAdminOrdersFromBackend();
      setOrders(response);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudieron cargar los pedidos.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const visibleOrders =
    filter === 'todos'
      ? orders
      : orders.filter((order) => order.status === filter);

  const handleStatusChange = async (orderId: number, status: OrderStatus) => {
    try {
      setMessage('');
      setError('');

      await updateOrderStatusInBackend(orderId, status);
      setMessage('Estado del pedido actualizado.');
      await loadOrders();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo actualizar el estado.',
      );
    }
  };

  if (loading) {
    return (
      <section className="empty-state">
        <h1>Cargando pedidos...</h1>
      </section>
    );
  }

  return (
    <section>
      <div className="section-header">
        <div>
          <h1>Administración de pedidos</h1>
          <p className="muted">
            Revisa y cambia el estado de los pedidos reales del sistema.
          </p>
        </div>
      </div>

      <AdminMenu />

      {message && <p className="success-text">{message}</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="filters">
        <select
          className="input"
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'todos' | OrderStatus)}
        >
          <option value="todos">todos</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {visibleOrders.length === 0 ? (
        <div className="empty-state">
          <p>No hay pedidos para este filtro.</p>
        </div>
      ) : (
        <div className="orders-list">
          {visibleOrders.map((order) => (
            <article className="order-card" key={order.id}>
              <div className="order-top">
                <div>
                  <h3>Pedido #{order.id}</h3>
                  <p className="muted">{order.fullName}</p>
                  <p className="muted">
                    {new Date(order.createdAt).toLocaleString('es-BO')}
                  </p>
                </div>

                <span className={`status status-${order.status}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-grid">
                <p><strong>Total:</strong> {formatCurrency(order.total)}</p>
                <p><strong>Dirección:</strong> {order.address}</p>
                <p><strong>Ciudad:</strong> {order.city}</p>
                <p><strong>Teléfono:</strong> {order.phone}</p>
                <p><strong>Pago:</strong> {order.paymentMethod}</p>
              </div>

              {order.details.map((detail) => (
                <div key={detail.id} className="summary-row">
                  <span>
                    {detail.product?.name ?? `Producto ${detail.productId}`} x {detail.quantity}
                  </span>
                  <strong>{formatCurrency(detail.subtotal)}</strong>
                </div>
              ))}

              <label>
                Cambiar estado
                <select
                  className="input"
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order.id, e.target.value as OrderStatus)
                  }
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}