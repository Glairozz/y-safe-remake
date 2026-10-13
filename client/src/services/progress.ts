import { api } from './api';
import { QuizProgress } from '../types';

export async function saveQuizProgress(quizType: string, quizId: string, score: number, totalQuestions: number): Promise<void> {
  try {
    await api.post('/quiz-progress', { quizType, quizId, score, totalQuestions });
  } catch (e) {
    console.error('Failed to save quiz progress:', e);
  }
}

export async function saveLessonProgress(lessonId: string, completed = true): Promise<void> {
  try {
    await api.post('/lesson-progress', { lessonId, completed });
  } catch (e) {
    console.error('Failed to save lesson progress:', e);
  }
}

export async function fetchLessonProgress(): Promise<QuizProgress[]> {
  try {
    const data = await api.get<{ progress: QuizProgress[] }>('/lesson-progress');
    return data.progress ?? [];
  } catch {
    return [];
  }
}

export async function fetchQuizProgress(quizType: string): Promise<QuizProgress[]> {
  try {
    const data = await api.get<{ progress: QuizProgress[] }>(`/quiz-progress/${quizType}`);
    return data.progress ?? [];
  } catch {
    return [];
  }
}
