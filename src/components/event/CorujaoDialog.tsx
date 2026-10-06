'use client';

import { useState } from 'react';
import { useFrame } from '@/components/os/frame-context';
import { Button, ButtonLink } from '@/components/win98/Button';
import { MessageBox } from '@/components/win98/MessageBox';
import { listarInscricoes } from '@/lib/event';
import { diaMesBR } from '@/lib/format';

const PLATAFORMAS = ['Xbox', 'PlayStation', 'Nintendo Switch', 'Jogos de tabuleiro', 'PC'];

/**
 * Caixa de mensagem do corujão de jogos: o que vai ter e o que trazer (notebook/PC, filtro de
 * linha e cabo de rede, porque os jogos são em LAN). No PC abre sozinha no meio da tela; OK fecha.
 */
export function CorujaoDialog({ id, className }: { id?: string; className?: string }) {
  const frame = useFrame();
  const [fechado, setFechado] = useState(false);
  const corujao = listarInscricoes().find((a) => a.key === 'corujao');
  if (fechado) return null;

  return (
    <div id={id} className={['site-corujao', className].filter(Boolean).join(' ')}>
      <MessageBox
        title="Corujão de jogos"
        kind="info"
        actions={
          <>
            <Button isDefault onClick={() => (frame ? frame.onClose() : setFechado(true))}>
              OK
            </Button>
            {corujao?.url ? (
              <ButtonLink href={corujao.url} external>
                Inscrever-se
              </ButtonLink>
            ) : null}
          </>
        }
      >
        <p className="site-corujao-quando">
          <b>
            Corujão de jogos
            {corujao ? ` · ${diaMesBR(corujao.data)} · a partir das ${corujao.inicio}` : null}
          </b>
        </p>
        <p>Teremos jogos de:</p>
        <ul className="site-corujao-lista">
          {PLATAFORMAS.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <p>
          Tragam seus notebooks e PCs, um <b>filtro de linha</b> e, <b>muito importante</b>,{' '}
          <b>cabos de rede</b>: vamos jogar jogos em LAN!
        </p>
      </MessageBox>
    </div>
  );
}
