import { useEffect, useState } from 'react';
import AdminMenu from '../components/AdminMenu';
import StatsBarChart from '../components/StatsBarChart';
import { downloadFile } from '../services/api';
import {
  getDashboardSummary,
  getProductsByCategory,
} from '../services/statsService';
import type {
  DashboardSummary,
  ProductByCategory,
} from '../services/statsService';
import { formatCurrency } from '../utils/currency';

export default function AdminDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [productsByCategory, setProductsByCategory] = useState<ProductByCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pdfMessage, setPdfMessage] = useState('');

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        setError('');

        const [summaryResponse, categoryResponse] = await Promise.all([
          getDashboardSummary(),
          getProductsByCategory(),
        ]);

        setSummary(summaryResponse);
        setProductsByCategory(categoryResponse);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'No se pudieron cargar las estadísticas.',
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const handleDownloadPdf = async () => {
    try {
      setPdfMessage('');
      await downloadFile('/reports/products-pdf', 'reporte-productos.pdf');
      setPdfMessage('Reporte descargado correctamente.');
    } catch (err) {
      setPdfMessage(
        err instanceof Error
          ? err.message
          : 'No se pudo descargar el reporte.',
      );
    }
  };

  const chartData = productsByCategory.map((item) => ({
    label: item.category,
    value: item.total,
  }));

  return (
    <section>
      <div className="section-header">
        <div>
          <h1>Panel de administración</h1>
          <p className="muted">
            Resumen general del sistema con datos reales del backend.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleDownloadPdf}>
          Descargar reporte PDF
        </button>
      </div>

      <AdminMenu />

      {pdfMessage && <p className="success-text">{pdfMessage}</p>}

      {loading && (
        <div className="empty-state">
          <p>Cargando estadísticas...</p>
        </div>
      )}

      {error && (
        <div className="empty-state">
          <p className="error-text">{error}</p>
          <p className="muted">
            Verifica que hayas iniciado sesión como administrador.
          </p>
        </div>
      )}

      {!loading && !error && summary && (
        <>
          <div className="stats-grid">
            <article className="stat-card">
              <h3>Productos activos</h3>
              <p>{summary.activeProducts}</p>
            </article>

            <article className="stat-card">
              <h3>Productos inactivos</h3>
              <p>{summary.inactiveProducts}</p>
            </article>

            <article className="stat-card">
              <h3>Pedidos</h3>
              <p>{summary.totalOrders}</p>
            </article>

            <article className="stat-card">
              <h3>Ventas</h3>
              <p>{formatCurrency(summary.totalSales)}</p>
            </article>
          </div>

          <StatsBarChart
            title="Productos por categoría"
            data={chartData}
          />
        </>
      )}
    </section>
  );
}