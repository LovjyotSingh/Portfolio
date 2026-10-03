import type { Metadata } from 'next';
import Link from 'next/link';
import { buttonClasses } from '@/components/ui/button';
import { profile } from '@/content/profile';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[70svh] flex-col justify-center py-28">
      <p className="text-eyebrow text-muted">
        <span className="text-accent-text">404</span>
        <span className="mx-3 inline-block h-px w-8 bg-line-strong align-middle" aria-hidden />
        {profile.name}
      </p>
      <h1 className="text-display mt-6 max-w-4xl font-semibold text-balance">This page isn’t on the site.</h1>
      <p className="mt-6 max-w-md text-pretty text-muted">
        The link might be out of date. Work, about, stack and contact are all on the home page.
      </p>
      <div className="mt-10">
        <Link href="/" className={buttonClasses('primary', 'lg')}>
          Back home
        </Link>
      </div>
    </section>
  );
}
