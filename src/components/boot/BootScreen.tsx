'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/win98/Button';
import { BOOT_SESSION_KEY } from './bootstrap';
import { revealDesktop } from './revealDesktop';

/** One continuous intro, even when OsProvider redirects a deep link to a desktop window. */
export function BootScreen() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const finishRef = useRef<() => void>(() => {});

  useEffect(() => {
    const dialog = dialogRef.current;
    const root = document.documentElement;
    if (!dialog || root.dataset.boot !== 'pending') return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const previousFocus = document.activeElement;
    let finished = false;
    let finishReveal: (() => void) | undefined;
    const timers: number[] = [];
    const finish = (animateDesktop = false) => {
      if (finished) return;
      finished = true;
      timers.forEach(window.clearTimeout);
      try {
        sessionStorage.setItem(BOOT_SESSION_KEY, '1');
      } catch {
        // Storage can be disabled; this mounted component still runs only once.
      }
      // Prepare hidden paint regions before lifting the splash: no flash of the full desktop.
      if (animateDesktop) finishReveal = revealDesktop();
      dialog.close();
      delete root.dataset.boot;
      if (previousFocus instanceof HTMLElement && previousFocus !== document.body) {
        previousFocus.focus({ preventScroll: true });
      } else {
        // A direct route may already have opened a desktop window behind the dialog.
        const target =
          document.querySelector<HTMLElement>('.os-layer [tabindex="-1"]') ??
          document.getElementById('conteudo');
        target?.focus({ preventScroll: true });
      }
    };
    finishRef.current = finish;
    if (motion.matches) {
      finish();
      return;
    }

    dialog.dataset.phase = 'post';
    try {
      dialog.showModal();
    } catch {
      finish();
      return;
    }
    const phases = [
      [1200, 'dos'],
      [1800, 'splash'],
      [4300, 'desktop'],
    ] as const;
    phases.forEach(([delay, phase]) => {
      timers.push(
        window.setTimeout(() => {
          dialog.dataset.phase = phase;
        }, delay),
      );
    });
    timers.push(window.setTimeout(() => finish(true), 4800));
    const onMotion = () => {
      if (motion.matches) finish();
    };
    motion.addEventListener('change', onMotion);
    const onTimeout = () => finish();
    window.addEventListener('setac:boot-timeout', onTimeout);
    return () => {
      timers.forEach(window.clearTimeout);
      motion.removeEventListener('change', onMotion);
      window.removeEventListener('setac:boot-timeout', onTimeout);
      finishReveal?.();
      dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="boot-screen"
      data-phase="post"
      aria-label="Inicialização do Windows 98"
      aria-describedby="boot-description"
      onCancel={(event) => {
        event.preventDefault();
        finishRef.current();
      }}
    >
      <p id="boot-description" className="sr-only">
        Abertura de aproximadamente cinco segundos. Você pode pular para acessar o site da Setac².
      </p>
      <div className="boot-panel boot-post" aria-hidden="true">
        <div className="boot-bios-heading">SETAC2 / PCI BIOS</div>
        <p>Pentium MMX CPU at 200MHz</p>
        <p className="boot-post-line boot-post-memory">Memory Test : 65536K OK</p>
        <div className="boot-post-line boot-post-drives">
          <p>Detecting Primary Master ... IDE Hard Disk</p>
          <p>Detecting Secondary Master ... CD-ROM</p>
        </div>
        <p className="boot-post-line boot-post-ready">Verifying DMI Pool Data ........</p>
        <span className="boot-cursor">_</span>
      </div>
      <div className="boot-panel boot-dos" aria-hidden="true">
        <p>Iniciando o Windows 98...</p>
        <span className="boot-cursor">_</span>
      </div>
      <div className="boot-panel boot-splash" aria-hidden="true">
        <div className="boot-splash-picture">
          <Image
            src="/boot/windows-98.svg"
            alt=""
            width={642}
            height={408}
            className="boot-windows-logo"
            loading="eager"
            unoptimized
          />
        </div>
        <div className="boot-activity">
          <span />
        </div>
      </div>
      <div className="boot-panel boot-desktop" aria-hidden="true">
        <Image src="/icons/ampulheta.svg" alt="" width={32} height={32} unoptimized />
      </div>
      <div className="boot-controls">
        <span className="boot-key-hint" aria-hidden="true">
          Esc para pular
        </span>
        <Button onClick={() => finishRef.current()}>Pular abertura</Button>
      </div>
      <div className="crt-overlay" aria-hidden="true" />
    </dialog>
  );
}
