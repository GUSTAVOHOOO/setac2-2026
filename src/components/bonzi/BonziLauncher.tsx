'use client';

import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react';
import type { BonziProps } from './BonziCompanion';
import { BONZI_HASH, BONZI_OPEN_EVENT } from './events';

function loadSprite(signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const image = new Image();
    const finish = (error?: Error) => {
      clearTimeout(timeout);
      image.onload = null;
      image.onerror = null;
      signal.removeEventListener('abort', abort);
      if (error) reject(error);
      else resolve();
    };
    const abort = () => {
      finish(new Error('Cancelado'));
      image.src = '';
    };
    const timeout = setTimeout(() => finish(new Error('Tempo de carregamento excedido')), 15000);
    signal.addEventListener('abort', abort, { once: true });
    image.onload = () => finish();
    image.onerror = () => finish(new Error('Imagem indisponível'));
    image.src = '/bonzi/purple.png';
  });
}

export function BonziLauncher() {
  const button = useRef<HTMLButtonElement>(null);
  const pending = useRef<AbortController | null>(null);
  const [Component, setComponent] = useState<ComponentType<BonziProps> | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [greeting, setGreeting] = useState(0);

  useEffect(() => () => pending.current?.abort(), []);

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) button.current?.focus({ preventScroll: true });
  }, []);

  const activate = async () => {
    if (open) {
      setGreeting((n) => n + 1);
      return;
    }
    if (pending.current) return;
    const controller = new AbortController();
    pending.current = controller;
    setLoading(true);
    setError(false);
    try {
      const [module] = await Promise.all([
        import('./BonziCompanion'),
        loadSprite(controller.signal),
      ]);
      if (controller.signal.aborted) return;
      setComponent(() => module.default);
      setOpen(true);
    } catch {
      if (!controller.signal.aborted) setError(true);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
      if (pending.current === controller) pending.current = null;
    }
  };

  // O menu Iniciar (a navegação do celular, onde este ícone não aparece) também abre o Bonzi:
  // na home por evento; de outra página, chegando em /#bonzi.
  const activateRef = useRef(activate);
  useEffect(() => {
    activateRef.current = activate;
  });
  useEffect(() => {
    const onOpen = () => void activateRef.current();
    window.addEventListener(BONZI_OPEN_EVENT, onOpen);
    if (window.location.hash === BONZI_HASH) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      onOpen();
    }
    return () => window.removeEventListener(BONZI_OPEN_EVENT, onOpen);
  }, []);

  return (
    <>
      <button
        ref={button}
        type="button"
        className="w98-icon bonzi-launcher"
        aria-label="Abrir BonziBuddy"
        aria-busy={loading}
        aria-pressed={open}
        aria-describedby={error ? 'bonzi-load-error' : undefined}
        onClick={activate}
      >
        {/* Small local desktop icon; full sprite is loaded only on activation. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/bonzi/icon.png" width={32} height={32} alt="" />
        <span>
          {loading ? (
            'Abrindo...'
          ) : (
            <>
              BonziBuddy
              <wbr />
              .exe
            </>
          )}
        </span>
      </button>
      {error && (
        <p id="bonzi-load-error" className="bonzi-load-error" role="status">
          Não consegui abrir. Tentar novamente: clique no ícone.
        </p>
      )}
      {open && Component && <Component greeting={greeting} onClose={close} />}
    </>
  );
}
