import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { createOrderInBackend } from '../services/orderService';
import type { CheckoutFormData } from '../types';
import { formatCurrency } from '../utils/currency';

const initialForm: CheckoutFormData = {
  fullName: '',
  address: '',
  city: 'La Paz',
  phone: '',
  paymentMethod: 'qr',
  notes: '',
};

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const { currentUser } = useUser();

  const [form, setForm] = useState<CheckoutFormData>({
    ...initialForm,
    fullName: currentUser?.name ?? '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (cartItems.length === 0) {
    return (
      <section className="empty-state">
        <h1>No puedes hacer checkout sin productos</h1>
        <Link to="/products" className="btn btn-primary">
          Ir al catálogo
        </Link>
      </section>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError('');

      const newOrder = await createOrderInBackend(form, cartItems);

      clearCart();
      alert(`Pedido creado correctamente. Código: ${newOrder.id}`);
      navigate('/orders');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo crear el pedido.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="section-header">
        <div>
          <h1>Checkout / Pedido</h1>
          <p className="muted">
            Completa tus datos para confirmar la compra real en el backend.
          </p>
        </div>
      </div>

      <div className="checkout-layout">
        <form className="form-card" onSubmit={handleSubmit}>
          <label>
            Nombre completo
            <input
              className="input"
              type="text"
              required
              value={form.fullName}
              onChange={(event) => setForm({ ...form, fullName: event.target.value })}
            />
          </label>

          <label>
            Dirección
            <input
              className="input"
              type="text"
              required
              value={form.address}
              onChange={(event) => setForm({ ...form, address: event.target.value })}
            />
          </label>

          <label>
            Ciudad
            <input
              className="input"
              type="text"
              required
              value={form.city}
              onChange={(event) => setForm({ ...form, city: event.target.value })}
            />
          </label>

          <label>
            Teléfono
            <input
              className="input"
              type="text"
              required
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
            />
          </label>

          <label>
            Método de pago
            <select
              className="input"
              value={form.paymentMethod}
              onChange={(event) =>
                setForm({
                  ...form,
                  paymentMethod: event.target.value as CheckoutFormData['paymentMethod'],
                })
              }
            >
              <option value="qr">QR</option>
              <option value="transferencia">Transferencia</option>
              <option value="contraentrega">Contra entrega</option>
            </select>
          </label>

          <label>
            Notas adicionales
            <textarea
              className="input textarea"
              value={form.notes}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
              placeholder="Ej: entregar por la tarde, envolver para regalo, etc."
            />
          </label>

          {error && <p className="error-text">{error}</p>}

          <button className="btn btn-primary full-width" type="submit" disabled={loading}>
            {loading ? 'Confirmando...' : 'Confirmar pedido'}
          </button>
        </form>

        <aside className="summary-box sticky-summary">
          <h2>Resumen del pedido</h2>

          {cartItems.map((item) => (
            <div key={item.id} className="summary-row">
              <span>
                {item.name} x {item.quantity}
              </span>
              <strong>{formatCurrency(item.price * item.quantity)}</strong>
            </div>
          ))}

          <div className="summary-row total-row">
            <span>Total</span>
            <strong>{formatCurrency(cartSubtotal)}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}