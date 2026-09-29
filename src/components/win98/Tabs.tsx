'use client';

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: ReactNode;
  panel: ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  /** Controlado: id da aba aberta. */
  selected?: string;
  /** Não controlado: aba inicial. */
  defaultSelected?: string;
  onSelect?: (id: string) => void;
  ariaLabel: string;
  panelClassName?: string;
}

/**
 * Abas estilo caixa de Propriedades (porte de Setac.tabs): role=tablist/tab/tabpanel,
 * roving tabindex, setas ←/→ (e Home/End) navegam.
 */
export function Tabs({
  tabs,
  selected,
  defaultSelected,
  onSelect,
  ariaLabel,
  panelClassName,
}: TabsProps) {
  const uid = useId();
  const [interno, setInterno] = useState(defaultSelected ?? tabs[0]?.id);
  const atual = selected ?? interno;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const escolher = (id: string) => {
    setInterno(id);
    onSelect?.(id);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = tabs.length;
    let alvo: number | null = null;
    if (e.key === 'ArrowRight') alvo = (i + 1) % n;
    else if (e.key === 'ArrowLeft') alvo = (i - 1 + n) % n;
    else if (e.key === 'Home') alvo = 0;
    else if (e.key === 'End') alvo = n - 1;
    if (alvo === null) return;
    e.preventDefault();
    const t = tabs[alvo];
    if (!t) return;
    escolher(t.id);
    refs.current[alvo]?.focus();
  };

  return (
    <div className="w98-tabs">
      <div className="w98-tablist" role="tablist" aria-label={ariaLabel}>
        {tabs.map((t, i) => {
          const on = t.id === atual;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${uid}-${t.id}-t`}
              aria-controls={`${uid}-${t.id}`}
              aria-selected={on}
              tabIndex={on ? 0 : -1}
              onClick={() => escolher(t.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          className={['w98-tabpanel', panelClassName].filter(Boolean).join(' ')}
          role="tabpanel"
          id={`${uid}-${t.id}`}
          aria-labelledby={`${uid}-${t.id}-t`}
          hidden={t.id !== atual}
        >
          {t.panel}
        </div>
      ))}
    </div>
  );
}
