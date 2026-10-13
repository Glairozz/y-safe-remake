export const TOKEN_KEY = 'y-safe-token';
export const USER_KEY = 'y-safe-user';
export const ADMIN_TOKEN_KEY = 'admin-token';
export const COMPLETED_TOPICS_KEY = 'y-safe-completed-topics';
export const TUTORIAL_CLOSED_KEY = 'y-safe-tutorial-closed';

export function loadCompletedTopics(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(COMPLETED_TOPICS_KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveCompletedTopics(topics: Record<string, boolean>): void {
  localStorage.setItem(COMPLETED_TOPICS_KEY, JSON.stringify(topics));
}
