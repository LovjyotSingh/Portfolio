import { ArrowUpRight } from 'lucide-react';
import { navItems, profile, socials } from '@/content/profile';
import { FooterActions } from './footer-actions';

const year = new Date().getFullYear();

const linkCls =
  'group inline-flex items-center gap-1.5 py-1 text-[0.95rem] text-muted transition-colors duration-300 hover:text-fg';

const elsewhere = [
  { label: socials.github.label, href: socials.github.href, external: true },
  { label: socials.linkedin.label, href: socials.linkedin.href, external: true },
  { label: socials.email.label, href: socials.email.href },
  { label: 'Résumé (PDF)', href: profile.resume.href, download: profile.resume.fileName },
];

export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-line">
      <div
        aria-hidden
        className="absolute -bottom-1/2 left-1/2 -z-10 h-[34rem] w-[60rem] max-w-[140vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent_72%)] opacity-60"
      />

      <div className="container-page grid gap-12 pt-16 sm:pt-20 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <p className="text-eyebrow text-subtle">Thanks for scrolling this far</p>
          <p className="mt-5 max-w-xl text-[clamp(1.35rem,2.4vw,1.9rem)] leading-[1.2] font-medium tracking-[-0.03em] text-balance">
            Designed and built from scratch with Next.js 16, React 19, Tailwind CSS 4, Motion and Yjs.{' '}
            <span className="font-accent text-muted">No template, no UI kit.</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:max-w-md lg:col-span-5 lg:col-start-8 lg:max-w-none">
          <nav aria-label="Footer">
            <p className="text-eyebrow text-subtle">Sections</p>
            <ul className="mt-4 space-y-1.5">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className={linkCls}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="text-eyebrow text-subtle">Elsewhere</p>
            <ul className="mt-4 space-y-1.5">
              {elsewhere.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    download={link.download}
                    className={linkCls}
                  >
                    {link.label}
                    <ArrowUpRight
                      className="size-3.5 text-subtle transition-[translate,color] duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-text"
                      aria-hidden
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="container-page mt-16 flex flex-col-reverse gap-4 sm:mt-20 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-subtle">
          © {year} {profile.name}. Designed and engineered in {profile.city}.
        </p>
        <FooterActions />
      </div>

      {/* Sized in container units so the wordmark always spans the content width. */}
      <div aria-hidden className="container-page mt-6 select-none sm:mt-8">
        <p className="footer-wordmark [container-type:inline-size]">
          <span className="block translate-y-[0.2em] text-[18.4cqw] leading-[0.78] font-semibold tracking-[-0.065em] whitespace-nowrap">
            {[...profile.name].map((ch, i) => (
              <span key={i} className="inline-block">
                {ch === ' ' ? '\u00a0' : ch}
              </span>
            ))}
          </span>
        </p>
      </div>
    </footer>
  );
}
