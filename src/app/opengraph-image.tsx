import { ImageResponse } from 'next/og';

import { site_description, site_title } from 'site-config';

export const dynamic = 'force-static';
export const alt = site_title;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 50%, #93c5fd 100%)',
          color: '#f8fafc',
          padding: '56px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            letterSpacing: 4,
            textTransform: 'uppercase',
            opacity: 0.9,
          }}
        >
          devya.sh
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            maxWidth: '80%',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.05,
            }}
          >
            {site_title}
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 30,
              lineHeight: 1.3,
              opacity: 0.9,
            }}
          >
            {site_description}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
