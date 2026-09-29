import type { Metadata } from 'next';
import { SITE } from './site';

/** Imagem de compartilhamento gerada em src/app/opengraph-image.tsx. */
const OG_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'Setac² 2026 · Semana Acadêmica · UTFPR Santa Helena',
};

/**
 * Metadata de uma página. Monta title, description, canonical, Open Graph e Twitter juntos,
 * porque no Next um `openGraph` na página substitui (não mescla) o do layout.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = 'website',
}: {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
}): Metadata {
  const ogTitle = `${title} | ${SITE.nome}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: 'pt_BR',
      siteName: SITE.nome,
      title: ogTitle,
      description,
      url: path,
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
