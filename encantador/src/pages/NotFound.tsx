import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="empty-state">
      <h1>404 - Página no encontrada</h1>
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </section>
  );
}