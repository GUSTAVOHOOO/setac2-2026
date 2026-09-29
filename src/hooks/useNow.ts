'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Hora atual arredondada para `passoMs`, atualizada a cada passo.
 * No servidor (e durante a hidratação) retorna `null`, então o HTML estático nunca
 * "congela" um horário de build; o cliente preenche logo em seguida.
 */
export function useNow(passoMs: number): Date | null {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const id = window.setInterval(onChange, Math.min(passoMs, 1000));
      return () => window.clearInterval(id);
    },
    [passoMs],
  );
  const getSnapshot = useCallback(() => Math.floor(Date.now() / passoMs), [passoMs]);
  const tick = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return tick === null ? null : new Date(tick * passoMs);
}

function getServerSnapshot(): null {
  return null;
}
