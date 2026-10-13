import { commonContent } from '../../content/dashboard';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-100 bg-white py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center">
        <p className="text-sm font-semibold text-brand-header-blue">Y-SAFE</p>
        <p className="text-xs text-ink-secondary">{commonContent.tagline}</p>
        <p className="text-xs text-ink-secondary">{commonContent.schoolName}</p>
      </div>
    </footer>
  );
}
