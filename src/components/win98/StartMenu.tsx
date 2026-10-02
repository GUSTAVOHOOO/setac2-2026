'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BONZI_HASH, BONZI_OPEN_EVENT } from '@/components/bonzi/events';
import { CrtToggle } from '@/components/crt/CrtToggle';
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
  const pathname = usePathname();
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
          <li className="site-startmenu-sep" aria-hidden="true">
            <hr />
          </li>
          <li>
            <CrtToggle />
          </li>
          <li>
            {/* Na home abre na hora; de outra página, volta para a home já com ele. */}
            <Link
              href={`/${BONZI_HASH}`}
              onClick={(e) => {
                onNavigate();
                if (pathname !== '/') return;
                e.preventDefault();
                window.dispatchEvent(new Event(BONZI_OPEN_EVENT));
              }}
            >
              <PixelIcon src="/bonzi/icon.png" size={24} />
              <span>
                <Atalho>[B]onziBuddy</Atalho>
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
