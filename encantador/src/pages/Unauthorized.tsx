import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <section className="empty-state">
      <h1>Acceso denegado</h1>
      <p className="muted">
        No tienes permisos para entrar a esta sección.
      </p>

      <div className="card-actions" style={{ justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary">
          Volver al inicio
        </Link>
        <Link to="/login" className="btn btn-outline">
          Iniciar sesión
        </Link>
      </div>
    </section>
  );
}