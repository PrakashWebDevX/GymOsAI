import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useThemeStore } from '../../store';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Chart({ type = 'line', data, options = {}, height = 300 }) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: isDark ? '#e2e8f0' : '#334155' },
      },
    },
    scales: {
      x: {
        ticks: { color: isDark ? '#94a3b8' : '#64748b' },
        grid: { color: isDark ? 'rgba(148,163,184,0.1)' : 'rgba(100,116,139,0.1)' },
      },
      y: {
        ticks: { color: isDark ? '#94a3b8' : '#64748b' },
        grid: { color: isDark ? 'rgba(148,163,184,0.1)' : 'rgba(100,116,139,0.1)' },
      },
    },
    ...options,
  };

  const ChartComponent = type === 'bar' ? Bar : Line;

  return (
    <div style={{ height }}>
      <ChartComponent data={data} options={defaultOptions} />
    </div>
  );
}
