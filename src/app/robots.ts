import type { MetadataRoute } from 'next';

import { site_url } from 'site-config';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${site_url}/sitemap.xml`,
    host: site_url,
  };
}
