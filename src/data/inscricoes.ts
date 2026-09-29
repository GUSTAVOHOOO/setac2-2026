import type { PalestraId } from './types';

/**
 * LINKS DE INSCRIÇÃO (Google Forms), um por palestra/minicurso.
 *
 * Cole o link do formulário entre aspas no lugar de `undefined`, por exemplo:
 *   aws: 'https://forms.gle/XXXXXXXXXXXX',
 *
 * - Com link: o card mostra o botão "Inscrever-se" (abre o formulário em nova aba).
 * - Sem link (`undefined`): o card mostra "Inscrições em breve", desabilitado.
 * - Só links https:// são aceitos; qualquer outra coisa é tratada como "em breve".
 *
 * Todo id precisa estar aqui (o TypeScript reclama se faltar algum).
 */
export const INSCRICOES: Record<PalestraId, string | undefined> = {
  // Palestras
  'direito-digital': undefined, // TODO: link do Forms
  'cyber-veiculos': undefined, // TODO: link do Forms
  erasmus: undefined, // TODO: link do Forms
  mercado: undefined, // TODO: link do Forms

  // Minicursos
  aws: undefined, // TODO: link do Forms
  'minicurso-2': undefined, // TODO: link do Forms
};
