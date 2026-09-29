import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { PixelIcon } from './PixelIcon';

interface Visual {
  /** Ação principal (Enter): contorno preto. Uma por diálogo. */
  isDefault?: boolean;
  /** CTA grande do hero. */
  big?: boolean;
  icon?: string;
  children: ReactNode;
}

function classes(v: Visual, extra?: string) {
  return ['w98-btn', v.isDefault && 'is-default', v.big && 'is-big', extra]
    .filter(Boolean)
    .join(' ');
}

/** Botão 98 (`.w98-btn`). Verbos curtos: OK, Cancelar, Inscrever-se. */
export function Button({
  isDefault,
  big,
  icon,
  children,
  className,
  type = 'button',
  ...rest
}: Visual & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={classes({ isDefault, big, children }, className)} {...rest}>
      {icon ? <PixelIcon src={icon} /> : null}
      {children}
    </button>
  );
}

/**
 * Link com cara de botão. Links internos usam next/link; `external` abre em nova aba
 * com rel="noopener noreferrer".
 */
export function ButtonLink({
  isDefault,
  big,
  icon,
  children,
  className,
  href,
  external,
  ...rest
}: Visual & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; external?: boolean }) {
  const cls = classes({ isDefault, big, children }, className);
  const content = (
    <>
      {icon ? <PixelIcon src={icon} /> : null}
      {children}
    </>
  );
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...rest}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {content}
    </Link>
  );
}
