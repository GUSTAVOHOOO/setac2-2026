'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useOs } from '@/components/os/OsProvider';
import { useClock } from '@/hooks/useClock';
import { NAV } from '@/lib/site';
import { PixelIcon } from './PixelIcon';
import { StartMenu } from './StartMenu';

/** Item de navegação da rota atual (o mais específico). */
function itemAtual(pathname: string) {
  return NAV.filter((n) => !n.externo && !n.href.includes('#'))
    .filter((n) => (n.href === '/' ? pathname === '/' : pathname.startsWith(n.href)))
    .sort((a, b) => b.href.length - a.href.length)[0];
}

/**
 * Barra de tarefas fixa no rodapé + menu Iniciar.
 * No PC mostra um botão por janela pop-up aberta (clicar traz para frente ou minimiza).
 * No celular o CSS deixa só Iniciar + relógio; o menu Iniciar vira a navegação.
 */
export function Taskbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<HTMLButtonElement>(null);
  const hora = useClock();
  const atual = itemAtual(pathname);
  const os = useOs();

  // Fecha com Esc (devolvendo o foco ao Iniciar) e com clique/toque fora.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        startRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    rootRef.current?.querySelector<HTMLElement>('.site-startmenu a')?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  return (
    <div className="site-bottom" ref={rootRef}>
      <StartMenu
        id="menu-iniciar"
        items={NAV}
        open={open}
        atual={atual?.href}
        onNavigate={() => setOpen(false)}
      />
      <div className="w98-taskbar">
        <button
          ref={startRef}
          type="button"
          className={['w98-start', open && 'is-open'].filter(Boolean).join(' ')}
          aria-expanded={open}
          aria-controls="menu-iniciar"
          onClick={() => setOpen((v) => !v)}
        >
          <PixelIcon src="/marca/setac2-pixel.svg" />
          Iniciar
        </button>
        <span className="w98-sep" aria-hidden="true" />
        {os.on ? (
          os.tasks.map((t) => (
            <button
              key={t.key}
              data-task={t.key}
              type="button"
              className={['w98-task', t.active && 'is-active'].filter(Boolean).join(' ')}
              aria-pressed={t.active}
              onClick={() => os.onTask(t.key)}
            >
              <PixelIcon src={t.icon} />
              <span className="site-task-label">{t.task}</span>
            </button>
          ))
        ) : atual ? (
          <Link href={atual.href} className="w98-task is-active" aria-current="page">
            <PixelIcon src={atual.icone} />
            {atual.arquivo}
          </Link>
        ) : null}
        <div className="w98-tray">
          <PixelIcon src="/icons/info.svg" />
          <time aria-label="Hora atual">{hora ?? '--:--'}</time>
        </div>
      </div>
    </div>
  );
}
