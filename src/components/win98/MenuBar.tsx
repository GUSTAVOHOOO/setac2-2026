import Link from 'next/link';
import { Atalho } from './Atalho';

export interface MenuBarItem {
  /** Com letra de atalho: "[A]rquivo". */
  rotulo: string;
  href: string;
  atual?: boolean;
}

/** Barra de menus da janela (`.w98-menubar`), usada como navegação secundária. */
export function MenuBar({ items, label }: { items: MenuBarItem[]; label: string }) {
  return (
    <nav className="w98-menubar" aria-label={label}>
      {items.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          className={it.atual ? 'is-open' : undefined}
          aria-current={it.atual ? 'page' : undefined}
        >
          <Atalho>{it.rotulo}</Atalho>
        </Link>
      ))}
    </nav>
  );
}
