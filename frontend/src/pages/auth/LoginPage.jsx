import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import { Button, Input } from '../../components/common';
import { useAuthStore } from '../../store';
import { signInWithGoogle } from '../../services/supabase';
import styles from './AuthPages.module.css';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Sign in to continue your fitness journey</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Email"
            type="email"
            name="email"
            icon={FiMail}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            icon={FiLock}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            placeholder="Enter your password"
          />
          <Button type="submit" fullWidth loading={isLoading}>
            Sign In
          </Button>
        </form>

        <div className={styles.divider}>
          <span>or continue with</span>
        </div>

        <Button variant="outline" fullWidth onClick={handleGoogleLogin} icon={FcGoogle}>
          Google
        </Button>

        <p className={styles.footer}>
          Don&apos;t have an account? <Link to="/auth/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
