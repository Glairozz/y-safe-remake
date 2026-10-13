import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AdminStats, AdminUser, AdminQuizRow, AdminLessonRow,
  fetchAdminStats, fetchAdminUsers, fetchAdminQuizzes, fetchAdminLessons, fetchAdminUser, adminLogout, getAdminToken,
} from '../services/admin';
import Modal from '../components/ui/Modal';

type Tab = 'users' | 'quizzes' | 'lessons';

const emptyStats: AdminStats = { totalUsers: 0, totalQuizzes: 0, totalLessons: 0, averageScore: 0 };

function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('users');
  const [stats, setStats] = useState<AdminStats>(emptyStats);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [quizzes, setQuizzes] = useState<AdminQuizRow[]>([]);
  const [lessons, setLessons] = useState<AdminLessonRow[]>([]);
  const [search, setSearch] = useState('');
  const [userDetail, setUserDetail] = useState<{ user: AdminUser; quizzes: AdminQuizRow[]; lessons: AdminLessonRow[] } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getAdminToken()) {
      navigate('/admin-login', { replace: true });
      return;
    }
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAll = async () => {
    setError('');
    try {
      const [s, u, q, l] = await Promise.all([
        fetchAdminStats(), fetchAdminUsers(), fetchAdminQuizzes(), fetchAdminLessons(),
      ]);
      setStats(s);
      setUsers(u.users);
      setQuizzes(q.quizzes);
      setLessons(l.lessons);
    } catch (e) {
      const status = (e as { status?: number }).status;
      if (status === 401 || status === 403) {
        adminLogout();
        navigate('/admin-login', { replace: true });
      } else {
        setError('Failed to load admin data.');
      }
    }
  };

  const filteredUsers = useMemo(() => users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase())), [users, search]);
  const filteredQuizzes = useMemo(() => quizzes.filter((q) => q.user_name.toLowerCase().includes(search.toLowerCase())), [quizzes, search]);
  const filteredLessons = useMemo(() => lessons.filter((l) => l.user_name.toLowerCase().includes(search.toLowerCase())), [lessons, search]);

  const openUser = async (id: number) => {
    try {
      setUserDetail(await fetchAdminUser(id));
    } catch {
      setError('Failed to load user details.');
    }
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen bg-brand-card-gray">
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <h1 className="text-lg font-bold text-brand-header-blue">Y-SAFE Admin</h1>
          <div className="flex items-center gap-3">
            <button onClick={loadAll} className="btn-secondary !py-2">Refresh</button>
            <button onClick={handleLogout} className="btn-secondary !py-2">Logout</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {error && <p role="alert" className="mb-4 rounded-xl bg-brand-soft-red/50 px-4 py-2.5 text-sm text-brand-red">{error}</p>}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Total Users', value: stats.totalUsers },
            { label: 'Quizzes Taken', value: stats.totalQuizzes },
            { label: 'Lessons Completed', value: stats.totalLessons },
            { label: 'Average Score', value: `${stats.averageScore}%` },
          ].map((s) => (
            <div key={s.label} className="card text-center">
              <p className="text-2xl font-bold text-brand-header-blue">{s.value}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-secondary">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="card mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2" role="tablist">
              {(['users', 'quizzes', 'lessons'] as Tab[]).map((t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => { setTab(t); setSearch(''); }}
                  className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition ${tab === t ? 'bg-brand-blue text-white' : 'bg-slate-100 text-ink-secondary hover:bg-slate-200'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <input
              className="input max-w-xs"
              placeholder={`Search ${tab}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label={`Search ${tab}`}
            />
          </div>

          <div className="mt-6 overflow-x-auto">
            {tab === 'users' && (
              <table className="w-full text-left text-sm">
                <thead><tr className="border-b text-xs uppercase text-ink-secondary">
                  <th className="pb-2 pr-4">Name</th><th className="pb-2 pr-4">Section</th><th className="pb-2 pr-4">Type</th><th className="pb-2 pr-4">Joined</th><th className="pb-2"></th>
                </tr></thead>
                <tbody>
                  {filteredUsers.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-ink-secondary">No users yet</td></tr>}
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b border-slate-50">
                      <td className="py-2.5 pr-4 font-medium">{u.name}</td>
                      <td className="py-2.5 pr-4">{u.section || '-'}</td>
                      <td className="py-2.5 pr-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${u.is_guest ? 'bg-brand-soft-yellow text-yellow-800' : 'bg-brand-light-green text-green-800'}`}>{u.is_guest ? 'Guest' : 'Registered'}</span>
                      </td>
                      <td className="py-2.5 pr-4 text-ink-secondary">{formatDate(u.created_at)}</td>
                      <td className="py-2.5"><button onClick={() => openUser(u.id)} className="text-sm font-medium text-brand-blue hover:underline">View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {tab === 'quizzes' && (
              <table className="w-full text-left text-sm">
                <thead><tr className="border-b text-xs uppercase text-ink-secondary">
                  <th className="pb-2 pr-4">User</th><th className="pb-2 pr-4">Quiz</th><th className="pb-2 pr-4">Score</th><th className="pb-2">Completed</th>
                </tr></thead>
                <tbody>
                  {filteredQuizzes.length === 0 && <tr><td colSpan={4} className="py-6 text-center text-ink-secondary">No quiz results yet</td></tr>}
                  {filteredQuizzes.map((q) => {
                    const pct = q.total_questions > 0 ? Math.round((q.score / q.total_questions) * 100) : 0;
                    return (
                      <tr key={q.id} className="border-b border-slate-50">
                        <td className="py-2.5 pr-4 font-medium">{q.user_name}{q.section ? <span className="block text-xs text-ink-secondary">{q.section}</span> : null}</td>
                        <td className="py-2.5 pr-4">{q.quiz_type} - {q.quiz_id}</td>
                        <td className="py-2.5 pr-4">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${pct >= 80 ? 'bg-brand-light-green text-green-800' : pct >= 60 ? 'bg-brand-soft-yellow text-yellow-800' : 'bg-brand-soft-red text-red-800'}`}>{q.score}/{q.total_questions} ({pct}%)</span>
                        </td>
                        <td className="py-2.5 text-ink-secondary">{formatDate(q.completed_at)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
            {tab === 'lessons' && (
              <table className="w-full text-left text-sm">
                <thead><tr className="border-b text-xs uppercase text-ink-secondary">
                  <th className="pb-2 pr-4">User</th><th className="pb-2 pr-4">Lesson</th><th className="pb-2">Completed</th>
                </tr></thead>
                <tbody>
                  {filteredLessons.length === 0 && <tr><td colSpan={3} className="py-6 text-center text-ink-secondary">No lesson progress yet</td></tr>}
                  {filteredLessons.map((l) => (
                    <tr key={l.id} className="border-b border-slate-50">
                      <td className="py-2.5 pr-4 font-medium">{l.user_name}{l.section ? <span className="block text-xs text-ink-secondary">{l.section}</span> : null}</td>
                      <td className="py-2.5 pr-4">{l.lesson_id}</td>
                      <td className="py-2.5 text-ink-secondary">{formatDate(l.completed_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      <Modal open={!!userDetail} onClose={() => setUserDetail(null)} title={userDetail ? `User: ${userDetail.user.name}` : ''}
        footer={<button className="btn-secondary" onClick={() => setUserDetail(null)}>Close</button>}>
        {userDetail && (
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-ink-secondary">Section</dt><dd className="font-medium">{userDetail.user.section || 'Not specified'}</dd></div>
            <div><dt className="text-ink-secondary">Type</dt><dd className="font-medium">{userDetail.user.is_guest ? 'Guest' : 'Registered'}</dd></div>
            <div><dt className="text-ink-secondary">Joined</dt><dd className="font-medium">{formatDate(userDetail.user.created_at)}</dd></div>
            <div><dt className="text-ink-secondary">Quizzes</dt><dd className="font-medium">{userDetail.quizzes.length}</dd></div>
            <div><dt className="text-ink-secondary">Lessons</dt><dd className="font-medium">{userDetail.lessons.length}</dd></div>
          </dl>
        )}
      </Modal>
    </div>
  );
}
