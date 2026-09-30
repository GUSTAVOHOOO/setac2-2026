/*
 * Animações no jeito do Windows 9x: nada de fade ou escala suave. Tudo anda em degraus
 * (steps), como o PC redesenhando a tela. Só Web Animations API; ninguém mexe na geometria
 * real das janelas, e com "reduzir movimento" nada disso roda.
 */

export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function reducedMotion(): boolean {
  return (
    typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** Retângulo visível de um elemento, ou `null` se ele não aparece na tela. */
export function rectOf(el: Element | null | undefined): Rect | null {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width <= 0 || r.height <= 0) return null;
  return { left: r.left, top: r.top, width: r.width, height: r.height };
}

/** Prende o retângulo dentro da janela do navegador (a animação nunca sai da tela). */
function clampToViewport(r: Rect): Rect {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const top = Math.min(Math.max(r.top, 0), vh - 24);
  const left = Math.min(Math.max(r.left, 0), vw - 24);
  return {
    left,
    top,
    width: Math.max(24, Math.min(r.width, vw - left)),
    height: Math.max(20, Math.min(r.height, vh - top)),
  };
}

/**
 * O "zoom rect" do 95/98: um contorno de barra de título voa de um retângulo para outro
 * (abrir, minimizar, restaurar, maximizar). Resolve quando termina.
 */
export function zoomRect(
  from: Rect,
  to: Rect,
  { duration = 210, frames = 7 }: { duration?: number; frames?: number } = {},
): Promise<void> {
  if (reducedMotion()) return Promise.resolve();
  const a = clampToViewport(from);
  const b = clampToViewport(to);
  const ghost = document.createElement('div');
  ghost.className = 'w98-zoomrect';
  ghost.setAttribute('aria-hidden', 'true');
  document.body.appendChild(ghost);
  // A caixa inteira encolhe até virar só a barra de título, como no 98 com "mostrar conteúdo".
  const cap = (r: Rect) => Math.min(r.height, 22);
  const anim = ghost.animate(
    [
      { left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${cap(a)}px` },
      { left: `${b.left}px`, top: `${b.top}px`, width: `${b.width}px`, height: `${cap(b)}px` },
    ],
    { duration, easing: `steps(${frames}, jump-end)`, fill: 'forwards' },
  );
  return anim.finished
    .catch(() => undefined)
    .then(() => {
      ghost.remove();
    });
}

/**
 * Pinta o elemento de cima para baixo em faixas, como uma janela sendo redesenhada.
 * `delay` com `fill: backwards` deixa o elemento escondido até a vez dele.
 */
export function paintIn(
  el: Element,
  {
    delay = 0,
    duration = 140,
    frames = 5,
    from = 'top',
  }: { delay?: number; duration?: number; frames?: number; from?: 'top' | 'bottom' | 'left' } = {},
): Animation | null {
  if (reducedMotion()) return null;
  const start = {
    top: 'inset(0 0 100% 0)',
    bottom: 'inset(100% 0 0 0)',
    left: 'inset(0 100% 0 0)',
  }[from];
  return el.animate([{ clipPath: start }, { clipPath: 'inset(0 0 0 0)' }], {
    delay,
    duration,
    easing: `steps(${frames}, jump-end)`,
    fill: 'backwards',
  });
}

/** Aparece de uma vez no instante `delay` (linha de terminal sendo impressa). */
export function popIn(el: Element, delay: number): Animation | null {
  if (reducedMotion()) return null;
  return el.animate([{ visibility: 'hidden' }, { visibility: 'visible' }], {
    delay,
    duration: 1,
    fill: 'backwards',
  });
}

/** Cursor de ampulheta por um instante, como o 98 "pensando" antes de abrir um programa. */
let busyTimer: number | undefined;
export function hourglass(ms = 450) {
  const root = document.documentElement;
  root.dataset.busy = '';
  window.clearTimeout(busyTimer);
  busyTimer = window.setTimeout(() => {
    delete root.dataset.busy;
  }, ms);
}

/**
 * Roda `cb` quando a área de trabalho está livre: sem tela de boot e sem a pintura de entrada.
 * Devolve uma função que cancela a espera.
 */
export function whenDesktopReady(cb: () => void): () => void {
  const root = document.documentElement;
  const busy = () => root.dataset.boot === 'pending' || root.dataset.desktopReveal === 'running';
  if (!busy()) {
    cb();
    return () => {};
  }
  const mo = new MutationObserver(() => {
    if (busy()) return;
    mo.disconnect();
    cb();
  });
  mo.observe(root, { attributes: true, attributeFilter: ['data-boot', 'data-desktop-reveal'] });
  return () => mo.disconnect();
}
