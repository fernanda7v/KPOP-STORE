interface ChartItem {
  label: string;
  value: number;
}

interface StatsBarChartProps {
  title: string;
  data: ChartItem[];
}

export default function StatsBarChart({ title, data }: StatsBarChartProps) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="chart-card">
      <h2>{title}</h2>

      {data.length === 0 ? (
        <p className="muted">No hay datos para mostrar.</p>
      ) : (
        <div className="bar-chart">
          {data.map((item) => {
            const width = `${(item.value / maxValue) * 100}%`;

            return (
              <div className="bar-row" key={item.label}>
                <div className="bar-label">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>

                <div className="bar-track">
                  <div className="bar-fill" style={{ width }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}