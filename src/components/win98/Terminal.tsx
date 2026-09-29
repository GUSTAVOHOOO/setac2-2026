import type { CSSProperties, ReactNode } from 'react';

/** Prompt MS-DOS em fósforo verde (`.w98-terminal`), com cursor piscando opcional. */
export function Terminal({
  children,
  cursor = true,
  style,
  className,
}: {
  children: ReactNode;
  cursor?: boolean;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <div className={['w98-terminal', className].filter(Boolean).join(' ')} style={style}>
      {children}
      {cursor ? <span className="cursor" aria-hidden="true" /> : null}
    </div>
  );
}

/** Tela azul (`.w98-bsod`): só para a 404 ou uma piada de destaque por página. */
export function Bsod({ badge = 'SETAC²', children }: { badge?: string; children: ReactNode }) {
  return (
    <div className="w98-bsod">
      <p style={{ textAlign: 'center' }}>
        <span className="badge">{badge}</span>
      </p>
      {children}
    </div>
  );
}
