import styles from './Input.module.css';

export default function Input({
  label,
  error,
  hint,
  icon: Icon,
  className = '',
  containerClassName = '',
  ...props
}) {
  return (
    <div className={`${styles.container} ${containerClassName}`}>
      {label && (
        <label className={styles.label} htmlFor={props.id || props.name}>
          {label}
        </label>
      )}
      <div className={styles.inputWrapper}>
        {Icon && <Icon className={styles.icon} />}
        <input
          className={`${styles.input} ${Icon ? styles.hasIcon : ''} ${error ? styles.error : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
      {hint && !error && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}
