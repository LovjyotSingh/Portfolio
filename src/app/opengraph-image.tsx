import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { profile } from '@/content/profile';

export const alt = `${profile.name}, full-stack engineer. OfferForge AI and SyncFlow.`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const geist = await readFile(join(process.cwd(), 'src/assets/fonts/Geist-SemiBold.ttf'));
const instrument = await readFile(join(process.cwd(), 'src/assets/fonts/InstrumentSerif-Italic.ttf'));

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#0b0a09',
        color: '#f3eee6',
        padding: '68px 76px',
        fontFamily: 'Geist',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 22,
          letterSpacing: 3,
          textTransform: 'uppercase',
          color: '#a7a095',
        }}
      >
        <span>Full-stack engineer</span>
        <span style={{ color: '#ff6b35' }}>Open to work</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', fontSize: 148, fontWeight: 600, letterSpacing: -8, lineHeight: 0.86 }}>
        <span>{profile.firstName}</span>
        <span>
          {profile.lastName}
          <span style={{ color: '#ff6b35' }}>.</span>
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', fontSize: 40 }}>
          <span style={{ fontFamily: 'Instrument Serif', fontStyle: 'italic', color: '#ff7d4a' }}>OfferForge AI</span>
          <span style={{ margin: '0 18px', color: '#736d64' }}>·</span>
          <span style={{ fontFamily: 'Instrument Serif', fontStyle: 'italic' }}>SyncFlow</span>
        </div>
        <span style={{ fontSize: 24, color: '#a7a095' }}>Delhi NCR</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Geist', data: geist, style: 'normal', weight: 600 },
        { name: 'Instrument Serif', data: instrument, style: 'italic', weight: 400 },
      ],
    },
  );
}
