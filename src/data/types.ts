/**
 * Tipos dos dados do evento. Derivados de `setac2-design-system/components/index.d.ts`
 * (namespace `Setac`), com `inscricaoUrl` adicionado em `Palestra`.
 */

export type Tipo =
  'abertura' | 'coffee' | 'palestra' | 'intervalo' | 'minicurso' | 'competicao' | 'jogos';

export interface Atividade {
  /** id em PALESTRAS: liga a linha da programação ao card da palestra/minicurso. */
  palestra?: PalestraId;
  /** Atividade sem card mas com inscrição própria (id em INSCRICOES_ATIVIDADES). */
  inscricao?: AtividadeInscricaoId;
  periodo: string;
  /** HH:MM (horário de Brasília). */
  inicio: string;
  fim: string;
  tipo: Tipo;
  titulo: string;
  desc: string;
  quem?: string;
  aDefinir?: boolean;
}

export interface Dia {
  id: string;
  /** AAAA-MM-DD */
  data: string;
  rotulo: string;
  itens: Atividade[];
}

export interface Programacao {
  evento: string;
  obs: string;
  dias: Dia[];
}

export interface Palestrante {
  nome: string;
  bio: string[];
  /** id em PALESTRAS. */
  palestra?: PalestraId;
  /** Caminho em /public (ex.: '/palestrantes/daniel-costa.jpg'). Sem foto: iniciais. */
  foto?: string;
  /** Perfil público no LinkedIn (URL completa). Sem link: o botão não aparece. */
  linkedin?: string;
}

export interface Palestra {
  tipo?: 'palestra' | 'minicurso';
  aDefinir?: boolean;
  rotulo: string;
  titulo: string;
  chamada?: string;
  resumo: string[];
  /** AAAA-MM-DD */
  data: string;
  inicio: string;
  fim: string;
  /** Sem local: "A confirmar". */
  local?: string;
  /** ids em PALESTRANTES. */
  palestrantes: string[];
  /**
   * Link do Google Forms de inscrição. Prefira preencher em `src/data/inscricoes.ts`;
   * `getPalestra()` (src/lib/event.ts) junta os dois.
   */
  inscricaoUrl?: string;
}

/**
 * Todos os ids de palestra/minicurso. Para criar uma atividade nova, adicione o id aqui,
 * a entrada em `palestras.ts` e o slot em `inscricoes.ts` (o TypeScript avisa se faltar).
 */
export const PALESTRA_IDS = [
  'direito-digital',
  'cyber-veiculos',
  'erasmus',
  'mercado',
  'aws',
  'minicurso-2',
] as const;

export type PalestraId = (typeof PALESTRA_IDS)[number];

/** Atividades da programação que não têm card, mas têm inscrição (Google Forms). */
export const ATIVIDADE_INSCRICAO_IDS = ['competicao', 'corujao'] as const;

export type AtividadeInscricaoId = (typeof ATIVIDADE_INSCRICAO_IDS)[number];
