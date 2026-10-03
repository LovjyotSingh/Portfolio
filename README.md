# Lovjyot Singh · Portfolio

Personal site for Lovjyot Singh, a full-stack engineer. Built with Next.js 16, React 19, Tailwind CSS 4, Motion, Lenis and Yjs. One page: hero, selected work (OfferForge AI and SyncFlow, each with a live in-browser demo), about, stack and contact.

## Run

```bash
pnpm install
pnpm dev
```

`pnpm build` then `pnpm start` serves the production build. The page is statically generated.

Set `NEXT_PUBLIC_SITE_URL` (for example `https://your-domain.com`) before building so canonical URLs, the sitemap, robots.txt and Open Graph tags point at the real domain. On Vercel, `VERCEL_PROJECT_PRODUCTION_URL` is used when that variable is unset.

## Content

All copy lives in `src/content`. Name, email, phone, location and links are in `src/content/profile.ts`. The downloadable résumé is `public/Lovjyot_Singh_Resume.pdf`.

## Deploy

The app is ready for Vercel: connect the repo, leave the build command as `pnpm build`, and set `NEXT_PUBLIC_SITE_URL`.
