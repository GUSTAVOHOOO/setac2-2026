'use client';

import { useCountdown } from '@/hooks/useCountdown';

/** Texto da contagem regressiva, para usar dentro de um <Terminal>. */
export function Countdown({
  alvo,
  prefixo = 'C:\\SETAC2> faltam ',
  fim = 'C:\\SETAC2> a Setac² começou!',
}: {
  alvo: string;
  prefixo?: string;
  /** Mensagem quando a contagem chega a zero. */
  fim?: string;
}) {
  const resto = useCountdown(alvo);
  const acabou = resto === '0d 00:00:00';
  return (
    // aria-live desligado: um leitor de tela lendo a cada segundo seria insuportável.
    <span aria-live="off">{acabou ? fim : `${prefixo}${resto ?? '--d --:--:--'}`}</span>
  );
}
