import type { ReactNode } from 'react';
import { DraggableWindow } from '@/components/win98/DraggableWindow';
import { INICIO_EVENTO } from '@/data/programacao';
import { LOGO_ASCII } from '@/data/logo-ascii';
import { CmdScreen } from './CmdScreen';
import { Countdown } from './Countdown';

const PROMPT = 'C:\\SETAC2>';

/** Linhas do "setac2 --info", no estilo neofetch: chave em dourado, valor em cinza. */
const INFO: [string, ReactNode][] = [
  ['Evento', 'XIII Semana Tecnológica Acadêmica'],
  ['Curso', 'Ciência da Computação'],
  ['Data', '05 e 06 de outubro de 2026'],
  ['Local', 'UTFPR Santa Helena'],
  ['Programa', 'palestras, minicursos, competição de programação e corujão de jogos'],
  ['Inscrição', 'uma por atividade, pelo Google Forms'],
  [
    'Dica',
    <>
      <span className="site-only-wide">abra os ícones ao lado ou o menu Iniciar</span>
      <span className="site-only-narrow">toque em Iniciar, lá embaixo</span>
    </>,
  ],
];

/** Blocos de cor do fim do neofetch: a paleta da marca + as VGA de tempero. */
const CORES = [
  '--title',
  '--brand',
  '--brand-deep',
  '--brand-light',
  '--hype',
  '--hype-alt',
  '--hype-cyan',
  '--face',
];

/**
 * Janela de abertura como um prompt de comando de verdade: cabeçalho de versão, a logo em
 * ASCII (dourado sobre preto, como a logo oficial) com as informações do evento ao lado e a
 * contagem regressiva no prompt com o cursor piscando. Sem botões: os atalhos ficam fora dela.
 */
export function Hero() {
  return (
    <DraggableWindow
      className="site-hero site-cmd"
      float
      title="C:\SETAC2\setac2.exe"
      titleId="hero-titulo"
      icon="/marca/setac2-pixel.svg"
      body={false}
    >
      <CmdScreen>
        <h1 className="sr-only">
          Setac² 2026 · XIII Semana Tecnológica Acadêmica de Ciência da Computação
        </h1>
        <p className="site-cmd-dim">
          Setac² 2026 [versão XIII]
          <br />
          (C) UTFPR Santa Helena. Todos os bugs reservados.
        </p>
        <p className="site-cmd-prompt">
          {PROMPT} <span className="site-cmd-cmd">setac2 --info</span>
        </p>
        <div className="site-cmd-fetch">
          <pre className="site-cmd-logo" aria-hidden="true">
            {LOGO_ASCII}
          </pre>
          <div className="site-cmd-info">
            <p>
              <b>setac2</b>@<b>utfpr-sh</b>
            </p>
            <p aria-hidden="true">----------------</p>
            <dl>
              {INFO.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}:</dt> <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <p className="site-cmd-colors" aria-hidden="true">
              {CORES.map((c) => (
                <span key={c} style={{ background: `var(${c})` }} />
              ))}
            </p>
          </div>
        </div>
        <p className="site-cmd-live">
          <Countdown alvo={INICIO_EVENTO} prefixo={`${PROMPT} faltam `} />
          <span className="site-cmd-cursor" aria-hidden="true" />
        </p>
      </CmdScreen>
    </DraggableWindow>
  );
}
