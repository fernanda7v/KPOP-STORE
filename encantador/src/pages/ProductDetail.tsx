import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProductByIdFromBackend } from '../services/productService';
import type { Product } from '../types';
import { formatCurrency } from '../utils/currency';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError('');

        const productId = Number(id);

        if (!productId) {
          setError('Producto no válido.');
          return;
        }

        const response = await getProductByIdFromBackend(productId);
        setProduct(response);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudo cargar el producto.',
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <section className="empty-state">
        <h1>Cargando producto...</h1>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="empty-state">
        <h1>Producto no encontrado</h1>
        <p className="error-text">{error}</p>
        <Link className="btn btn-primary" to="/products">
          Volver al catálogo
        </Link>
      </section>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <section className="detail-layout">
      <img src={product.image} alt={product.name} className="detail-image" />

      <div className="detail-info">
        <div className="product-top">
          <span className="tag">{product.artist}</span>
          <span className={product.isPreorder ? 'tag preorder' : 'tag'}>
            {product.isPreorder ? 'Preventa' : 'Disponible'}
          </span>
        </div>

        <h1>{product.name}</h1>
        <p className="muted">{product.description}</p>

        <p className="price big-price">{formatCurrency(product.price)}</p>

        <p>
          <strong>Categoría:</strong> {product.category}
        </p>

        <p>
          <strong>Stock:</strong> {product.stock}
        </p>

        {product.isPreorder && product.estimatedDelivery && (
          <p className="preorder-text">
            Entrega estimada: {product.estimatedDelivery}
          </p>
        )}

        <div className="quantity-box">
          <label>
            Cantidad
            <input
              className="input small-input"
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
            />
          </label>
        </div>

        <div className="card-actions">
          <button className="btn btn-primary" onClick={handleAddToCart}>
            Agregar al carrito
          </button>

          <Link className="btn btn-outline" to="/products">
            Volver
          </Link>
        </div>
      </div>
    </section>
  );
}