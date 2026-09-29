'use client';

import Link from 'next/link';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { FrameContext, useFrame } from '@/components/os/frame-context';
import { PixelIcon } from './PixelIcon';

export interface WindowProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  as?: 'section' | 'article' | 'div' | 'aside';
  /** Nome curto tipo arquivo: "Programação.exe", "C:\\SETAC2\\Palestras". */
  title: ReactNode;
  /** Id do texto da barra de título (usado em aria-labelledby). */
  titleId?: string;
  /** Ícone 16px da barra de título. */
  icon?: string;
  /** Botões da barra. `all` = minimizar/maximizar/fechar; `close` = só fechar. */
  controls?: 'all' | 'close' | 'none';
  /** Se definido, o botão fechar vira um link de verdade (ex.: voltar ao desktop). */
  closeHref?: string;
  /** Janela de fundo (barra cinza). Só uma janela ativa por tela. */
  inactive?: boolean;
  /** Sombra dura de janela solta (hero). */
  float?: boolean;
  /** Barra de menus (.w98-menubar) abaixo do título. */
  menubar?: ReactNode;
  /** Células da barra de status. */
  statusbar?: ReactNode[];
  /** Envolve o conteúdo em .w98-body (padrão true). */
  body?: boolean;
  /** Corpo estilo Bloco de Notas (.w98-body.is-doc). */
  doc?: boolean;
  bodyClassName?: string;
  ref?: Ref<HTMLElement>;
}

/**
 * A janela 98 (`.w98-window`): moldura em bisel, barra de título em degradê, corpo e status.
 *
 * Solta na página, minimizar/maximizar são decorativos (escondidos de leitores de tela e do Tab).
 * Dentro de um pop-up do sistema (PC), os três botões funcionam, a barra arrasta e o conteúdo
 * rola dentro da janela.
 */
export function Window({
  as: Tag = 'section',
  title,
  titleId,
  icon,
  controls = 'all',
  closeHref,
  inactive,
  float,
  menubar,
  statusbar,
  body = true,
  doc,
  bodyClassName,
  className,
  children,
  ref,
  ...rest
}: WindowProps) {
  const frame = useFrame();
  const isInactive = frame ? !frame.active : inactive;
  const cls = ['w98-window', isInactive && 'is-inactive', float && 'is-float', className]
    .filter(Boolean)
    .join(' ');
  const bodyCls = ['w98-body', doc && 'is-doc', bodyClassName].filter(Boolean).join(' ');
  const content = body ? <div className={bodyCls}>{children}</div> : children;

  return (
    <Tag
      ref={ref as Ref<HTMLElement & HTMLDivElement>}
      className={cls}
      aria-labelledby={rest['aria-label'] ? undefined : titleId}
      {...rest}
    >
      <div
        className="w98-titlebar"
        onPointerDown={frame?.onTitlePointerDown}
        onDoubleClick={frame?.onToggleMaximize}
      >
        {icon ? <PixelIcon src={icon} /> : null}
        <span className="w98-titlebar-text" id={titleId}>
          {title}
        </span>
        {frame ? (
          <div className="w98-controls">
            <button
              type="button"
              className="min"
              aria-label="Minimizar"
              onClick={frame.onMinimize}
            />
            <button
              type="button"
              className="max"
              aria-label={frame.maximized ? 'Restaurar' : 'Maximizar'}
              onClick={frame.onToggleMaximize}
            />
            <button type="button" className="close" aria-label="Fechar" onClick={frame.onClose} />
          </div>
        ) : controls !== 'none' ? (
          <div className="w98-controls">
            {controls === 'all' ? (
              <>
                <button type="button" className="min" aria-hidden="true" tabIndex={-1} />
                <button type="button" className="max" aria-hidden="true" tabIndex={-1} />
              </>
            ) : null}
            {closeHref ? (
              <Link href={closeHref} className="close" aria-label="Fechar e voltar" />
            ) : (
              <button type="button" className="close" aria-hidden="true" tabIndex={-1} />
            )}
          </div>
        ) : null}
      </div>
      {/* Janelas dentro desta não herdam os controles do pop-up. */}
      <FrameContext.Provider value={null}>
        {frame ? (
          <div className="os-client">
            {menubar}
            {content}
          </div>
        ) : (
          <>
            {menubar}
            {content}
          </>
        )}
      </FrameContext.Provider>
      {statusbar && statusbar.length ? (
        <div className="w98-statusbar">
          {statusbar.map((cell, i) => (
            <span key={i}>{cell}</span>
          ))}
        </div>
      ) : null}
    </Tag>
  );
}
