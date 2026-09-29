import { Fragment } from 'react';

/**
 * Rótulo com letra de atalho sublinhada, estilo 98: "[A]rquivo" → <u>A</u>rquivo.
 * Só a primeira ocorrência de [x] vira sublinhado.
 */
export function Atalho({ children }: { children: string }) {
  const m = /\[(.)\]/.exec(children);
  if (!m) return <>{children}</>;
  const antes = children.slice(0, m.index);
  const depois = children.slice(m.index + 3);
  return (
    <Fragment>
      {antes}
      <u>{m[1]}</u>
      {depois}
    </Fragment>
  );
}

/** Texto puro do rótulo (para aria-label, title etc.). */
export function semAtalho(rotulo: string): string {
  return rotulo.replace(/\[(.)\]/, '$1');
}
