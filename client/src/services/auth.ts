import { api } from './api';
import { AuthResponse, User } from '../types';
import { TOKEN_KEY, USER_KEY } from '../lib/storage';

export async function registerOrLogin(name: string, section: string, isGuest: boolean): Promise<AuthResponse> {
  const data = await api.post<AuthResponse>('/register', { name, section, isGuest });
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  return data;
}

export function getStoredUser(): User | null {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const raw = localStorage.getItem(USER_KEY);
    if (!token || !raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
