// components/UI.jsx — Shared reusable components

import styles from './UI.module.css';

/* ── Button ─────────────────────────────── */
export function Button({ children, variant = 'primary', size = 'md', loading, danger, ...props }) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${danger ? styles.danger : ''}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <span className={styles.spinner} /> : null}
      {children}
    </button>
  );
}

/* ── Input ──────────────────────────────── */
export function Input({ label, error, icon, ...props }) {
  return (
    <div className={styles.field}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputWrap}>
        {icon && <span className={styles.inputIcon}>{icon}</span>}
        <input className={`${styles.input} ${error ? styles.inputError : ''} ${icon ? styles.inputWithIcon : ''}`} {...props} />
      </div>
      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  );
}

/* ── Select ─────────────────────────────── */
export function Select({ label, error, children, ...props }) {
  return (
    <div className={styles.field}>
      {label && <label className={styles.label}>{label}</label>}
      <select className={`${styles.input} ${error ? styles.inputError : ''}`} {...props}>
        {children}
      </select>
      {error && <span className={styles.errorMsg}>{error}</span>}
    </div>
  );
}

/* ── Badge ──────────────────────────────── */
export function Badge({ children, color = 'default' }) {
  return <span className={`${styles.badge} ${styles['badge_' + color]}`}>{children}</span>;
}

/* ── Spinner ────────────────────────────── */
export function Spinner({ size = 32 }) {
  return (
    <div className={styles.spinnerContainer}>
      <span className={styles.spinnerLg} style={{ width: size, height: size }} />
    </div>
  );
}

/* ── Card ───────────────────────────────── */
export function Card({ children, className = '', ...props }) {
  return <div className={`${styles.card} ${className}`} {...props}>{children}</div>;
}

/* ── PageHeader ─────────────────────────── */
export function PageHeader({ title, subtitle, action, className }) {
  return (
    <div className={`${styles.pageHeader} ${className || ''}`}>
      <div>
        <h1 className={styles.pageTitle}>{title}</h1>
        {subtitle && <p className={styles.pageSub}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
/* ── Confirm Dialog ─────────────────────── */
export function ConfirmDialog({ open, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.dialogIcon}>⚠</div>
        <p className={styles.dialogMsg}>{message}</p>
        <div className={styles.dialogActions}>
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button danger onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  );
}
