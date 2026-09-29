import type { ReactNode } from 'react';
import { PixelIcon } from './PixelIcon';

/** Balão amarelo de dica, uma linha (`.w98-tooltip`). */
export function Tooltip({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <span className="w98-tooltip" role="tooltip" id={id}>
      {children}
    </span>
  );
}

/** Nota "Você sabia?" (`.w98-note`), com ícone 32px (padrão: info). */
export function Note({
  title,
  children,
  icon = '/icons/info.svg',
}: {
  title?: ReactNode;
  children: ReactNode;
  icon?: string;
}) {
  return (
    <div className="w98-note">
      <PixelIcon src={icon} size={32} />
      <div>
        {title ? (
          <>
            <b>{title}</b>
            <br />
          </>
        ) : null}
        {children}
      </div>
    </div>
  );
}
