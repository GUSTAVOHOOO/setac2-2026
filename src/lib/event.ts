import { INSCRICOES } from '@/data/inscricoes';
import { PALESTRANTES } from '@/data/palestrantes';
import { PALESTRAS } from '@/data/palestras';
import { PALESTRA_IDS, type Palestra, type PalestraId, type Palestrante } from '@/data/types';

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
