'use client';

import { pad } from '@/lib/format';
import { useNow } from './useNow';

/** Relógio da bandeja (porte de Setac.clock): "HH:MM" no horário local, ou null antes de montar. */
export function useClock(): string | null {
  const agora = useNow(10_000);
  return agora ? `${pad(agora.getHours())}:${pad(agora.getMinutes())}` : null;
}
