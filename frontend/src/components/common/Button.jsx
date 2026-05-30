import styles from './Button.module.css';

const VARIANTS = ['primary', 'secondary', 'outline', 'ghost', 'danger'];
const SIZES = ['sm', 'md', 'lg'];

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  type = 'button',
  icon: Icon,
  onClick,
  className = '',
  ...props
}) {
  const variantClass = VARIANTS.includes(variant) ? variant : 'primary';
  const sizeClass = SIZES.includes(size) ? size : 'md';

  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variantClass]} ${styles[sizeClass]} ${fullWidth ? styles.fullWidth : ''} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : Icon ? (
        <Icon className={styles.icon} />
      ) : null}
      {children}
    </button>
  );
}
