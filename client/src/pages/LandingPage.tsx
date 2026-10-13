import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, BookOpen, LifeBuoy } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { landingContent } from '../content/landing';

const featureIcons = [BookOpen, ShieldCheck, LifeBuoy];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <section className="mx-auto flex max-w-6xl flex-col items-center px-4 py-16 text-center sm:py-24">
          <img src="/images/LOGO.png" alt="Y-SAFE logo" className="h-16 w-16 rounded-2xl object-contain shadow-sm" />
          <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-brand-blue">{landingContent.hero.title}</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight text-ink-primary sm:text-5xl">{landingContent.hero.headline}</h1>
          <p className="mt-4 max-w-2xl text-base text-ink-secondary sm:text-lg">{landingContent.hero.description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/register" className="btn-primary">{landingContent.hero.primaryCta} <ArrowRight size={18} /></Link>
            <Link to="/login" className="btn-secondary">{landingContent.hero.secondaryCta}</Link>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-center text-2xl font-bold text-ink-primary sm:text-3xl">{landingContent.featuresTitle}</h2>
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {landingContent.features.map((feature, i) => {
                const Icon = featureIcons[i] ?? BookOpen;
                return (
                  <div key={feature.title} className="card">
                    <div className="mb-4 inline-flex rounded-xl bg-brand-soft-blue/50 p-3 text-brand-header-blue">
                      <Icon size={22} />
                    </div>
                    <h3 className="font-semibold text-ink-primary">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-2xl font-bold text-ink-primary sm:text-3xl">{landingContent.howItWorks.title}</h2>
          <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {landingContent.howItWorks.steps.map((step, i) => (
              <li key={step.title} className="text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue font-semibold text-white">{i + 1}</div>
                <h3 className="mt-3 font-semibold text-ink-primary">{step.title}</h3>
                <p className="mt-1 text-sm text-ink-secondary">{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="bg-brand-header-blue py-16 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">{landingContent.trust.title}</h2>
            <ul className="mt-8 space-y-3 text-left sm:mx-auto sm:max-w-xl">
              {landingContent.trust.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm sm:text-base">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-brand-light-green" size={18} />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-ink-primary sm:text-3xl">{landingContent.cta.title}</h2>
          <p className="mt-3 text-ink-secondary">{landingContent.cta.description}</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/register" className="btn-primary">{landingContent.cta.primary}</Link>
            <Link to="/login" className="btn-secondary">{landingContent.cta.secondary}</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
