import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

export default function Navbar() {
  const { cartCount } = useCart();
  const { currentUser, logout } = useUser();

  return (
    <header className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="brand">
          💜 Kpop Store
        </Link>

        <nav className="nav-links">
          <NavLink to="/">Inicio</NavLink>
          <NavLink to="/products">Productos</NavLink>
          <NavLink to="/cart">Carrito ({cartCount})</NavLink>

          {currentUser && <NavLink to="/orders">Pedidos</NavLink>}
          {currentUser?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
        </nav>

        <div className="nav-user">
          {currentUser ? (
            <>
              <span className="user-chip">
                {currentUser.name} · {currentUser.role}
              </span>
              <button className="btn btn-outline" onClick={logout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-outline" to="/login">
                Login
              </Link>
              <Link className="btn btn-primary" to="/register">
                Registro
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}