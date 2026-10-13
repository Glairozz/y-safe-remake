import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import { QuizQuestion } from '../../types';

interface QuizModalProps {
  open: boolean;
  title: string;
  questions: QuizQuestion[];
  onClose: () => void;
  onComplete: (score: number, total: number) => void;
}

export default function QuizModal({ open, title, questions, onClose, onComplete }: QuizModalProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (open) {
      setIndex(0);
      setSelected(null);
      setCorrect(0);
      setFinished(false);
    }
  }, [open]);

  if (!open) return null;
  const current = questions[index];
  const isLast = index === questions.length - 1;
  const percentage = finished ? Math.round((correct / questions.length) * 100) : 0;

  const handleNext = () => {
    if (selected === null) return;
    const newCorrect = correct + (selected === current.correct ? 1 : 0);
    if (isLast) {
      setCorrect(newCorrect);
      setFinished(true);
      onComplete(newCorrect, questions.length);
    } else {
      setCorrect(newCorrect);
      setIndex(index + 1);
      setSelected(null);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={finished ? 'Quiz Complete!' : title}
      footer={
        finished ? (
          <button className="btn-primary w-full sm:w-auto" onClick={onClose}>Continue</button>
        ) : (
          <div className="flex justify-end">
            <button className={isLast ? 'btn-success' : 'btn-primary'} onClick={handleNext} disabled={selected === null}>
              {isLast ? 'Submit Quiz' : 'Next'}
            </button>
          </div>
        )
      }
    >
      {finished ? (
        <div className="space-y-4 text-center">
          <div className="text-5xl" aria-hidden>🎉</div>
          <p className="text-3xl font-bold text-brand-header-blue">{percentage}%</p>
          <p className="text-sm text-ink-secondary">
            {percentage >= 80 ? 'Excellent! You have mastered this topic!' : percentage >= 60 ? 'Good job! You understand the basics well.' : 'Keep learning! Review the lessons and try again.'}
          </p>
          <dl className="mx-auto grid max-w-xs grid-cols-2 gap-4 rounded-xl bg-brand-card-gray p-4 text-sm">
            <div>
              <dt className="text-ink-secondary">Correct answers</dt>
              <dd className="text-xl font-bold text-ink-primary">{correct}</dd>
            </div>
            <div>
              <dt className="text-ink-secondary">Total questions</dt>
              <dd className="text-xl font-bold text-ink-primary">{questions.length}</dd>
            </div>
          </dl>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-secondary">
              Question {index + 1} of {questions.length}
            </p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
              <div className="h-1.5 rounded-full bg-brand-blue transition-all" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
            </div>
          </div>
          <h3 className="text-base font-semibold text-ink-primary">{current.question}</h3>
          <div className="space-y-2" role="radiogroup" aria-label="Answer options">
            {current.options.map((option, i) => (
              <button
                key={i}
                role="radio"
                aria-checked={selected === i}
                onClick={() => setSelected(i)}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                  selected === i ? 'border-brand-blue bg-brand-soft-blue/40 font-medium' : 'border-slate-200 hover:border-brand-blue/50 hover:bg-slate-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}
