export interface User {
  id: number | null;
  name: string;
  section?: string;
  isGuest: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

export interface MainQuiz {
  title: string;
  questions: QuizQuestion[];
}

export interface Lesson {
  title?: string;
  content: string;
  quiz?: QuizQuestion[];
}

export interface QuizProgress {
  score: number;
  total_questions: number;
}
