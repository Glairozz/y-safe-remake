import { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { User } from '../types';
import * as authService from '../services/auth';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (name: string, section: string, isGuest: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => authService.getStoredUser());

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: !!user,
    async login(name, section, isGuest) {
      const { user: loggedInUser } = await authService.registerOrLogin(name, section, isGuest);
      setUser(loggedInUser);
    },
    logout() {
      authService.logout();
      setUser(null);
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
