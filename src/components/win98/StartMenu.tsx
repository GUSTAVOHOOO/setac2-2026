'use client';

import Link from 'next/link';
import type { NavItem } from '@/lib/site';
import { Atalho } from './Atalho';
import { PixelIcon } from './PixelIcon';

/**
 * Menu Iniciar (`.w98-startmenu`): faixa lateral preta com "Setac² 2026" em `brand`
 * e a navegação completa do site (é o menu principal no celular).
 * Abrir/fechar fica no Taskbar (porte de Setac.startMenu).
 */
export function StartMenu({
  id,
  items,
  open,
  atual,
  onNavigate,
}: {
  id: string;
  items: NavItem[];
  open: boolean;
  atual?: string;
  onNavigate: () => void;
}) {
  return (
    <div className="w98-startmenu site-startmenu" id={id} hidden={!open}>
      <div className="w98-startmenu-side" aria-hidden="true">
        <span>
          Setac² <b>2026</b>
        </span>
      </div>
      <nav aria-label="Menu Iniciar" style={{ flex: 1, minWidth: 0 }}>
        <ul className="w98-menu">
          {items.map((it) => {
            const conteudo = (
              <>
                <PixelIcon src={it.icone} size={24} />
                <span>
                  <Atalho>{it.rotulo}</Atalho>
                </span>
              </>
            );
            const sel = it.href === atual;
            return (
              <li key={it.href} className={sel ? 'is-selected' : undefined}>
                {it.externo ? (
                  <a href={it.href} target="_blank" rel="noopener noreferrer" onClick={onNavigate}>
                    {conteudo}
                  </a>
                ) : (
                  <Link href={it.href} onClick={onNavigate} aria-current={sel ? 'page' : undefined}>
                    {conteudo}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
