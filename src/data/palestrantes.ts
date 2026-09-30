import type { Palestrante } from './types';

/**
 * Palestrantes e ministrantes por id. O id é também o nome da foto em /public/palestrantes
 * (retrato 4:5, 640×800). Sem `foto`, o site mostra as iniciais.
 */
export const PALESTRANTES: Record<string, Palestrante> = {
  'daniel-costa': {
    nome: 'Daniel Theisges da Costa',
    bio: ['Mestre em Sistemas de Informação, UPB, Portugal', 'Ciência da Computação, UTFPR-SH'],
    palestra: 'erasmus',
    foto: '/palestrantes/daniel-costa.jpg',
  },
  'adrieli-ritt': {
    nome: 'Adrieli Luisa Ritt',
    bio: ['Doutoranda na University of Florida', 'Mestre em Sustentabilidade, UTFPR-SH'],
    palestra: 'erasmus',
    foto: '/palestrantes/adrieli-ritt.jpg',
  },
  'leticia-remonti': {
    nome: 'Leticia Remonti',
    bio: ['Advogada'],
    palestra: 'direito-digital',
    foto: '/palestrantes/leticia-remonti.jpg',
  },
  'isadora-ferrao': {
    nome: 'Isadora Garcia Ferrão',
    bio: [
      'Pós-doutoranda no Lab-STICC, Université de Bretagne Occidentale (França)',
      'Doutora e mestre em Ciências de Computação (PPG-CCMC), USP São Carlos, com sanduíche na França, Inglaterra e República Tcheca',
      'Bacharela em Ciência da Computação, UNIPAMPA Alegrete, Prêmio Aluno Destaque da SBC (2018)',
      'Pesquisa safety e security em veículos aéreos autônomos',
    ],
    palestra: 'cyber-veiculos',
  },
  'gustavo-quieregato': {
    nome: 'Gustavo Silva Quieregato',
    bio: [
      'Desenvolvedor Especialista no ecossistema UOL',
      'Experiência em desenvolvimento web e inteligência artificial',
      'Aluno do programa de Dupla Diplomação',
    ],
    palestra: 'mercado',
  },
  'gabriel-scheffler': {
    nome: 'Gabriel Lima Scheffler',
    bio: ['Certificado AWS Cloud Practitioner'],
    palestra: 'aws',
    foto: '/palestrantes/gabriel-scheffler.jpg',
  },
  'welington-ferreira': {
    nome: 'Welington Ferreira',
    bio: [],
    palestra: 'aws',
    foto: '/palestrantes/welington-ferreira.jpg',
  },
};

/** Ordem de apresentação na página /palestrantes. */
export const ORDEM_PALESTRANTES: string[] = [
  'daniel-costa',
  'adrieli-ritt',
  'leticia-remonti',
  'isadora-ferrao',
  'gustavo-quieregato',
  'gabriel-scheffler',
  'welington-ferreira',
];
