import Link from 'next/link';
import type { ReactNode } from 'react';
import { PixelIcon } from './PixelIcon';

export interface ListViewColumn {
  /** Cabeçalho (vira data-label no celular). */
  label: string;
}

export interface ListViewRow {
  key: string;
  icon?: string;
  /** Primeira célula (nome). Com `href`, vira link. */
  name: ReactNode;
  href?: string;
  /** Demais células (colunas secundárias, em `ink-muted`). */
  cells: ReactNode[];
  selected?: boolean;
}

/**
 * Lista em visão de detalhes (Explorer). `stack` (padrão) empilha as linhas no celular.
 */
export function ListView({
  columns,
  rows,
  stack = true,
  caption,
}: {
  /** Primeira coluna = nome; demais = células. */
  columns: ListViewColumn[];
  rows: ListViewRow[];
  stack?: boolean;
  caption?: string;
}) {
  const [primeira, ...resto] = columns;
  return (
    <div className={['w98-list', stack && 'is-stack'].filter(Boolean).join(' ')}>
      <table>
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr>
            <th scope="col">{primeira?.label}</th>
            {resto.map((c) => (
              <th scope="col" key={c.label}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className={r.selected ? 'is-selected' : undefined}>
              <td>
                {r.icon ? <PixelIcon src={r.icon} /> : null}
                {r.href ? (
                  <Link href={r.href} className="w98-list-link">
                    {r.name}
                  </Link>
                ) : (
                  r.name
                )}
              </td>
              {r.cells.map((cell, i) => (
                <td key={i} className="muted" data-label={resto[i]?.label}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
