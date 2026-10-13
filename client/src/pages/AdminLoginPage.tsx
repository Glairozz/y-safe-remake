import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminLogin } from '../services/admin';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!password) {
      setError('Please enter a password');
      return;
    }
    setLoading(true);
    try {
      await adminLogin(password);
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid password');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-xl font-bold text-ink-primary">Admin Login</h1>
        <p className="mt-1 text-sm text-ink-secondary">Enter the administrator password to continue.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="adminPassword" className="label">Password</label>
            <input id="adminPassword" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          {error && <p role="alert" className="rounded-xl bg-brand-soft-red/50 px-4 py-2.5 text-sm text-brand-red">{error}</p>}
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <Link to="/dashboard" className="mt-4 inline-block text-sm text-ink-secondary hover:text-brand-blue">← Back to dashboard</Link>
      </div>
    </div>
  );
}
