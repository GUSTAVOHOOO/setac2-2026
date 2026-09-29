'use client';

import { useRef } from 'react';
import { useDraggable } from '@/hooks/useDraggable';
import { Window, type WindowProps } from './Window';

/** Window que arrasta pela barra de título no desktop (mouse); no celular fica no fluxo. */
export function DraggableWindow(props: Omit<WindowProps, 'ref'>) {
  const ref = useRef<HTMLElement>(null);
  useDraggable(ref);
  return <Window {...props} ref={ref} />;
}
