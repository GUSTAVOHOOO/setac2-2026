import type { Metadata } from 'next';
import Link from 'next/link';
import { Bsod } from '@/components/win98/Terminal';

export const metadata: Metadata = {
  title: 'Erro 404',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="site-bsod">
      <Bsod>
        <h1 className="sr-only">Página não encontrada (erro 404)</h1>
        <p>
          Ocorreu um erro fatal 404 no endereço 0x0000SETAC2. A página que você procura foi movida
          para a lixeira.
        </p>
        <p>
          * Use o menu Iniciar para voltar à área de trabalho.
          <br />* Ou <Link href="/">clique aqui</Link>, a gente não julga.
          <span className="blink" aria-hidden="true">
            _
          </span>
        </p>
      </Bsod>
    </div>
  );
}
