import { useId, type ReactNode } from 'react';
import { PixelIcon } from './PixelIcon';
import { Window } from './Window';

const ICONES = {
  info: { src: '/icons/info.svg', alt: 'Informação' },
  aviso: { src: '/icons/aviso.svg', alt: 'Aviso' },
  erro: { src: '/icons/erro.svg', alt: 'Erro' },
} as const;

/**
 * Caixa de mensagem 98: ícone 32px, frase curta e botões (`.w98-msg` + `.w98-actions`).
 * Erro sempre com o ícone `erro` e texto em `danger` (nunca só cor).
 */
export function MessageBox({
  title,
  kind = 'info',
  children,
  actions,
  actionsEnd,
  className,
}: {
  title: string;
  kind?: keyof typeof ICONES;
  children: ReactNode;
  /** Botões; a ação padrão vem primeiro. */
  actions?: ReactNode;
  /** Botões à direita (estilo assistente). */
  actionsEnd?: boolean;
  className?: string;
}) {
  const id = useId();
  const icone = ICONES[kind];
  return (
    <Window
      as="div"
      role="alertdialog"
      title={title}
      titleId={id}
      controls="close"
      body={false}
      className={className}
    >
      <div className="w98-msg">
        <PixelIcon src={icone.src} alt={icone.alt} size={32} />
        <div style={{ margin: 0, color: kind === 'erro' ? 'var(--danger)' : undefined }}>
          {children}
        </div>
      </div>
      {actions ? (
        <div className={['w98-actions', actionsEnd && 'is-end'].filter(Boolean).join(' ')}>
          {actions}
        </div>
      ) : null}
    </Window>
  );
}
