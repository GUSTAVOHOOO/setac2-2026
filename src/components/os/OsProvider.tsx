'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import { useOsMode } from '@/hooks/useOsMode';
import { hourglass, paintIn, rectOf, zoomRect, type Rect } from '@/lib/motion';
import { appFor, type OsApp } from './apps';
import { FrameContext, type FrameControls } from './frame-context';

interface OsWindow {
  key: string;
  /** Link que abriu a janela (define o conteúdo). */
  href: string;
  z: number;
  min: boolean;
  max: boolean;
  x: number;
  y: number;
  /** De onde a janela "saiu" (ícone, item do menu, botão): origem do zoom de abertura. */
  from?: Rect;
}

export interface OsTask {
  key: string;
  task: string;
  icon: string;
  active: boolean;
}

interface OsContextValue {
  /** Desktop 98 com pop-ups ligado (PC, na home). */
  on: boolean;
  tasks: OsTask[];
  onTask: (key: string) => void;
}

const OsContext = createContext<OsContextValue>({ on: false, tasks: [], onTask: () => {} });

export function useOs() {
  return useContext(OsContext);
}

function splitHref(href: string) {
  const i = href.indexOf('#');
  return i < 0 ? { path: href, hash: '' } : { path: href.slice(0, i), hash: href.slice(i) };
}

const sel = (attr: string, key: string) => `[${attr}="${CSS.escape(key)}"]`;

function resolve(href: string): OsApp | null {
  const { path, hash } = splitHref(href);
  return appFor(path, hash);
}

/**
 * "Sistema operacional" do PC: na home, links internos (ícones, menu Iniciar, listas, botões)
 * abrem como janelas pop-up que arrastam, minimizam, maximizam e fecham, com um botão por
 * janela na barra de tarefas. No celular/toque nada muda: os links navegam para as páginas.
 */
export function OsProvider({ children }: { children: ReactNode }) {
  const osMode = useOsMode();
  const pathname = usePathname();
  const router = useRouter();
  const on = osMode && pathname === '/';

  const [wins, setWins] = useState<OsWindow[]>([]);
  const zTop = useRef(0);
  const abertas = useRef(0);

  const open = useCallback((href: string, from?: Rect | null) => {
    const app = resolve(href);
    if (!app) return;
    const z = ++zTop.current;
    setWins((ws) => {
      const atual = ws.find((w) => w.key === app.key);
      if (atual) {
        return ws.map((w) => (w.key === app.key ? { ...w, href, z, min: false } : w));
      }
      hourglass();
      // Cascata como no 98: a primeira à direita dos ícones do desktop, as seguintes um pouco
      // abaixo e à direita da anterior.
      const n = abertas.current++ % 8;
      const icones = document.querySelector('.site-desktop .w98-icongrid')?.getBoundingClientRect();
      const x0 = icones ? Math.round(icones.right) + 24 : 120;
      return [
        ...ws,
        {
          key: app.key,
          href,
          z,
          min: false,
          max: false,
          x: x0 + n * 28,
          y: 16 + n * 28,
          from: from ?? undefined,
        },
      ];
    });
  }, []);

  const patch = useCallback((key: string, p: Partial<OsWindow>) => {
    setWins((ws) => ws.map((w) => (w.key === key ? { ...w, ...p } : w)));
  }, []);

  const focus = useCallback((key: string) => {
    setWins((ws) => {
      const w = ws.find((x) => x.key === key);
      if (!w || (w.z === zTop.current && !w.min)) return ws;
      const z = ++zTop.current;
      return ws.map((x) => (x.key === key ? { ...x, z, min: false } : x));
    });
  }, []);

  const close = useCallback((key: string) => {
    setWins((ws) => ws.filter((w) => w.key !== key));
  }, []);

  // Minimizar: a janela some e o contorno da barra de título voa até o botão na barra de tarefas.
  const minimize = useCallback(
    (key: string) => {
      const from = rectOf(document.querySelector(`.os-frame${sel('data-key', key)}`));
      const to = rectOf(document.querySelector(sel('data-task', key)));
      patch(key, { min: true });
      if (from && to) void zoomRect(from, to);
    },
    [patch],
  );

  // Janela ativa = a mais alta que não está minimizada.
  const activeKey = useMemo(
    () => wins.filter((w) => !w.min).sort((a, b) => b.z - a.z)[0]?.key,
    [wins],
  );

  // Clique em link interno que tem "programa" vira janela (antes do <Link> do Next navegar).
  useEffect(() => {
    if (!on) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const a = (e.target as Element | null)?.closest?.('a[href]');
      if (!(a instanceof HTMLAnchorElement)) return;
      if ((a.target && a.target !== '_self') || a.hasAttribute('download')) return;
      const url = new URL(a.href);
      if (url.origin !== window.location.origin) return;
      const href = url.pathname + url.hash;
      if (!resolve(href)) return;
      e.preventDefault();
      // Ícones abrem a partir da figura; o resto, a partir do próprio link.
      open(href, rectOf(a.querySelector('img') ?? a) ?? rectOf(a));
    };
    window.addEventListener('click', onClick, true);
    return () => window.removeEventListener('click', onClick, true);
  }, [on, open]);

  // No PC, abrir /programacao (ou outro "programa") direto vira: desktop + a janela aberta.
  // A janela só abre depois que a home renderizou (para a cascata saber onde ficam os ícones).
  const pendente = useRef<string | null>(null);
  useEffect(() => {
    if (!osMode) return;
    if (pathname === '/') {
      if (pendente.current) open(pendente.current);
      pendente.current = null;
      return;
    }
    const href = pathname + window.location.hash;
    if (!resolve(href)) return;
    pendente.current = href;
    router.replace('/');
  }, [osMode, pathname, open, router]);

  // Marca o <html> para o CSS esconder o que no PC vira pop-up (ex.: Inscrição.txt da home).
  useEffect(() => {
    const html = document.documentElement;
    if (on) html.dataset.os = '';
    else delete html.dataset.os;
  }, [on]);

  const onTask = useCallback(
    (key: string) => {
      const w = wins.find((x) => x.key === key);
      if (!w) return;
      if (key === activeKey) minimize(key);
      else focus(key);
    },
    [wins, activeKey, minimize, focus],
  );

  const tasks = useMemo<OsTask[]>(
    () =>
      wins.flatMap((w) => {
        const app = resolve(w.href);
        return app
          ? [{ key: w.key, task: app.task, icon: app.icon, active: w.key === activeKey }]
          : [];
      }),
    [wins, activeKey],
  );

  const ctx = useMemo(() => ({ on, tasks, onTask }), [on, tasks, onTask]);

  return (
    <OsContext.Provider value={ctx}>
      {children}
      {on ? (
        <div className="os-layer">
          {wins.map((w) => {
            const app = resolve(w.href);
            return app ? (
              <OsFrame
                key={w.key}
                win={w}
                app={app}
                active={w.key === activeKey}
                onFocus={focus}
                onClose={close}
                onMinimize={minimize}
                onPatch={patch}
              />
            ) : null;
          })}
        </div>
      ) : null}
    </OsContext.Provider>
  );
}

function OsFrame({
  win,
  app,
  active,
  onFocus,
  onClose,
  onMinimize,
  onPatch,
}: {
  win: OsWindow;
  app: OsApp;
  active: boolean;
  onFocus: (key: string) => void;
  onClose: (key: string) => void;
  onMinimize: (key: string) => void;
  onPatch: (key: string, p: Partial<OsWindow>) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { key } = win;

  // Zoom de entrada: ao abrir (do ícone), ao voltar da barra de tarefas e ao maximizar/restaurar.
  // A janela fica invisível enquanto o contorno voa e depois é "pintada" de cima para baixo.
  const zoomFrom = useRef<Rect | null>(win.from ?? null);
  const wasMin = useRef(win.min);
  useLayoutEffect(() => {
    let from = zoomFrom.current;
    zoomFrom.current = null;
    if (wasMin.current && !win.min) {
      from = rectOf(document.querySelector(sel('data-task', key)));
    }
    wasMin.current = win.min;
    const el = ref.current;
    const to = rectOf(el);
    if (!from || !el || !to || win.min) return;
    el.style.visibility = 'hidden';
    void zoomRect(from, to).then(() => {
      el.style.removeProperty('visibility');
      paintIn(el, { duration: 110, frames: 4 });
    });
  }, [win.min, win.max, key]);

  // Leva o foco do teclado para a janela quando ela abre ou volta da barra de tarefas.
  useEffect(() => {
    if (!win.min) ref.current?.focus({ preventScroll: true });
  }, [win.min, win.href]);

  const onTitlePointerDown = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      const el = ref.current;
      const layer = el?.parentElement;
      if (!el || !layer || win.max || e.button !== 0) return;
      if ((e.target as HTMLElement).closest('button, a')) return;
      e.preventDefault();
      const bar = e.currentTarget;
      const sx = e.clientX;
      const sy = e.clientY;
      let x = win.x;
      let y = win.y;
      const move = (ev: PointerEvent) => {
        // A barra de título nunca some da tela.
        x = Math.min(
          Math.max(win.x + ev.clientX - sx, 80 - el.offsetWidth),
          layer.clientWidth - 80,
        );
        y = Math.min(Math.max(win.y + ev.clientY - sy, 0), layer.clientHeight - 24);
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.maxHeight = `calc(100% - ${y}px)`;
      };
      const up = () => {
        bar.removeEventListener('pointermove', move);
        bar.removeEventListener('pointerup', up);
        bar.removeEventListener('pointercancel', up);
        onPatch(key, { x, y });
      };
      bar.setPointerCapture(e.pointerId);
      bar.addEventListener('pointermove', move);
      bar.addEventListener('pointerup', up);
      bar.addEventListener('pointercancel', up);
    },
    [key, win.max, win.x, win.y, onPatch],
  );

  const controls = useMemo<FrameControls>(
    () => ({
      active,
      maximized: win.max,
      onClose: () => onClose(key),
      onMinimize: () => onMinimize(key),
      onToggleMaximize: () => {
        zoomFrom.current = rectOf(ref.current);
        onPatch(key, { max: !win.max });
      },
      onTitlePointerDown,
    }),
    [active, win.max, key, onClose, onMinimize, onPatch, onTitlePointerDown],
  );

  return (
    <div
      ref={ref}
      className={['os-frame', win.max && 'is-max'].filter(Boolean).join(' ')}
      data-key={key}
      style={
        win.max
          ? { zIndex: win.z }
          : {
              zIndex: win.z,
              left: win.x,
              top: win.y,
              width: app.width,
              maxHeight: `calc(100% - ${win.y}px)`,
            }
      }
      hidden={win.min}
      tabIndex={-1}
      onPointerDownCapture={() => onFocus(key)}
      onFocusCapture={() => onFocus(key)}
    >
      <FrameContext.Provider value={controls}>{app.render()}</FrameContext.Provider>
    </div>
  );
}
