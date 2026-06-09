import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';
import { formatCurrency } from '../utils/currency';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <article className="card product-card">
      <div className="product-image-wrapper">
        <img src={product.image} alt={product.name} className="product-image" />
        <span className="product-category-badge">{product.category}</span>
      </div>

      <div className="product-info">
        <div className="product-top">
          <span className="tag">{product.artist}</span>
          <span className={product.isPreorder ? 'tag preorder' : 'tag'}>
            {product.isPreorder ? 'Preventa' : 'Disponible'}
          </span>
        </div>

        <h3>{product.name}</h3>
        <p className="muted product-description">{product.description}</p>

        <div className="product-meta">
          <p className="price">{formatCurrency(product.price)}</p>
          <p className="muted">Stock: {product.stock}</p>
        </div>

        {product.isPreorder && product.estimatedDelivery && (
          <p className="preorder-text">
            Entrega estimada: {product.estimatedDelivery}
          </p>
        )}

        <div className="card-actions">
          <Link className="btn btn-outline" to={`/products/${product.id}`}>
            Ver detalle
          </Link>
          <button className="btn btn-primary" onClick={() => addToCart(product, 1)}>
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}