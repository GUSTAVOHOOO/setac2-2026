import type { AtividadeInscricaoId, PalestraId } from './types';

/**
 * LINKS DE INSCRIÇÃO (Google Forms), um por palestra/minicurso
 * (planilha Programacao_SETAC_2026, coluna "Link do Formulário de Inscrição").
 *
 * - Com link: o card mostra o botão "Inscrever-se" (abre o formulário em nova aba).
 * - Sem link (`undefined`): o card mostra "Inscrições em breve".
 * - Só links https:// são aceitos; qualquer outra coisa é tratada como "em breve".
 *
 * Todo id precisa estar aqui (o TypeScript reclama se faltar algum).
 */
export const INSCRICOES: Record<PalestraId, string | undefined> = {
  // Palestras
  'direito-digital': 'https://forms.gle/LhmYtiBcJKLQCMjL7',
  'cyber-veiculos': 'https://forms.gle/91izeE5JqQsJ4DpN6',
  erasmus: 'https://forms.gle/5vhhL4SncHJZs4iP7',
  mercado: 'https://forms.gle/rqjtZW7ZmaEKtfBf7',

  // Minicursos
  aws: 'https://forms.gle/J7p4Uh49yLVGmUVm8',
  // A definir: formulário pronto (https://forms.gle/97cAe3KA1jGADMxx7), abre quando o tema sair.
  'minicurso-2': undefined,
};

/** Atividades da programação sem card (campo `inscricao` em `programacao.ts`). */
export const INSCRICOES_ATIVIDADES: Record<AtividadeInscricaoId, string | undefined> = {
  competicao: 'https://forms.gle/SFG2hnYM9yxhj7ug6',
  corujao: 'https://forms.gle/UaLTz3kGKQSsnVuK7',
};
