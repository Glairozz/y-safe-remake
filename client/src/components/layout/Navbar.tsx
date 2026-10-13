import { NavLink, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { navigation } from '../../content/navigation';
import { useAuth } from '../../hooks/AuthContext';

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/LOGO.png" alt="Y-SAFE logo" className="h-9 w-9 rounded-lg object-contain" />
          <span className="text-lg font-bold tracking-tight text-brand-header-blue">{navigation.brand}</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4" aria-label="Main navigation">
          <NavLink to="/" className={({ isActive }) => `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'text-brand-blue' : 'text-ink-secondary hover:text-brand-blue'}`}>
            Home
          </NavLink>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-primary !py-2">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-secondary transition hover:text-brand-blue">
                <LogIn size={16} /> Sign In
              </Link>
              <Link to="/register" className="btn-primary !py-2">Get Started</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
