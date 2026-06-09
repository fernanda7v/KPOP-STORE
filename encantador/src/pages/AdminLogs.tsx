import { useEffect, useState } from 'react';
import AdminMenu from '../components/AdminMenu';
import { getAccessLogs } from '../services/accessLogsService';
import type { AccessLog } from '../services/accessLogsService';

function normalizeEvent(event: string) {
  const value = event.toLowerCase();

  if (value === 'login' || value === 'ingreso') return 'ingreso';
  if (value === 'logout' || value === 'salida') return 'salida';

  return value;
}

function formatEvent(event: string) {
  const value = normalizeEvent(event);

  if (value === 'ingreso') return 'Ingreso';
  if (value === 'salida') return 'Salida';

  return event;
}

function formatDate(date: string) {
  return new Date(date).toLocaleString('es-BO');
}

function getEventClass(event: string) {
  const value = normalizeEvent(event);

  if (value === 'ingreso') return 'log-badge log-login';
  if (value === 'salida') return 'log-badge log-logout';

  return 'log-badge';
}

export default function AdminLogs() {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadLogs() {
    try {
      setLoading(true);
      const data = await getAccessLogs();
      setLogs(data);
    } catch (error) {
      console.error('Error cargando logs:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  const totalIngresos = logs.filter(
    (log) => normalizeEvent(log.event) === 'ingreso',
  ).length;

  const totalSalidas = logs.filter(
    (log) => normalizeEvent(log.event) === 'salida',
  ).length;

  return (
    <div className="admin-page">
      <AdminMenu />

      <section className="logs-panel">
        <div className="logs-header-card">
          <div>
            <span className="logs-kicker">Seguridad del sistema</span>
            <h1>Logs de acceso</h1>
            <p>
              Registro visual de ingresos y salidas de usuarios, incluyendo IP,
              navegador, evento y fecha/hora.
            </p>
          </div>

          <button className="logs-refresh-btn" onClick={loadLogs}>
            Actualizar logs
          </button>
        </div>

        <div className="logs-summary-grid">
          <div className="logs-summary-card">
            <span>Total registros</span>
            <strong>{logs.length}</strong>
          </div>

          <div className="logs-summary-card login-card">
            <span>Ingresos</span>
            <strong>{totalIngresos}</strong>
          </div>

          <div className="logs-summary-card logout-card">
            <span>Salidas</span>
            <strong>{totalSalidas}</strong>
          </div>
        </div>

        {loading ? (
          <div className="logs-empty">Cargando logs de acceso...</div>
        ) : logs.length === 0 ? (
          <div className="logs-empty">Todavía no hay logs registrados.</div>
        ) : (
          <div className="logs-table-card">
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Evento</th>
                  <th>IP</th>
                  <th>Browser</th>
                  <th>Fecha y hora</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <strong>{log.user?.name || 'Usuario desconocido'}</strong>
                      <small>{log.user?.email || 'Sin correo'}</small>
                    </td>

                    <td>
                      <span className={getEventClass(log.event)}>
                        {formatEvent(log.event)}
                      </span>
                    </td>

                    <td>
                      <span className="ip-pill">
                        {log.ip || 'No registrada'}
                      </span>
                    </td>

                    <td className="browser-cell">
                      {log.browser || 'No registrado'}
                    </td>

                    <td>{formatDate(log.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}