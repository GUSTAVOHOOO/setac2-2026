import type { Metadata, Viewport } from 'next';
import { Pixelify_Sans, VT323 } from 'next/font/google';
import { OsProvider } from '@/components/os/OsProvider';
import { Taskbar } from '@/components/win98/Taskbar';
import { SITE } from '@/lib/site';
import '@/styles/tokens.css';
import '@/styles/bundle.css';
import '@/styles/site.css';

/* As fontes viram as variáveis --font-pixelify / --font-vt323, ligadas aos tokens em site.css. */
const pixelify = Pixelify_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-pixelify',
  display: 'swap',
});
const vt323 = VT323({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  variable: '--font-vt323',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.nomeCompleto,
    template: `%s | ${SITE.nome}`,
  },
  description: SITE.descricao,
  applicationName: SITE.nome,
  keywords: ['Setac', 'UTFPR', 'Santa Helena', 'Ciência da Computação', 'semana acadêmica'],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: SITE.nome,
    title: SITE.nomeCompleto,
    description: SITE.descricao,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.nomeCompleto,
    description: SITE.descricao,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#008080',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${pixelify.variable} ${vt323.variable}`}>
      <body className="w98 w98-desktop">
        <a className="site-skip" href="#conteudo">
          Pular para o conteúdo
        </a>
        <OsProvider>
          <main id="conteudo" className="site-main">
            {children}
          </main>
          <Taskbar />
        </OsProvider>
      </body>
    </html>
  );
}
