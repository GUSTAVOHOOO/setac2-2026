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
    linkedin: 'https://www.linkedin.com/in/danieltheisges/',
  },
  'adrieli-ritt': {
    nome: 'Adrieli Luisa Ritt',
    bio: ['Doutoranda na University of Florida', 'Mestre em Sustentabilidade, UTFPR-SH'],
    palestra: 'erasmus',
    foto: '/palestrantes/adrieli-ritt.jpg',
    linkedin: 'https://www.linkedin.com/in/adrieli-luisa-ritt-8baa11206/',
  },
  'leticia-remonti': {
    nome: 'Leticia Remonti',
    bio: [
      'Jurista',
      'Graduada em Direito pela PUCPR',
      'Pós-graduada em Direito Penal e Criminologia pela PUCRS',
    ],
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
    foto: '/palestrantes/isadora-ferrao.jpg',
    linkedin: 'https://www.linkedin.com/in/isadora-ferrao/',
  },
  'gustavo-quieregato': {
    nome: 'Gustavo Silva Quieregato',
    bio: [
      'Desenvolvedor Especialista no ecossistema UOL',
      'Experiência em desenvolvimento web e inteligência artificial',
      'Aluno do programa de Dupla Diplomação',
    ],
    palestra: 'mercado',
    foto: '/palestrantes/gustavo-quieregato.jpg',
    linkedin: 'https://www.linkedin.com/in/gustavo-silva-quieregato/',
  },
  'gabriel-scheffler': {
    nome: 'Gabriel Lima Scheffler',
    bio: ['Acadêmico de Ciência da Computação na UTFPR Santa Helena', 'Certificado AWS Cloud Practitioner'],
    palestra: 'aws',
    foto: '/palestrantes/gabriel-scheffler.jpg',
    linkedin: 'https://www.linkedin.com/in/gabriel-scheffler-781394247/',
  },
  'welington-ferreira': {
    nome: 'Wellington Ferreira',
    bio: [
      'Engenheiro de Software no LAMIA, UTFPR Santa Helena',
      'Mestrando em Computação Aplicada (Engenharia de Software), UTFPR',
      'Professor de Interação Humano-Computador na UTFPR',
    ],
    palestra: 'aws',
    foto: '/palestrantes/welington-ferreira.jpg',
    linkedin: 'https://www.linkedin.com/in/wellingtondesf/',
  },
  'gustavo-mazur': {
    nome: 'Gustavo Mazur',
    bio: [
      'Cofundador, Head de Produto e desenvolvedor full stack na TraceFarm',
      'Estudante de Ciência da Computação na UTFPR Santa Helena',
      'Atua com agentes de IA, automação e engenharia de software',
      'Presidente do Centro Acadêmico de Ciência da Computação da UTFPR-SH; três colocações em hackathons',
      'Desenvolvedor do site da Setac² 2026',
    ],
    palestra: 'minicurso-2',
    foto: '/palestrantes/gustavo.png',
    linkedin: 'https://www.linkedin.com/in/gustavo-mazur-a55863325/?isSelfProfile=true',
  },
  'jorge-camargo': {
    nome: 'Jorge Camargo',
    bio: [
      'Desenvolvedor full stack e estudante de Ciência da Computação na UTFPR',
      'Técnico formado em Análise de Sistemas',
      'Experiência com JavaScript, TypeScript, Node.js, Flutter, Python e MySQL',
      'Focado em desenvolvimento de software, aprendizado contínuo e boas práticas',
    ],
    palestra: 'minicurso-2',
    foto: '/palestrantes/jorge.png',
    linkedin: 'https://www.linkedin.com/in/jorge-camargo-51222a272/',
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
  'gustavo-mazur',
  'jorge-camargo',
];
