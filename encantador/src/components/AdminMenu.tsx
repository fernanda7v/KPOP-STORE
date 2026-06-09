import { NavLink } from 'react-router-dom';

export default function AdminMenu() {
  return (
    <div className="admin-menu">
      <NavLink to="/admin">Resumen</NavLink>
      <NavLink to="/admin/products">Productos</NavLink>
      <NavLink to="/admin/orders">Pedidos</NavLink>
      <NavLink to="/admin/users">Usuarios</NavLink>
    </div>
  );
}