/** Informações gerais do site e navegação (menu Iniciar, ícones do desktop). */

export const SITE = {
  nome: 'Setac² 2026',
  nomeCompleto: 'Setac² 2026 · XIII Semana Tecnológica Acadêmica de Ciência da Computação',
  descricao:
    'XIII Semana Tecnológica Acadêmica de Ciência da Computação da UTFPR Santa Helena: palestras, minicursos, competição de programação e corujão de jogos, 05 e 06/10/2026.',
  local: 'UTFPR Santa Helena',
  /**
   * URL pública. Na Vercel usa o domínio de produção automaticamente; defina
   * NEXT_PUBLIC_SITE_URL se tiver domínio próprio.
   */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000'),
  comoChegar: 'https://www.google.com/maps/search/?api=1&query=UTFPR+Santa+Helena',
} as const;

export interface NavItem {
  href: string;
  /** Rótulo com a letra de atalho entre colchetes: "[P]rogramação". */
  rotulo: string;
  /** Nome de "arquivo" usado no desktop e na barra de tarefas. */
  arquivo: string;
  icone: string;
  externo?: boolean;
}

export const NAV: NavItem[] = [
  { href: '/', rotulo: '[I]nício', arquivo: 'Setac² 2026.exe', icone: '/marca/setac2-pixel.svg' },
  {
    href: '/programacao',
    rotulo: '[P]rogramação',
    arquivo: 'Programação.exe',
    icone: '/icons/calendario.svg',
  },
  { href: '/palestras', rotulo: 'P[a]lestras', arquivo: 'Palestras', icone: '/icons/megafone.svg' },
  {
    href: '/minicursos',
    rotulo: '[M]inicursos',
    arquivo: 'Minicursos',
    icone: '/icons/disquete.svg',
  },
  {
    href: '/palestrantes',
    rotulo: 'Pal[e]strantes',
    arquivo: 'Palestrantes',
    icone: '/icons/equipe.svg',
  },
  {
    href: '/#inscricao',
    rotulo: 'I[n]scrição',
    arquivo: 'Inscrição.txt',
    icone: '/icons/documento.svg',
  },
  {
    href: SITE.comoChegar,
    rotulo: 'Como [c]hegar',
    arquivo: 'Como chegar',
    icone: '/icons/globo.svg',
    externo: true,
  },
];
