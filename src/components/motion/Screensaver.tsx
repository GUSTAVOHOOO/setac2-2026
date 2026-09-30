'use client';

import { useEffect, useRef, useState } from 'react';

/** Um minuto parado no PC e entra a proteção de tela. */
const OCIOSO_MS = 60_000;
const ESTRELAS = 220;
const LOGOS = 14;

interface Ponto {
  x: number;
  y: number;
  z: number;
}

/**
 * Proteção de tela "Setac² voadores", no espírito do Flying Windows do 95/98: campo de estrelas
 * com a logo em pixel vindo na direção de quem está olhando. Só no PC (mouse), nunca com
 * "reduzir movimento". Mexeu o mouse, clicou ou apertou tecla, ela some (e o clique não passa).
 */
export function Screensaver() {
  const [ativo, setAtivo] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Relógio de ociosidade.
  useEffect(() => {
    const pc = window.matchMedia('(pointer: fine) and (min-width: 641px)');
    const calmo = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer = 0;
    const armar = () => {
      window.clearTimeout(timer);
      if (!pc.matches || calmo.matches) return;
      timer = window.setTimeout(() => {
        const root = document.documentElement;
        if (document.hidden || root.dataset.boot === 'pending') return armar();
        // Não atrapalha quem está digitando num campo.
        if (document.activeElement?.matches('input, textarea, select')) return armar();
        setAtivo(true);
      }, OCIOSO_MS);
    };
    const eventos = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'scroll', 'touchstart'];
    eventos.forEach((ev) => window.addEventListener(ev, armar, { passive: true }));
    pc.addEventListener('change', armar);
    armar();
    return () => {
      window.clearTimeout(timer);
      eventos.forEach((ev) => window.removeEventListener(ev, armar));
      pc.removeEventListener('change', armar);
    };
  }, []);

  // Desenho + saída.
  useEffect(() => {
    if (!ativo) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const logo = new Image();
    logo.src = '/marca/setac2-pixel.svg';
    const novo = (longe = false): Ponto => ({
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
      z: longe ? 1 : Math.random() * 0.95 + 0.05,
    });
    const estrelas = Array.from({ length: ESTRELAS }, () => novo());
    const logos = Array.from({ length: LOGOS }, () => novo());

    let w = 0;
    let h = 0;
    const medir = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      ctx.imageSmoothingEnabled = false;
    };
    medir();
    window.addEventListener('resize', medir);

    let raf = 0;
    let antes = performance.now();
    const quadro = (agora: number) => {
      const dt = Math.min(0.05, (agora - antes) / 1000);
      antes = agora;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, w, h);
      const f = Math.min(w, h) * 0.6;
      const cx = w / 2;
      const cy = h / 2;

      for (const s of estrelas) {
        s.z -= dt * 0.35;
        if (s.z <= 0.02) Object.assign(s, novo(true));
        const px = cx + (s.x / s.z) * f;
        const py = cy + (s.y / s.z) * f;
        if (px < 0 || px > w || py < 0 || py > h) {
          Object.assign(s, novo(true));
          continue;
        }
        const t = Math.max(1, Math.round((1 - s.z) * 3));
        const c = Math.round(120 + (1 - s.z) * 135);
        ctx.fillStyle = `rgb(${c},${c},${c})`;
        ctx.fillRect(Math.round(px), Math.round(py), t, t);
      }

      // Logos de trás para frente (as mais perto por cima).
      logos.sort((a, b) => b.z - a.z);
      for (const l of logos) {
        l.z -= dt * 0.22;
        const px = cx + (l.x / l.z) * f;
        const py = cy + (l.y / l.z) * f;
        const tam = Math.round(32 / l.z / 8) * 8;
        if (l.z <= 0.05 || px < -tam || px > w + tam || py < -tam || py > h + tam) {
          Object.assign(l, novo(true));
          continue;
        }
        if (logo.complete && logo.naturalWidth) {
          ctx.drawImage(logo, Math.round(px - tam / 2), Math.round(py - tam / 2), tam, tam);
        }
      }
      raf = window.requestAnimationFrame(quadro);
    };
    raf = window.requestAnimationFrame(quadro);

    // Sair: qualquer tecla, clique ou mexida de verdade no mouse.
    let x0: number | null = null;
    let y0: number | null = null;
    const sair = () => setAtivo(false);
    const onMove = (e: PointerEvent) => {
      if (x0 === null || y0 === null) {
        x0 = e.clientX;
        y0 = e.clientY;
        return;
      }
      if (Math.abs(e.clientX - x0) + Math.abs(e.clientY - y0) > 6) sair();
    };
    const engolir = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === 'pointerdown') {
        // O clique que acorda a tela não abre nada que estava embaixo.
        const click = (c: Event) => {
          c.preventDefault();
          c.stopPropagation();
        };
        window.addEventListener('click', click, { capture: true, once: true });
        window.setTimeout(() => window.removeEventListener('click', click, true), 600);
      }
      sair();
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerdown', engolir, true);
    window.addEventListener('keydown', engolir, true);
    window.addEventListener('wheel', sair, { passive: true });

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', medir);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', engolir, true);
      window.removeEventListener('keydown', engolir, true);
      window.removeEventListener('wheel', sair);
    };
  }, [ativo]);

  if (!ativo) return null;
  return (
    <div className="site-screensaver" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
