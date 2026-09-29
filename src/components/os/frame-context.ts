'use client';

import { createContext, useContext, type PointerEvent } from 'react';

/**
 * O que uma janela pop-up do "sistema" (PC) passa para o `Window` de dentro dela:
 * estado de foco e os botões da barra de título funcionando de verdade.
 * Fora de um pop-up o valor é `null` e o `Window` se comporta como sempre.
 */
export interface FrameControls {
  active: boolean;
  maximized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onTitlePointerDown: (e: PointerEvent<HTMLElement>) => void;
}

export const FrameContext = createContext<FrameControls | null>(null);

export function useFrame() {
  return useContext(FrameContext);
}
