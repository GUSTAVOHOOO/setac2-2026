import type { ReactNode } from 'react';

/** Faixa amarela e preta "em construção". */
export function Construction({ children }: { children: string }) {
  return (
    <div className="web-construction">
      <span>{children}</span>
    </div>
  );
}

/** Selo torto "NOVO!" / "A DEFINIR". */
export function NewBadge({ children = 'NOVO!' }: { children?: string }) {
  return <span className="web-new">{children}</span>;
}

/** Régua colorida VGA. */
export function WebHr() {
  return <hr className="web-hr" />;
}

/** Link azul sublinhado em Times, como a web crua de 1998. */
export function WebLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="web-link" href={href}>
      {children}
    </a>
  );
}
