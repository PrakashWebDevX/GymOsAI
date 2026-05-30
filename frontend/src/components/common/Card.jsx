import styles from './Card.module.css';

export default function Card({
  children,
  title,
  subtitle,
  action,
  padding = 'md',
  hover = false,
  className = '',
  onClick,
}) {
  return (
    <div
      className={`${styles.card} ${styles[padding]} ${hover ? styles.hover : ''} ${onClick ? styles.clickable : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {(title || action) && (
        <div className={styles.header}>
          <div>
            {title && <h3 className={styles.title}>{title}</h3>}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {action && <div className={styles.action}>{action}</div>}
        </div>
      )}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
