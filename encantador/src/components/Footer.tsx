export default function Footer() {
    return (
      <footer className="site-footer">
        <div className="container footer-content">
          <div>
            <h3>Kpop Store</h3>
            <p className="muted">
              Tienda online de productos BTS y K-pop con compras, pedidos y preventas.
            </p>
          </div>
  
          <div>
            <h4>Secciones</h4>
            <ul className="footer-list">
              <li>Inicio</li>
              <li>Productos</li>
              <li>Carrito</li>
              <li>Pedidos</li>
            </ul>
          </div>
  
          <div>
            <h4>Categorías</h4>
            <ul className="footer-list">
              <li>Álbumes</li>
              <li>Ropa</li>
              <li>Accesorios</li>
              <li>Lightsticks</li>
            </ul>
          </div>
        </div>
      </footer>
    );
  }