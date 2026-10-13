import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './hooks/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const FirstAidPage = lazy(() => import('./pages/FirstAidPage'));
const SafetyPage = lazy(() => import('./pages/SafetyPage'));
const EssentialsPage = lazy(() => import('./pages/EssentialsPage'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-label="Loading">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-soft-blue border-t-brand-blue" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<LoginPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminPage />} />

            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/first-aid" element={<FirstAidPage />} />
              <Route path="/safety" element={<SafetyPage />} />
              <Route path="/essentials" element={<EssentialsPage />} />
            </Route>

            {/* Legacy URL compatibility */}
            <Route path="/index.html" element={<Navigate to="/" replace />} />
            <Route path="/dashboard.html" element={<Navigate to="/dashboard" replace />} />
            <Route path="/first-aid.html" element={<Navigate to="/first-aid" replace />} />
            <Route path="/safety.html" element={<Navigate to="/safety" replace />} />
            <Route path="/essentials.html" element={<Navigate to="/essentials" replace />} />
            <Route path="/admin.html" element={<Navigate to="/admin" replace />} />
            <Route path="/admin-login.html" element={<Navigate to="/admin-login" replace />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}
