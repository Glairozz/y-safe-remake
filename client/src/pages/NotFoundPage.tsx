import { Link } from 'react-router-dom';
import { commonContent } from '../content/dashboard';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-5xl font-bold text-brand-blue">404</p>
      <h1 className="mt-3 text-xl font-bold text-ink-primary">{commonContent.notFoundTitle}</h1>
      <p className="mt-2 text-sm text-ink-secondary">{commonContent.notFoundDescription}</p>
      <Link to="/" className="btn-primary mt-6">{commonContent.backHome}</Link>
    </div>
  );
}
