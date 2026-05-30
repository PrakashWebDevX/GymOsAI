import styles from './ProgressBar.module.css';

export default function ProgressBar({
  value = 0,
  max = 100,
  label,
  showValue = true,
  color = 'primary',
  size = 'md',
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={styles.container}>
      {(label || showValue) && (
        <div className={styles.header}>
          {label && <span className={styles.label}>{label}</span>}
          {showValue && <span className={styles.value}>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={`${styles.track} ${styles[size]}`}>
        <div
          className={`${styles.fill} ${styles[color]}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
