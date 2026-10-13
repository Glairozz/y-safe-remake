import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Cross, ShieldAlert, BriefcaseMedical, ShieldCheck, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/AuthContext';

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/first-aid', label: 'First Aid', icon: Cross },
  { to: '/safety', label: 'Safety', icon: ShieldAlert },
  { to: '/essentials', label: 'Essentials', icon: BriefcaseMedical },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebar = (
    <nav className="flex h-full flex-col" aria-label="Dashboard navigation">
      <div className="flex items-center gap-2 px-4 py-5">
        <img src="/images/LOGO.png" alt="Y-SAFE logo" className="h-9 w-9 rounded-lg object-contain" />
        <span className="text-lg font-bold text-brand-header-blue">Y-SAFE</span>
      </div>
      <div className="flex-1 space-y-1 px-3">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive ? 'bg-brand-soft-blue/60 text-brand-header-blue' : 'text-ink-secondary hover:bg-slate-100 hover:text-brand-header-blue'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
        <Link
          to="/admin-login"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-secondary transition hover:bg-slate-100 hover:text-brand-header-blue"
        >
          <ShieldCheck size={18} />
          Admin
        </Link>
      </div>
      <div className="border-t border-slate-100 p-4">
        <p className="mb-2 truncate text-sm font-semibold text-ink-primary">{user?.name}</p>
        <p className="mb-3 text-xs text-ink-secondary">{user?.isGuest ? 'Guest' : user?.section || 'Registered user'}</p>
        <button onClick={handleLogout} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-brand-soft-red bg-brand-soft-red/40 px-3 py-2 text-sm font-medium text-brand-red transition hover:bg-brand-soft-red">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </nav>
  );

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r border-slate-100 bg-white md:block">{sidebar}</aside>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-100 bg-white/90 px-4 backdrop-blur md:justify-end">
          <button className="rounded-lg p-2 text-ink-secondary hover:bg-slate-100 md:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
          <span className="text-sm font-medium text-ink-secondary">{user?.name}</span>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl">
            <button className="absolute right-3 top-3 rounded-lg p-2 text-ink-secondary hover:bg-slate-100" onClick={() => setOpen(false)} aria-label="Close menu">
              <X size={20} />
            </button>
            {sidebar}
          </aside>
        </div>
      )}
    </div>
  );
}
