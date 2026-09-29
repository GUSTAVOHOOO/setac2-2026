import Link from 'next/link';
import type { ReactNode } from 'react';
import { PixelIcon } from './PixelIcon';

/** Ícone 32px com rótulo sobre a área de trabalho (`a.w98-icon`). */
export function DesktopIcon({
  href,
  icon,
  label,
  external,
  onField,
}: {
  href: string;
  icon: string;
  /** Máx. 2 linhas. Nomes de arquivo são bem-vindos: "Inscrição.txt". */
  label: string;
  external?: boolean;
  /** Dentro de uma janela branca (rótulo em `ink`). */
  onField?: boolean;
}) {
  const cls = ['w98-icon', onField && 'on-field'].filter(Boolean).join(' ');
  const content = (
    <>
      <PixelIcon src={icon} size={32} />
      <span>{label}</span>
    </>
  );
  return external ? (
    <a className={cls} href={href} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    <Link className={cls} href={href}>
      {content}
    </Link>
  );
}

export function IconGrid({ children, label }: { children: ReactNode; label: string }) {
  return (
    <nav className="w98-icongrid" aria-label={label}>
      {children}
    </nav>
  );
}
