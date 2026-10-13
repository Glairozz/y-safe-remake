import { FormEvent, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import { authContent } from '../content/auth';

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState('');
  const [section, setSection] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    const from = (location.state as { from?: string } | null)?.from;
    return <Navigate to={from && from !== '/login' ? from : '/dashboard'} replace />;
  }

  const submit = async (e: FormEvent, isGuest: boolean) => {
    e.preventDefault();
    setError('');
    if (!isGuest && !name.trim()) {
      setError(authContent.nameRequired);
      return;
    }
    setLoading(true);
    try {
      await login(name.trim(), section.trim(), isGuest);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : authContent.connectionError);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-ink-secondary hover:text-brand-blue">
          ← Back to home
        </Link>
        <div className="card">
          <div className="mb-6 text-center">
            <img src="/images/LOGO.png" alt="Y-SAFE logo" className="mx-auto h-14 w-14 rounded-2xl object-contain" />
            <h1 className="mt-4 text-2xl font-bold text-ink-primary">{authContent.loginTitle}</h1>
            <p className="mt-2 text-sm text-ink-secondary">{authContent.loginIntro}</p>
          </div>

          <form onSubmit={(e) => submit(e, false)} noValidate className="space-y-4">
            <div>
              <label htmlFor="name" className="label">{authContent.nameLabel} *</label>
              <input id="name" className="input" placeholder={authContent.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </div>
            <div>
              <label htmlFor="section" className="label">{authContent.sectionLabel} <span className="text-ink-secondary">{authContent.sectionOptional}</span></label>
              <input id="section" className="input" placeholder={authContent.sectionPlaceholder} value={section} onChange={(e) => setSection(e.target.value)} />
            </div>
            {error && <p role="alert" className="rounded-xl bg-brand-soft-red/50 px-4 py-2.5 text-sm text-brand-red">{error}</p>}
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Loading...' : authContent.submit}
            </button>
            <button type="button" className="btn-secondary w-full" disabled={loading} onClick={(e) => submit(e as unknown as FormEvent, true)}>
              {authContent.guest}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
