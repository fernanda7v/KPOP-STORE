import AdminMenu from '../components/AdminMenu';
import { useUser } from '../context/UserContext';

export default function AdminUsers() {
  const { users } = useUser();

  return (
    <section>
      <div className="section-header">
        <div>
          <h1>Usuarios registrados</h1>
          <p className="muted">Vista simulada de usuarios del sistema.</p>
        </div>
        <span className="user-chip">{users.length} usuario(s)</span>
      </div>

      <AdminMenu />

      <div className="users-grid">
        {users.map((user) => (
          <article key={user.id} className="user-card">
            <p className="eyebrow">Usuario</p>
            <h3>{user.name}</h3>
            <p><strong>Correo:</strong> {user.email}</p>
            <p><strong>Rol:</strong> {user.role}</p>
            <p className="muted">ID: {user.id}</p>
          </article>
        ))}
      </div>
    </section>
  );
}