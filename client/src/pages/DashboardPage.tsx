import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cross, ShieldAlert, BriefcaseMedical, X } from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';
import { dashboardContent } from '../content/dashboard';
import { loadCompletedTopics, TUTORIAL_CLOSED_KEY } from '../lib/storage';
import { fetchLessonProgress, fetchQuizProgress } from '../services/progress';

const topicIcons = [Cross, ShieldAlert, BriefcaseMedical];

export default function DashboardPage() {
  const { user } = useAuth();
  const [tutorialClosed, setTutorialClosed] = useState(() => localStorage.getItem(TUTORIAL_CLOSED_KEY) === 'true');
  const [lessonsDone, setLessonsDone] = useState(0);
  const [quizzesDone, setQuizzesDone] = useState(0);
  const [avgScore, setAvgScore] = useState(0);

  useEffect(() => {
    const local = Object.keys(loadCompletedTopics()).filter((k) => loadCompletedTopics()[k]).length;
    setLessonsDone(local);
  }, []);

  useEffect(() => {
    (async () => {
      const [lessonProgress, quizProgress] = await Promise.all([
        fetchLessonProgress(),
        fetchQuizProgress('first-aid'),
      ]);
      if (lessonProgress.length > 0) setLessonsDone(lessonProgress.length);
      setQuizzesDone(quizProgress.length);
      if (quizProgress.length > 0) {
        const total = quizProgress.reduce((s, q) => s + q.score, 0);
        const possible = quizProgress.reduce((s, q) => s + q.total_questions, 0);
        setAvgScore(possible > 0 ? Math.round((total / possible) * 100) : 0);
      }
    })();
  }, []);

  const closeTutorial = () => {
    setTutorialClosed(true);
    localStorage.setItem(TUTORIAL_CLOSED_KEY, 'true');
  };

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold text-ink-primary sm:text-3xl">
        {user?.isGuest
          ? `${dashboardContent.welcomePrefix}!`
          : user?.section
            ? `${dashboardContent.welcomePrefix}, ${user.name} from ${user.section}!`
            : `${dashboardContent.welcomePrefix}, ${user?.name}!`}
      </h1>
      <p className="mt-1 text-sm text-ink-secondary">Choose a topic below to start learning.</p>

      {!tutorialClosed && (
        <section className="card mt-6 border-2 !border-brand-soft-blue">
          <div className="flex items-start justify-between">
            <h2 className="text-lg font-semibold text-brand-header-blue">{dashboardContent.tutorialsTitle}</h2>
            <button onClick={closeTutorial} aria-label="Close tutorial" className="rounded-full p-1.5 text-ink-secondary hover:bg-brand-soft-red hover:text-brand-red">
              <X size={18} />
            </button>
          </div>
          <ol className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {['Choose a Topic', 'Complete Lessons', 'Finish All Topics', 'Take Quizzes', 'Track Progress'].map((t, i) => (
              <li key={t} className="text-center sm:text-left">
                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue text-sm font-semibold text-white sm:mx-0">{i + 1}</div>
                <h3 className="mt-2 text-sm font-semibold text-brand-header-blue">{t}</h3>
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card text-center">
          <p className="text-3xl font-bold text-brand-header-blue">{lessonsDone}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-secondary">{dashboardContent.lessonsCompleted}</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-brand-header-blue">{quizzesDone}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-secondary">{dashboardContent.quizzesTaken}</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-brand-header-blue">{avgScore}%</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-secondary">{dashboardContent.averageScore}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {dashboardContent.topics.map((topic, i) => {
          const Icon = topicIcons[i];
          return (
            <Link key={topic.to} to={topic.to} className="card group transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="inline-flex rounded-xl bg-brand-soft-blue/50 p-3 text-brand-header-blue">
                <Icon size={22} />
              </div>
              <h3 className="mt-4 font-semibold text-ink-primary group-hover:text-brand-header-blue">{topic.title}</h3>
              <p className="mt-1 text-sm text-ink-secondary">{topic.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
