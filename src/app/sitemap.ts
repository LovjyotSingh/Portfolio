import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/utils';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl(),
      lastModified: new Date('2026-10-03'),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
