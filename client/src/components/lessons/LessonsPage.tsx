import { useMemo, useState } from 'react';
import { CheckCircle2, PlayCircle } from 'lucide-react';
import Modal from '../ui/Modal';
import QuizModal from './QuizModal';
import { Lesson, QuizQuestion } from '../../types';
import { loadCompletedTopics, saveCompletedTopics } from '../../lib/storage';
import { saveLessonProgress, saveQuizProgress } from '../../services/progress';

interface LessonsPageProps {
  pageTitle: string;
  pageDescription: string;
  intro?: string;
  quizType: string;
  lessons: Record<string, Lesson>;
  quizTitle: string;
  quizQuestions: QuizQuestion[];
  videoMap?: Record<string, string>;
}

function firstParagraph(html: string): string {
  const match = html.match(/<p>(.*?)<\/p>/s);
  return match ? match[1].replace(/<[^>]+>/g, '').trim() : '';
}

function firstImage(html: string): string | null {
  const match = html.match(/<img[^>]+src="([^"]+)"/);
  return match ? match[1] : null;
}

export function lessonTitle(lesson: Lesson, fallback: string): string {
  if (lesson.title) return lesson.title;
  const match = lesson.content.match(/<h3>(.*?)<\/h3>/);
  return match ? match[1] : fallback;
}

export default function LessonsPage({ pageTitle, pageDescription, intro, quizType, lessons, quizTitle, quizQuestions, videoMap }: LessonsPageProps) {
  const lessonIds = useMemo(() => Object.keys(lessons), [lessons]);
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => loadCompletedTopics());
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);

  const completedCount = lessonIds.filter((id) => completed[id]).length;
  const quizUnlocked = completedCount === lessonIds.length;

  const markCompleted = (id: string) => {
    const next = { ...completed, [id]: true };
    setCompleted(next);
    saveCompletedTopics(next);
    saveLessonProgress(id, true);
  };

  const active = activeLesson ? lessons[activeLesson] : null;

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold text-ink-primary sm:text-3xl">{pageTitle}</h1>
      <p className="mt-2 font-medium text-brand-header-blue">{pageDescription}</p>
      {intro && <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{intro}</p>}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lessonIds.map((id) => {
          const lesson = lessons[id];
          const image = firstImage(lesson.content);
          const done = !!completed[id];
          return (
            <button
              key={id}
              onClick={() => setActiveLesson(id)}
              className={`group relative rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${done ? 'border-brand-green/60' : 'border-slate-100'}`}
            >
              {done && (
                <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-brand-light-green px-2.5 py-0.5 text-xs font-medium text-green-800">
                  <CheckCircle2 size={14} /> Completed
                </span>
              )}
              {image && <img src={image} alt="" className="mb-3 h-20 w-20 object-contain" loading="lazy" />}
              <h3 className="font-semibold text-ink-primary group-hover:text-brand-header-blue">{lessonTitle(lesson, id)}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-ink-secondary">{firstParagraph(lesson.content)}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue">
                <PlayCircle size={16} /> View Lesson
              </span>
            </button>
          );
        })}
      </div>

      <section className="card mt-10 text-center">
        <h2 className="text-lg font-bold text-ink-primary">{quizTitle}</h2>
        <p className="mt-1 text-sm text-ink-secondary">
          {quizUnlocked ? 'You have completed all topics. You can take the quiz now.' : 'Complete all topics above to unlock this quiz.'}
        </p>
        <button className="btn-primary mt-4" disabled={!quizUnlocked} onClick={() => setQuizOpen(true)}>
          {quizUnlocked ? 'Start Quiz' : `Complete ${lessonIds.length - completedCount} more topic${lessonIds.length - completedCount === 1 ? '' : 's'}`}
        </button>
        <p className="mt-3 text-xs text-ink-secondary">
          {completedCount} / {lessonIds.length} topics completed
        </p>
      </section>

      <Modal
        open={!!active}
        onClose={() => setActiveLesson(null)}
        title={active ? lessonTitle(active, quizTitle) : ''}
        wide
        footer={
          activeLesson ? (
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button className="btn-secondary" onClick={() => setActiveLesson(null)}>Close</button>
              <button className="btn-success" onClick={() => { markCompleted(activeLesson); setActiveLesson(null); }}>Mark as Completed</button>
            </div>
          ) : undefined
        }
      >
        {active && (
          <div className="space-y-4 text-sm leading-relaxed text-ink-primary [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-ink-primary [&_h4]:mt-3 [&_h4]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-2">
            {videoMap && activeLesson && videoMap[activeLesson] && (
              <div className="aspect-video w-full overflow-hidden rounded-xl">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${videoMap[activeLesson]}`}
                  title={lessonTitle(active, 'Video')}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: active.content }} />
          </div>
        )}
      </Modal>

      <QuizModal
        open={quizOpen}
        title={quizTitle}
        questions={quizQuestions}
        onClose={() => setQuizOpen(false)}
        onComplete={(score, total) => saveQuizProgress(quizType, quizType, score, total)}
      />
    </div>
  );
}
