import styles from './Loader.module.css';

export default function Loader({ size = 'md', fullScreen = false, text }) {
  const content = (
    <div className={`${styles.loader} ${styles[size]}`}>
      <div className={styles.spinner} />
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className={styles.fullScreen}>{content}</div>;
  }

  return content;
}
