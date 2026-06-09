import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductsContext';

export default function Home() {
  const { products } = useProducts();

  const featuredProducts = products.filter((product) => product.featured);
  const preorderProducts = products.filter((product) => product.isPreorder);

  return (
    <section>
      <div className="hero hero-home">
        <div className="hero-left">
          <p className="eyebrow">BTS · K-pop · pedidos especiales</p>
          <h1>Tu tienda online para fans de BTS y del universo K-pop</h1>
          <p className="hero-text">
            Compra álbumes, ropa, accesorios, lightsticks y productos por preventa
            desde una tienda moderna, visual y lista para simular compras reales.
          </p>

          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary">
              Explorar productos
            </Link>
            <Link to="/cart" className="btn btn-outline">
              Ver carrito
            </Link>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <strong>{products.length}</strong>
              <span>Productos</span>
            </div>
            <div className="hero-stat">
              <strong>{featuredProducts.length}</strong>
              <span>Destacados</span>
            </div>
            <div className="hero-stat">
              <strong>{preorderProducts.length}</strong>
              <span>Preventas</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-highlight-card">
            <p className="mini-label">Tienda destacada</p>
            <h3>Merch, álbumes y pedidos especiales</h3>
            <p className="muted">
              Una experiencia tipo e-commerce para fans que quieran comprar o reservar
              productos de sus grupos favoritos.
            </p>
          </div>

          <div className="hero-highlight-grid">
            <div className="mini-box">
              <span>💿</span>
              <p>Álbumes</p>
            </div>
            <div className="mini-box">
              <span>🧥</span>
              <p>Ropa</p>
            </div>
            <div className="mini-box">
              <span>✨</span>
              <p>Accesorios</p>
            </div>
            <div className="mini-box">
              <span>🔦</span>
              <p>Lightsticks</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section-header">
        <div>
          <h2>Productos destacados</h2>
          <p className="muted">Los más llamativos de la tienda</p>
        </div>
        <Link to="/products" className="section-link">
          Ver catálogo completo
        </Link>
      </div>

      <div className="grid">
        {featuredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="section-header top-gap">
        <div>
          <h2>Pedidos especiales y preventas</h2>
          <p className="muted">Productos reservados o importados bajo pedido</p>
        </div>
      </div>

      {preorderProducts.length > 0 ? (
        <div className="grid">
          {preorderProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No hay productos en preventa por ahora.</p>
        </div>
      )}
    </section>
  );
}