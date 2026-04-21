// pages/Login.js
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Login.module.css';

export default function Login() {
  const { login, loading, error, isAuthenticated } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true });
  }, [isAuthenticated]);

  function handle(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function blur(e) {
    setTouched(t => ({ ...t, [e.target.name]: true }));
  }

  async function submit(e) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!form.email || !form.password) return;
    const ok = await login(form.email, form.password);
    if (ok) navigate(from, { replace: true });
  }

  const emailErr    = touched.email    && !form.email    ? 'Email is required' : '';
  const passwordErr = touched.password && !form.password ? 'Password is required' : '';

  return (
    <div className={styles.page}>
      {/* Background dots */}
      <div className={styles.dots} aria-hidden />

      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.logo}>SP</div>
          <div>
            <div className={styles.brandName}>Student Portal</div>
            <div className={styles.brandSub}>Secure Access System</div>
          </div>
        </div>

        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.sub}>Sign in to manage your student records</p>

        <form className={styles.form} onSubmit={submit} noValidate>
          <div className={styles.field}>
            <label className={styles.label}>Email address</label>
            <div className={styles.inputWrap}>
              <span className={styles.ico}>✉</span>
              <input
                className={`${styles.input} ${emailErr ? styles.inputErr : ''}`}
                type="email"
                name="email"
                value={form.email}
                onChange={handle}
                onBlur={blur}
                placeholder="Enter Your Mail"
                autoComplete="email"
              />
            </div>
            {emailErr && <span className={styles.err}>{emailErr}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <div className={styles.inputWrap}>
              <span className={styles.ico}>🔒</span>
              <input
                className={`${styles.input} ${passwordErr ? styles.inputErr : ''}`}
                type="password"
                name="password"
                value={form.password}
                onChange={handle}
                onBlur={blur}
                placeholder="********"
                autoComplete="current-password"
              />
            </div>
            {passwordErr && <span className={styles.err}>{passwordErr}</span>}
          </div>

          {error && (
            <div className={styles.alert}>
              <span>⚠</span> {error}
            </div>
          )}

          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading
              ? <><span className={styles.spinner} /> Signing in…</>
              : 'Sign In →'
            }
          </button>
        </form>

        {/* <div className={styles.hint}>
          <span className={styles.hintTitle}>Demo credentials</span>
          <div className={styles.hintRow}><b>Admin:</b> admin@portal.com / admin123</div>
          <div className={styles.hintRow}><b>Teacher:</b> teacher@portal.com / teach123</div>
        </div> */}
      </div>
    </div>
  );
}
