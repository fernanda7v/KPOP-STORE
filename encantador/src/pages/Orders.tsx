import { useEffect, useState } from 'react';
import { getMyOrdersFromBackend } from '../services/orderService';
import type { BackendOrder } from '../services/orderService';
import { formatCurrency } from '../utils/currency';

export default function Orders() {
  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        setError('');

        const response = await getMyOrdersFromBackend();
        setOrders(response);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudieron cargar tus pedidos.',
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  if (loading) {
    return (
      <section className="empty-state">
        <h1>Cargando pedidos...</h1>
      </section>
    );
  }

  if (error) {
    return (
      <section className="empty-state">
        <h1>No se pudieron cargar los pedidos</h1>
        <p className="error-text">{error}</p>
      </section>
    );
  }

  return (
    <section>
      <div className="section-header">
        <div>
          <h1>Mis pedidos</h1>
          <p className="muted">Consulta el estado de tus compras registradas.</p>
        </div>
        <span className="user-chip">{orders.length} pedido(s)</span>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <p>Aún no tienes pedidos registrados.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article key={order.id} className="order-card">
              <div className="order-top">
                <div>
                  <h3>Pedido #{order.id}</h3>
                  <p className="muted">
                    {new Date(order.createdAt).toLocaleString('es-BO')}
                  </p>
                </div>

                <span className={`status status-${order.status}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-grid">
                <p><strong>Cliente:</strong> {order.fullName}</p>
                <p><strong>Dirección:</strong> {order.address}</p>
                <p><strong>Ciudad:</strong> {order.city}</p>
                <p><strong>Teléfono:</strong> {order.phone}</p>
                <p><strong>Pago:</strong> {order.paymentMethod}</p>
                {order.containsPreorder && (
                  <p className="muted">Incluye producto en preventa.</p>
                )}
              </div>

              <div className="order-items">
                {order.details.map((detail) => (
                  <div key={detail.id} className="summary-row">
                    <span>
                      {detail.product?.name ?? `Producto ${detail.productId}`} x {detail.quantity}
                    </span>
                    <strong>{formatCurrency(detail.subtotal)}</strong>
                  </div>
                ))}
              </div>

              <div className="summary-row total-row">
                <span>Total</span>
                <strong>{formatCurrency(order.total)}</strong>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}