'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Deixa uma .w98-window arrastável pela barra de título (porte de Setac.draggable).
 * Só com ponteiro fino (mouse); no toque e em telas ≤ 640px a janela fica no fluxo.
 */
export function useDraggable(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const win = ref.current;
    const bar = win?.querySelector<HTMLElement>('.w98-titlebar');
    if (!win || !bar) return;
    const podeArrastar = window.matchMedia('(pointer: fine) and (min-width: 641px)');

    let sx = 0;
    let sy = 0;
    let ox = 0;
    let oy = 0;

    const move = (ev: PointerEvent) => {
      win.style.left = `${ox + ev.clientX - sx}px`;
      win.style.top = `${oy + ev.clientY - sy}px`;
    };
    const up = () => {
      bar.removeEventListener('pointermove', move);
      bar.removeEventListener('pointerup', up);
      bar.removeEventListener('pointercancel', up);
    };
    const down = (e: PointerEvent) => {
      if (!podeArrastar.matches || e.button !== 0) return;
      if ((e.target as HTMLElement).closest('button, a')) return;
      sx = e.clientX;
      sy = e.clientY;
      ox = win.offsetLeft;
      oy = win.offsetTop;
      win.style.position = 'absolute';
      win.style.left = `${ox}px`;
      win.style.top = `${oy}px`;
      win.style.zIndex = 'var(--z-window)';
      bar.setPointerCapture(e.pointerId);
      bar.addEventListener('pointermove', move);
      bar.addEventListener('pointerup', up);
      bar.addEventListener('pointercancel', up);
    };
    /* Voltou para o celular: devolve a janela ao fluxo. */
    const reset = () => {
      if (!podeArrastar.matches) win.style.removeProperty('position');
    };

    bar.addEventListener('pointerdown', down);
    podeArrastar.addEventListener('change', reset);
    return () => {
      up();
      bar.removeEventListener('pointerdown', down);
      podeArrastar.removeEventListener('change', reset);
    };
  }, [ref]);
}
