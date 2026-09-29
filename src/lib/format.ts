/** Utilitários de formatação (portados de bundle.js). Puros, rodam no servidor e no cliente. */

export const MESES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
] as const;

export const FUSO = 'America/Sao_Paulo';

export function pad(n: number): string {
  return (n < 10 ? '0' : '') + n;
}

/** Date no fuso de Brasília (-03:00) a partir de AAAA-MM-DD + HH:MM. */
export function emBrasilia(data: string, hhmm: string): Date {
  return new Date(`${data}T${hhmm}:00-03:00`);
}

function minutos(hhmm: string): number {
  return Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));
}

/** Duração legível: "30min", "1h", "2h30". */
export function duracao(inicio: string, fim: string): string {
  const m = minutos(fim) - minutos(inicio);
  if (m < 60) return `${m}min`;
  const resto = m % 60;
  return `${Math.floor(m / 60)}h${resto ? pad(resto) : ''}`;
}

/** "2026-10-06" → "06/10/2026". */
export function dataBR(data: string): string {
  return data.split('-').reverse().join('/');
}

/** "2026-10-06" → "06/10". */
export function diaMesBR(data: string): string {
  return data.split('-').reverse().slice(0, 2).join('/');
}

/** "2026-10-06" → "6 de outubro". */
export function dataExtenso(data: string): string {
  const [, mes, dia] = data.split('-').map(Number);
  return `${dia} de ${MESES[(mes ?? 1) - 1]}`;
}

/** Hoje (AAAA-MM-DD) no fuso de Brasília. */
export function hojeEmBrasilia(agora: Date): string {
  return agora.toLocaleDateString('sv', { timeZone: FUSO });
}

/** Iniciais para o avatar sem foto (ignora "da", "de"...). */
export function iniciais(nome: string): string {
  const partes = nome.split(' ').filter((w) => w.length > 2);
  const primeira = (partes[0] ?? nome).charAt(0);
  const ultima = partes.length > 1 ? (partes[partes.length - 1] ?? '').charAt(0) : '';
  return (primeira + ultima).toUpperCase();
}

/** Texto da contagem regressiva: "0d 00:00:00". */
export function contagem(alvoMs: number, agoraMs: number): string {
  const s = Math.max(0, Math.floor((alvoMs - agoraMs) / 1000));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${d}d ${pad(h)}:${pad(m)}:${pad(s % 60)}`;
}
