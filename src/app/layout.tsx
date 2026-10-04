import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { Providers } from '@/components/providers/providers';
import { CommandPalette } from '@/components/ui/command-palette';
import { profile } from '@/content/profile';
import { THEME_COLORS, themeBootScript } from '@/lib/theme';
import { cn, siteUrl } from '@/lib/utils';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  variable: '--font-instrument',
});

const title = `${profile.name} · ${profile.role}`;
const description =
  'Full-stack engineer building real-time and AI-powered products with React, Next.js, Node.js and MongoDB. Creator of OfferForge AI and SyncFlow, both live.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: title, template: `%s · ${profile.name}` },
  description,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: siteUrl() }],
  creator: profile.name,
  keywords: [
    profile.name,
    'Full-Stack Engineer',
    'Software Engineer',
    'React',
    'Next.js',
    'Node.js',
    'TypeScript',
    'MongoDB',
    'Socket.io',
    'Yjs',
    'CRDT',
    'Real-time collaboration',
    'Faridabad',
    'Haryana',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    firstName: profile.firstName,
    lastName: profile.lastName,
    url: '/',
    siteName: profile.name,
    title,
    description,
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image', title, description },
  robots: { index: true, follow: true },
  category: 'technology',
};

export const viewport: Viewport = {
  themeColor: THEME_COLORS.dark,
  colorScheme: 'dark light',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={cn(geist.variable, geistMono.variable, instrumentSerif.variable)}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="fixed top-3 left-3 z-[100] -translate-y-[200%] rounded-full bg-fg px-4 py-2.5 text-sm font-medium text-bg shadow-float transition-transform duration-300 focus-visible:translate-y-0"
        >
          Skip to content
        </a>
        <Providers>
          <SiteHeader />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <SiteFooter />
          <CommandPalette />
        </Providers>
      </body>
    </html>
  );
}
