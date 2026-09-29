import type { Palestra, PalestraId } from './types';

/**
 * Palestras e minicursos por id. Os mesmos ids aparecem em `programacao.ts` (campo `palestra`)
 * e em `palestrantes.ts` (campo `palestra`). Minicursos usam `tipo: 'minicurso'`.
 * Sem `local` → "A confirmar". Sem `resumo` → "Resumo em breve".
 *
 * Links de inscrição (Google Forms) ficam em `inscricoes.ts`.
 */
export const PALESTRAS: Record<PalestraId, Palestra> = {
  'direito-digital': {
    rotulo: 'Palestra de abertura',
    titulo: 'Direito Digital, Crimes Cibernéticos e Responsabilidade Legal na Computação',
    data: '2026-10-05',
    inicio: '09:30',
    fim: '10:30',
    local: 'Auditório Daniel Blanco',
    palestrantes: ['leticia-remonti'],
    resumo: [],
  },
  'cyber-veiculos': {
    rotulo: 'Palestra de abertura',
    titulo:
      'Expert em cybersecurity: experiências trabalhando com detecção de ataques em veículos autônomos',
    data: '2026-10-05',
    inicio: '10:30',
    fim: '12:00',
    local: 'Auditório Daniel Blanco',
    palestrantes: [],
    resumo: [],
  },
  erasmus: {
    rotulo: 'Palestra 2',
    titulo:
      'Dupla Diplomação na Universidade Politécnica de Bragança (UPB) e oportunidades internacionais pelo programa Erasmus+',
    data: '2026-10-06',
    inicio: '09:15',
    fim: '12:00',
    local: 'Auditório Daniel Blanco',
    palestrantes: ['daniel-costa', 'adrieli-ritt'],
    chamada: 'Mais do que um relato de experiência,',
    resumo: [
      'a palestra pretende orientar interessados em DD (Dupla Diplomação) com dicas importantes sobre a vida universitária e pessoal em Bragança e a vivência na cidade. Mostram-se com imagens o ambiente, a estrutura, recursos técnico-científicos e um pouco da cultura da instituição e da cidade de Bragança e seus arredores.',
      'Ainda, fala-se sobre como funciona o programa Erasmus+, que é uma oportunidade para estudantes internacionais viajarem pelos países da União Europeia, conhecerem novas culturas e envolverem-se em ações internacionais, com despesas reembolsáveis. Cumpridas as obrigações da dupla diplomação, os estudantes podem participar do Erasmus+, como fizeram os palestrantes.',
    ],
  },
  mercado: {
    rotulo: 'Palestra 3',
    titulo: 'Conecte-se ao Mercado: LinkedIn, Currículo e Oportunidades',
    data: '2026-10-06',
    inicio: '13:30',
    fim: '14:30',
    local: 'Auditório Daniel Blanco',
    palestrantes: ['gustavo-quieregato'],
    resumo: [],
  },
  aws: {
    tipo: 'minicurso',
    rotulo: 'Minicurso 1',
    titulo: 'Introdução AWS',
    data: '2026-10-05',
    inicio: '13:30',
    fim: '16:00',
    palestrantes: ['gabriel-scheffler', 'welington-ferreira'],
    resumo: [],
  },
  'minicurso-2': {
    tipo: 'minicurso',
    rotulo: 'Minicurso 2',
    titulo: 'Tema a definir',
    aDefinir: true,
    data: '2026-10-06',
    inicio: '14:30',
    fim: '16:30',
    palestrantes: [],
    resumo: [],
  },
};
