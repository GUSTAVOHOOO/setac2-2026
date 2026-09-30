'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { paintIn, rectOf, reducedMotion, zoomRect, type Rect } from '@/lib/motion';

/** Janelas de primeiro nível do conteúdo (as de dentro vêm junto com a de fora). */
const JANELAS = '#conteudo .w98-window';
/** Linhas que também vão sendo "desenhadas" conforme entram na tela. */
const LINHAS = '#conteudo .sch-item, #conteudo .w98-list tbody tr, #conteudo .site-hero-ctas > *';

function janelasDoConteudo(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(JANELAS)).filter(
    (el) => !el.parentElement?.closest('.w98-window') && rectOf(el),
  );
}

function naTela(el: Element) {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight;
}

/**
 * Movimento das páginas, no ritmo do 98:
 * - trocou de página (celular, links normais): o contorno da barra de título voa do link tocado
 *   até a janela nova, que é pintada de cima para baixo;
 * - rolando: janelas e linhas que estavam fora da tela são pintadas quando aparecem.
 * Nada aqui mexe em layout; sem JS ou com "reduzir movimento", a página é a mesma, parada.
 */
export function Motion() {
  const pathname = usePathname();
  const toque = useRef<Rect | null>(null);
  const primeira = useRef(true);

  // Guarda de onde veio o último toque em link (origem do zoom da próxima página).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href]');
      if (a) toque.current = rectOf(a.querySelector('img') ?? a) ?? rectOf(a);
    };
    window.addEventListener('click', onClick, true);
    return () => window.removeEventListener('click', onClick, true);
  }, []);

  useLayoutEffect(() => {
    if (reducedMotion()) return;
    const inicial = primeira.current;
    primeira.current = false;
    const anims: Animation[] = [];
    let io: IntersectionObserver | undefined;
    let raf = 0;
    const esperando = new Set<HTMLElement>();

    // Página nova (não a primeira carga, que já tem o boot): esconde já, antes de pintar.
    const janelas = inicial ? [] : janelasDoConteudo();
    janelas.forEach((el) => el.setAttribute('data-motion', 'wait'));

    raf = window.requestAnimationFrame(() => {
      // Depois do scroll para o topo que o Next faz ao navegar.
      const visiveis = janelas.filter(naTela);
      janelas.filter((el) => !visiveis.includes(el)).forEach((el) => esperando.add(el));
      const alvo = rectOf(visiveis[0]);
      const origem = toque.current ?? rectOf(document.querySelector('.w98-start')) ?? null;
      toque.current = null;
      const pintar = () => {
        visiveis.forEach((el, i) => {
          el.removeAttribute('data-motion');
          const a = paintIn(el, { delay: i * 90, duration: 150, frames: 5 });
          if (a) anims.push(a);
        });
      };
      if (alvo && origem) void zoomRect(origem, alvo).then(pintar);
      else pintar();

      // O que está fora da tela espera a vez (inclusive na primeira carga).
      const fora = [
        ...janelasDoConteudo(),
        ...Array.from(document.querySelectorAll<HTMLElement>(LINHAS)),
      ].filter((el) => rectOf(el) && !naTela(el) && !el.closest('.os-layer'));
      fora.forEach((el) => {
        esperando.add(el);
        el.setAttribute('data-motion', 'wait');
      });
      io = new IntersectionObserver(
        (entries) => {
          let n = 0;
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            const el = e.target as HTMLElement;
            io?.unobserve(el);
            esperando.delete(el);
            el.removeAttribute('data-motion');
            const a = paintIn(el, { delay: n++ * 60, duration: 150, frames: 5 });
            if (a) anims.push(a);
          }
        },
        { rootMargin: '0px 0px -8% 0px' },
      );
      esperando.forEach((el) => io?.observe(el));
    });

    return () => {
      window.cancelAnimationFrame(raf);
      io?.disconnect();
      anims.forEach((a) => a.finish());
      janelas.forEach((el) => el.removeAttribute('data-motion'));
      esperando.forEach((el) => el.removeAttribute('data-motion'));
    };
  }, [pathname]);

  return null;
}
