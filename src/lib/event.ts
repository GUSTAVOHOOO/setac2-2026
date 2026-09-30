import { INSCRICOES, INSCRICOES_ATIVIDADES } from '@/data/inscricoes';
import { PALESTRANTES } from '@/data/palestrantes';
import { PALESTRAS } from '@/data/palestras';
import { ICONES_TIPO, PROGRAMACAO } from '@/data/programacao';
import {
  PALESTRA_IDS,
  type AtividadeInscricaoId,
  type Palestra,
  type PalestraId,
  type Palestrante,
} from '@/data/types';

/** Palestra com o link de inscrição já resolvido. */
export interface PalestraResolvida extends Palestra {
  id: PalestraId;
  mini: boolean;
}

export function isPalestraId(id: string): id is PalestraId {
  return (PALESTRA_IDS as readonly string[]).includes(id);
}

/** Aceita só https:// (evita javascript: e afins colados por engano). */
function urlValida(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const u = new URL(url.trim());
    return u.protocol === 'https:' ? u.toString() : undefined;
  } catch {
    return undefined;
  }
}

export function getPalestra(id: PalestraId): PalestraResolvida {
  const p = PALESTRAS[id];
  return {
    ...p,
    id,
    mini: p.tipo === 'minicurso',
    inscricaoUrl: urlValida(INSCRICOES[id] ?? p.inscricaoUrl),
  };
}

/** Link de inscrição de uma atividade sem card (competição, corujão). */
export function inscricaoAtividade(id: AtividadeInscricaoId): string | undefined {
  return urlValida(INSCRICOES_ATIVIDADES[id]);
}

/** Uma linha da janela Inscrição.txt. */
export interface ItemInscricao {
  key: string;
  nome: string;
  icone: string;
  /** Card da atividade (só palestras e minicursos). */
  href?: string;
  /** AAAA-MM-DD */
  data: string;
  inicio: string;
  url?: string;
}

/** Tudo que tem inscrição, na ordem da programação. */
export function listarInscricoes(): ItemInscricao[] {
  return PROGRAMACAO.dias.flatMap((dia) =>
    dia.itens.flatMap((it): ItemInscricao[] => {
      if (it.palestra) {
        const p = getPalestra(it.palestra);
        return [
          {
            key: p.id,
            nome: `${p.rotulo}: ${p.titulo}`,
            icone: ICONES_TIPO[p.mini ? 'minicurso' : 'palestra'],
            href: hrefPalestra(p.id),
            data: p.data,
            inicio: p.inicio,
            url: p.inscricaoUrl,
          },
        ];
      }
      if (it.inscricao) {
        return [
          {
            key: it.inscricao,
            nome: it.titulo,
            icone: ICONES_TIPO[it.tipo],
            data: dia.data,
            inicio: it.inicio,
            url: inscricaoAtividade(it.inscricao),
          },
        ];
      }
      return [];
    }),
  );
}

export function listarPalestras(): PalestraResolvida[] {
  return PALESTRA_IDS.map(getPalestra).filter((p) => !p.mini);
}

export function listarMinicursos(): PalestraResolvida[] {
  return PALESTRA_IDS.map(getPalestra).filter((p) => p.mini);
}

/** Rota do card: /palestras/[id] ou /minicursos/[id]. */
export function hrefPalestra(id: PalestraId): string {
  return `${PALESTRAS[id].tipo === 'minicurso' ? '/minicursos' : '/palestras'}/${id}`;
}

export interface PalestranteResolvido extends Palestrante {
  id: string;
}

export function getPalestrante(id: string): PalestranteResolvido {
  return { id, ...(PALESTRANTES[id] ?? { nome: id, bio: [] }) };
}
