import Link from 'next/link';

export type BadgeVariant = 'brand' | 'hype' | 'alt' | 'cyan' | 'dark';

/** Selo 88×31 (`.web-badge`). `brand` = selo oficial preto e dourado. */
export function Badge({
  children,
  small,
  variant = 'brand',
  href,
  external,
}: {
  children: string;
  small?: string;
  variant?: BadgeVariant;
  href?: string;
  external?: boolean;
}) {
  const cls = `web-badge is-${variant}`;
  const content = (
    <>
      {children}
      {small ? <small>{small}</small> : null}
    </>
  );
  if (!href) return <span className={cls}>{content}</span>;
  if (external)
    return (
      <a className={cls} href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  return (
    <Link className={cls} href={href}>
      {content}
    </Link>
  );
}
