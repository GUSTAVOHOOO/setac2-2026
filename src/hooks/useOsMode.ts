'use client';

import { useSyncExternalStore } from 'react';

/** Mesmo corte do design system: mouse e tela larga = desktop 98 com janelas pop-up. */
const QUERY = '(pointer: fine) and (min-width: 641px)';

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

/** `true` no PC (janelas pop-up); `false` no celular/toque e no servidor (páginas normais). */
export function useOsMode(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
