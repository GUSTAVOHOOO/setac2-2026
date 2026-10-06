import type { Programacao, Tipo } from './types';

/** Início oficial do evento (abertura), usado na contagem regressiva. */
export const INICIO_EVENTO = '2026-10-05T08:30:00-03:00';

export const TIPOS: Record<Tipo, string> = {
  abertura: 'Abertura',
  coffee: 'Coffee',
  palestra: 'Palestra',
  intervalo: 'Intervalo',
  minicurso: 'Minicurso',
  competicao: 'Competição',
  jogos: 'Jogos',
};

/** Ícone 16px por tipo (em /public/icons ou /public/marca). */
export const ICONES_TIPO: Record<Tipo, string> = {
  abertura: '/marca/setac2-pixel.svg',
  coffee: '/icons/cafe.svg',
  palestra: '/icons/megafone.svg',
  intervalo: '/icons/ampulheta.svg',
  minicurso: '/icons/disquete.svg',
  competicao: '/icons/trofeu.svg',
  jogos: '/icons/controle.svg',
};

/**
 * Programação oficial (planilha Programacao_SETAC_2026).
 * Horários podem ser ajustados pela organização. O campo `palestra` usa os ids de `palestras.ts`;
 * `inscricao` liga atividades sem card (competição, corujão) ao link em `inscricoes.ts`.
 */
export const PROGRAMACAO: Programacao = {
  evento: 'Setac² 2026',
  obs: 'Horários, temas, responsáveis e locais podem ser ajustados conforme as confirmações da organização.',
  dias: [
    {
      id: 'd1',
      data: '2026-10-05',
      rotulo: 'Seg 05/10',
      itens: [
        {
          periodo: 'Manhã',
          inicio: '08:30',
          fim: '09:00',
          tipo: 'abertura',
          titulo: 'Abertura oficial',
          desc: 'Boas-vindas e apresentação da programação',
        },
        {
          periodo: 'Manhã',
          inicio: '09:00',
          fim: '09:30',
          tipo: 'coffee',
          titulo: 'Coffee de recepção',
          desc: 'Café da manhã e integração dos participantes',
        },
        {
          periodo: 'Manhã',
          inicio: '09:30',
          fim: '11:00',
          tipo: 'palestra',
          palestra: 'direito-digital',
          titulo: 'Palestra de abertura',
          desc: 'Direito Digital, Crimes Cibernéticos e Responsabilidade Legal na Computação',
          quem: 'Jurista Leticia Remonti',
        },
        {
          periodo: 'Manhã',
          inicio: '11:00',
          fim: '12:30',
          tipo: 'palestra',
          palestra: 'cyber-veiculos',
          titulo: 'Palestra de abertura',
          desc: 'Expert em cybersecurity: experiências trabalhando com detecção de ataques em veículos autônomos',
          quem: 'Dra. Isadora Ferrão',
        },
        {
          periodo: 'Almoço',
          inicio: '12:30',
          fim: '13:30',
          tipo: 'intervalo',
          titulo: 'Intervalo para almoço',
          desc: 'Almoço na UTFPR ou arredores',
        },
        {
          periodo: 'Tarde',
          inicio: '13:30',
          fim: '16:00',
          tipo: 'minicurso',
          palestra: 'aws',
          titulo: 'Minicurso 1',
          desc: 'Preparatório AWS Cloud Practitioner (CLF-C02)',
          quem: 'Gabriel Lima Scheffler e Wellington Ferreira',
        },
        {
          periodo: 'Tarde',
          inicio: '16:00',
          fim: '16:30',
          tipo: 'coffee',
          titulo: 'Coffee break',
          desc: 'Intervalo e integração',
        },
        {
          periodo: 'Tarde/Noite',
          inicio: '16:30',
          fim: '19:30',
          tipo: 'competicao',
          inscricao: 'competicao',
          titulo: 'Competição de programação',
          desc: 'Desafios no estilo LeetCode',
        },
      ],
    },
    {
      id: 'd2',
      data: '2026-10-06',
      rotulo: 'Ter 06/10',
      itens: [
        {
          periodo: 'Manhã',
          inicio: '08:30',
          fim: '09:00',
          tipo: 'coffee',
          titulo: 'Coffee de recepção',
          desc: 'Café da manhã e recepção dos participantes',
        },
        {
          periodo: 'Manhã',
          inicio: '09:00',
          fim: '09:15',
          tipo: 'abertura',
          titulo: 'Abertura do segundo dia',
          desc: 'Avisos e apresentação das atividades do dia',
        },
        {
          periodo: 'Manhã',
          inicio: '09:15',
          fim: '12:00',
          tipo: 'palestra',
          palestra: 'erasmus',
          titulo: 'Palestra 2',
          desc: 'A dupla diplomação na Universidade Politécnica de Bragança (UPB) e o programa Erasmus de viagens para estudantes internacionais',
        },
        {
          periodo: 'Almoço',
          inicio: '12:00',
          fim: '13:30',
          tipo: 'intervalo',
          titulo: 'Intervalo para almoço',
          desc: 'Almoço na UTFPR ou arredores',
        },
        {
          periodo: 'Tarde',
          inicio: '13:30',
          fim: '14:30',
          tipo: 'palestra',
          palestra: 'mercado',
          titulo: 'Palestra 3',
          desc: 'Conecte-se ao Mercado: LinkedIn, Currículo e Oportunidades',
          quem: 'Gustavo Silva Quieregato',
        },
        {
          periodo: 'Tarde',
          inicio: '14:30',
          fim: '16:15',
          tipo: 'minicurso',
          palestra: 'minicurso-2',
          titulo: 'Minicurso 2',
          desc: 'LLMs e agentes de IA na prática',
          quem: 'Gustavo Mazur e Jorge Camargo',
        },
        {
          periodo: 'Tarde',
          inicio: '16:00',
          fim: '16:30',
          tipo: 'coffee',
          titulo: 'Coffee break',
          desc: 'Intervalo e preparação para o corujão',
        },
        {
          periodo: 'Noite',
          inicio: '16:30',
          fim: '22:00',
          tipo: 'jogos',
          inscricao: 'corujao',
          titulo: 'Corujão de jogos',
          desc: 'Jogos digitais e de mesa; encerramento ao final',
          local: 'Sala da Incubadora',
        },
      ],
    },
  ],
};
