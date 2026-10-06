import Link from 'next/link';
import { Window } from '@/components/win98/Window';
import { LOGO_PIZZA, LOGO_PIZZA_CORES } from '@/data/logo-pizza';
import { listarInscricoes } from '@/lib/event';
import { diaMesBR } from '@/lib/format';

const PROMPT = 'C:\\SETAC2>';
const PRECO = 'R$ 10 por pessoa';

/** Uma linha da logo em trechos da mesma cor (o vermelho vira <span>; o resto herda o dourado). */
function LinhaLogo({ linha, cores }: { linha: string; cores: string }) {
  const trechos: { cor: string; texto: string }[] = [];
  for (let i = 0; i < linha.length; i++) {
    const cor = cores[i] === 'r' ? 'r' : 'y';
    const ultimo = trechos[trechos.length - 1];
    if (ultimo && (ultimo.cor === cor || linha[i] === ' ')) ultimo.texto += linha[i];
    else trechos.push({ cor, texto: linha[i] ?? '' });
  }
  return (
    <>
      {trechos.map((t, i) =>
        t.cor === 'r' ? (
          <span key={i} className="site-pizza-molho">
            {t.texto}
          </span>
        ) : (
          t.texto
        ),
      )}
      {'\n'}
    </>
  );
}

/**
 * Pizza.exe: o apoio do Império da Pizza ao corujão de jogos. Um "type pizza.txt" no prompt,
 * com a logo deles em ASCII (dourado e vermelho sobre preto) e as informações ao lado.
 */
export function PizzaWindow({
  id,
  titleId = 'pizza-titulo',
  inactive,
  className,
}: {
  /** Âncora na home (/#pizza). */
  id?: string;
  titleId?: string;
  inactive?: boolean;
  className?: string;
}) {
  const corujao = listarInscricoes().find((a) => a.key === 'corujao');
  return (
    <Window
      id={id}
      inactive={inactive}
      className={['site-pizza', className].filter(Boolean).join(' ')}
      title="Pizza.exe"
      titleId={titleId}
      icon="/icons/pizza.svg"
      body={false}
      statusbar={['Apoio: Império da Pizza', PRECO]}
    >
      <div className="site-cmd-screen site-pizza-screen">
        <p className="site-cmd-prompt">
          {PROMPT} <span className="site-cmd-cmd">type corujao\pizza.txt</span>
        </p>
        <div className="site-pizza-fetch">
          <pre className="site-pizza-logo" aria-hidden="true">
            {LOGO_PIZZA.map((linha, i) => (
              <LinhaLogo key={i} linha={linha} cores={LOGO_PIZZA_CORES[i] ?? ''} />
            ))}
          </pre>
          <div className="site-cmd-info">
            <p>
              <b>imperio</b>@<b>corujao</b>
            </p>
            <p aria-hidden="true">----------------</p>
            <dl>
              <div>
                <dt>Apoio:</dt> <dd>Império da Pizza</dd>
              </div>
              <div>
                <dt>Onde:</dt>{' '}
                <dd>
                  {corujao?.nome ?? 'Corujão de jogos'}
                  {corujao?.local ? `, ${corujao.local}` : null}
                </dd>
              </div>
              {corujao ? (
                <div>
                  <dt>Quando:</dt>{' '}
                  <dd>
                    {diaMesBR(corujao.data)}, a partir das {corujao.inicio}
                  </dd>
                </div>
              ) : null}
              <div>
                <dt>Pizza:</dt> <dd className="site-pizza-preco">{PRECO}</dd>
              </div>
            </dl>
            <p>Vai ter pizza na noite de jogos. Valeu, Império!</p>
            <p>
              {PROMPT}{' '}
              <Link href="/#corujao" className="site-pizza-link">
                o que trazer pro corujão?
              </Link>
            </p>
            {corujao?.url ? (
              <p>
                {PROMPT}{' '}
                <a
                  href={corujao.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="site-pizza-link"
                  aria-label="Inscrever-se no corujão de jogos (abre o formulário em nova aba)"
                >
                  inscrever-se no corujão
                </a>
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </Window>
  );
}
