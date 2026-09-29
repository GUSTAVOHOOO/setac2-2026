import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

/* Gerada no build (estática): logo oficial sobre brand-ink, como manda o design system. */
export const alt = 'Setac² 2026 · Semana Acadêmica · UTFPR Santa Helena';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const logo = await readFile(join(process.cwd(), 'public/marca/setac2-logo.png'), 'base64');

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
        background: '#000000',
        color: '#f5c802',
        borderBottom: '24px solid #008080',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`data:image/png;base64,${logo}`} width={640} height={442} alt="" />
      <div style={{ fontSize: 40, display: 'flex' }}>05 e 06/10/2026 · UTFPR Santa Helena</div>
    </div>,
    size,
  );
}
