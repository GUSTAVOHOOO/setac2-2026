import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPalestra, isPalestraId, listarMinicursos, listarPalestras } from './event';
import { dataBR } from './format';
import { pageMetadata } from './metadata';

/** Helpers compartilhados por /palestras/[id] e /minicursos/[id]. */

export function paramsDe(tipo: 'palestra' | 'minicurso') {
  const itens = tipo === 'minicurso' ? listarMinicursos() : listarPalestras();
  return itens.map((p) => ({ id: p.id }));
}

/** Resolve o id garantindo que é do tipo certo; senão, 404. */
export function resolver(id: string, tipo: 'palestra' | 'minicurso') {
  if (!isPalestraId(id)) notFound();
  const p = getPalestra(id);
  if (p.mini !== (tipo === 'minicurso')) notFound();
  return p;
}

export function metadataDe(id: string, tipo: 'palestra' | 'minicurso'): Metadata {
  if (!isPalestraId(id)) return {};
  const p = getPalestra(id);
  if (p.mini !== (tipo === 'minicurso')) return {};
  const title = `${p.rotulo}: ${p.titulo}`;
  const description =
    p.resumo[0] ??
    `${p.rotulo} da Setac² 2026 em ${dataBR(p.data)}, ${p.inicio} às ${p.fim}, ${p.local ?? 'local a confirmar'}, UTFPR Santa Helena.`;
  const path = `/${tipo === 'minicurso' ? 'minicursos' : 'palestras'}/${id}`;
  return pageMetadata({ title, description, path, type: 'article' });
}
