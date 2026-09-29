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
  'gustavo-quieregato': {
    nome: 'Gustavo Silva Quieregato',
    bio: [],
    palestra: 'mercado',
  },
  'gabriel-scheffler': {
    nome: 'Gabriel Lima Scheffler',
    bio: [],
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
  'gustavo-quieregato',
  'gabriel-scheffler',
  'welington-ferreira',
];
