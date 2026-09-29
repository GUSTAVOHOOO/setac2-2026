'use client';

import { contagem } from '@/lib/format';
import { useNow } from './useNow';

/** Contagem regressiva (porte de Setac.countdown): "Xd HH:MM:SS", ou null antes de montar. */
export function useCountdown(alvo: Date | string | number): string | null {
  const agora = useNow(1000);
  return agora ? contagem(new Date(alvo).getTime(), agora.getTime()) : null;
}
