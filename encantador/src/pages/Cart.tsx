import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';

export default function Cart() {
  const {
    cartItems,
    cartSubtotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <section className="empty-state">
        <h1>Tu carrito está vacío</h1>
        <p className="muted">Agrega productos del catálogo para continuar.</p>
        <Link to="/products" className="btn btn-primary">
          Ir a productos
        </Link>
      </section>
    );
  }

  return (
    <section className="cart-layout">
      <div>
        <div className="section-header">
          <div>
            <h1>Carrito de compras</h1>
            <p className="muted">Revisa tus productos antes de confirmar el pedido.</p>
          </div>

          <button className="btn btn-outline" onClick={clearCart}>
            Vaciar carrito
          </button>
        </div>

        <div className="cart-list">
          {cartItems.map((item) => (
            <article className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} className="cart-image" />

              <div className="cart-info">
                <div className="product-top">
                  <span className="tag">{item.artist}</span>
                  <span className={item.isPreorder ? 'tag preorder' : 'tag'}>
                    {item.isPreorder ? 'Preventa' : 'Disponible'}
                  </span>
                </div>

                <h3>{item.name}</h3>
                <p className="muted">{item.description}</p>
                <p className="price">{formatCurrency(item.price)}</p>
                <p className="muted">Stock: {item.stock}</p>
              </div>

              <div className="cart-controls">
                <div className="qty-buttons">
                  <button className="btn btn-outline" onClick={() => decreaseQuantity(item.id)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button className="btn btn-outline" onClick={() => increaseQuantity(item.id)}>
                    +
                  </button>
                </div>

                <p className="price">{formatCurrency(item.price * item.quantity)}</p>

                <button className="btn btn-danger" onClick={() => removeFromCart(item.id)}>
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <aside className="summary-box sticky-summary">
        <h2>Resumen</h2>
        <div className="summary-row">
          <span>Productos</span>
          <strong>{cartItems.length}</strong>
        </div>
        <div className="summary-row">
          <span>Subtotal</span>
          <strong>{formatCurrency(cartSubtotal)}</strong>
        </div>
        <div className="summary-row total-row">
          <span>Total</span>
          <strong>{formatCurrency(cartSubtotal)}</strong>
        </div>

        <Link to="/checkout" className="btn btn-primary full-width">
          Continuar al checkout
        </Link>

        <Link to="/products" className="btn btn-outline full-width">
          Seguir comprando
        </Link>
      </aside>
    </section>
  );
}