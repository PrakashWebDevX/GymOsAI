import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import toast from 'react-hot-toast';
import { Button, Input } from '../../components/common';
import { useAuthStore } from '../../store';
import { signInWithGoogle } from '../../services/supabase';
import styles from './AuthPages.module.css';

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    try {
      await register(form);
      toast.success('Account created successfully!');
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
        <h2 className={styles.title}>Create Account</h2>
        <p className={styles.subtitle}>Start your AI-powered fitness journey</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Full Name"
            type="text"
            name="fullName"
            icon={FiUser}
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            required
            placeholder="John Doe"
          />
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
            placeholder="Min. 8 characters"
            hint="Must be at least 8 characters"
          />
          <Button type="submit" fullWidth loading={isLoading}>
            Create Account
          </Button>
        </form>

        <div className={styles.divider}>
          <span>or continue with</span>
        </div>

        <Button variant="outline" fullWidth onClick={handleGoogleLogin} icon={FcGoogle}>
          Google
        </Button>

        <p className={styles.footer}>
          Already have an account? <Link to="/auth/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
