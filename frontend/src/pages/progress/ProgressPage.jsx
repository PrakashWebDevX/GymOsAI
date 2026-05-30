import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Button, Card, Chart, Loader } from '../../components/common';
import { useProgressStore } from '../../store';
import styles from './ProgressPage.module.css';

export default function ProgressPage() {
  const { logs, photos, fetchProgress, addLog, isLoading } = useProgressStore();
  const [form, setForm] = useState({ weightKg: '', bodyFatPercent: '', notes: '' });

  useEffect(() => {
    fetchProgress();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addLog({
        weightKg: parseFloat(form.weightKg) || undefined,
        bodyFatPercent: parseFloat(form.bodyFatPercent) || undefined,
        notes: form.notes,
      });
      toast.success('Progress logged!');
      setForm({ weightKg: '', bodyFatPercent: '', notes: '' });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const chartData = {
    labels: logs?.slice(0, 10).reverse().map((l) =>
      new Date(l.logged_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    ) || [],
    datasets: [{
      label: 'Weight (kg)',
      data: logs?.slice(0, 10).reverse().map((l) => l.weight_kg).filter(Boolean) || [],
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  };

  if (isLoading && !logs?.length) return <Loader fullScreen text="Loading progress..." />;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Progress Tracking</h1>
        <p>Monitor your fitness journey over time</p>
      </header>

      <div className={styles.grid}>
        <Card title="Log Progress" padding="lg">
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label>Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.weightKg}
                  onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
                  placeholder="75.5"
                />
              </div>
              <div className={styles.field}>
                <label>Body Fat (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={form.bodyFatPercent}
                  onChange={(e) => setForm({ ...form, bodyFatPercent: e.target.value })}
                  placeholder="15.0"
                />
              </div>
            </div>
            <div className={styles.field}>
              <label>Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="How are you feeling?"
                rows={3}
              />
            </div>
            <Button type="submit" fullWidth>Log Entry</Button>
          </form>
        </Card>

        <Card title="Weight Trend" padding="lg">
          {logs?.length > 0 ? (
            <Chart data={chartData} height={250} />
          ) : (
            <p className={styles.empty}>Log your first entry to see trends</p>
          )}
        </Card>
      </div>

      {logs?.length > 0 && (
        <Card title="Recent Logs" className={styles.logs}>
          <div className={styles.logList}>
            {logs.slice(0, 5).map((log) => (
              <div key={log.id} className={styles.logItem}>
                <span className={styles.date}>
                  {new Date(log.logged_at).toLocaleDateString()}
                </span>
                {log.weight_kg && <span>{log.weight_kg} kg</span>}
                {log.body_fat_percent && <span>{log.body_fat_percent}% BF</span>}
                {log.notes && <span className={styles.notes}>{log.notes}</span>}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
