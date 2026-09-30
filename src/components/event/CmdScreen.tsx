'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { paintIn, popIn, reducedMotion, whenDesktopReady } from '@/lib/motion';

/**
 * Tela preta do prompt da hero. Na montagem ela "roda" o comando: digita `setac2 --info`,
 * imprime a logo linha a linha, depois as informações e por fim a contagem regressiva.
 * Um toque, clique ou tecla termina tudo na hora.
 */
export function CmdScreen({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const screen = ref.current;
    const root = document.documentElement;
    if (!screen || reducedMotion()) {
      delete root.dataset.cmdType;
      return;
    }
    const anims: Animation[] = [];
    const add = (a: Animation | null) => {
      if (a) anims.push(a);
    };
    const skip = () => anims.forEach((a) => a.finish());

    const play = (offset: number) => {
      const q = <T extends Element>(s: string) => screen.querySelector<T>(s);
      let t = offset;
      const header = q('.site-cmd-dim');
      const prompt = q('.site-cmd-prompt');
      const cmd = q('.site-cmd-cmd');
      const logo = q('.site-cmd-logo');
      const info = Array.from(
        screen.querySelectorAll('.site-cmd-info > p, .site-cmd-info dl > div'),
      );
      const live = q('.site-cmd-live');

      if (header) add(popIn(header, t));
      t += 160;
      if (prompt) add(popIn(prompt, t));
      t += 220;
      // Digitando: uma letra por quadro.
      if (cmd) {
        const letras = cmd.textContent?.length ?? 12;
        add(paintIn(cmd, { delay: t, duration: letras * 45, frames: letras, from: 'left' }));
        t += letras * 45 + 180;
      }
      // A logo sai "impressa" em blocos de linhas, de cima para baixo.
      if (logo) {
        add(paintIn(logo, { delay: t, duration: 520, frames: 12 }));
        t += 380;
      }
      info.forEach((line, i) => add(popIn(line, t + i * 55)));
      t += info.length * 55 + 140;
      if (live) add(popIn(live, t));
      delete root.dataset.cmdType;
      window.addEventListener('pointerdown', skip, { once: true, capture: true });
      window.addEventListener('keydown', skip, { once: true, capture: true });
    };

    // Durante a pintura de entrada do desktop, a janela do CMD aparece por volta de 600 ms.
    const cancel = whenDesktopReady(() => play(0));
    const pintando = root.dataset.desktopReveal === 'running';
    if (pintando) {
      cancel();
      play(650);
    }

    return () => {
      cancel();
      skip();
      window.removeEventListener('pointerdown', skip, true);
      window.removeEventListener('keydown', skip, true);
    };
  }, []);

  return (
    <div ref={ref} className="site-cmd-screen">
      {children}
    </div>
  );
}
