import { api } from './api';
import { ADMIN_TOKEN_KEY } from '../lib/storage';

export interface AdminStats {
  totalUsers: number;
  totalQuizzes: number;
  totalLessons: number;
  averageScore: number;
}

export interface AdminUser {
  id: number;
  name: string;
  section: string | null;
  is_guest: number;
  created_at: string;
}

export interface AdminQuizRow {
  id: number;
  user_name: string;
  section: string | null;
  quiz_type: string;
  quiz_id: string;
  score: number;
  total_questions: number;
  completed_at: string;
}

export interface AdminLessonRow {
  id: number;
  user_name: string;
  section: string | null;
  lesson_id: string;
  completed: number;
  completed_at: string | null;
}

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export async function adminLogin(password: string): Promise<void> {
  const data = await api.post<{ token: string }>('/admin/login', { password }, null);
  localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
}

export function adminLogout(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export const fetchAdminStats = () => api.get<AdminStats>('/admin/stats', getAdminToken());
export const fetchAdminUsers = () => api.get<{ users: AdminUser[] }>('/admin/users', getAdminToken());
export const fetchAdminQuizzes = () => api.get<{ quizzes: AdminQuizRow[] }>('/admin/quizzes', getAdminToken());
export const fetchAdminLessons = () => api.get<{ lessons: AdminLessonRow[] }>('/admin/lessons', getAdminToken());
export const fetchAdminUser = (id: number) =>
  api.get<{ user: AdminUser; quizzes: AdminQuizRow[]; lessons: AdminLessonRow[] }>(`/admin/user/${id}`, getAdminToken());
