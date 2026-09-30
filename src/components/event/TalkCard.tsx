import Link from 'next/link';
import { Window } from '@/components/win98/Window';
import { NewBadge } from '@/components/web90s/Enfeites';
import { getPalestra, getPalestrante } from '@/lib/event';
import { dataBR, dataExtenso } from '@/lib/format';
import type { PalestraId } from '@/data/types';
import { InscricaoButton } from './InscricaoButton';
import { SpeakerPhoto } from './SpeakerPhoto';

/**
 * Card de palestra ou minicurso (porte de Setac.talk / Setac.minicurso): etiqueta, título,
 * palestrantes (com link para /palestrantes), resumo em Bloco de Notas, DATA / HORÁRIO / LOCAL
 * e o botão de inscrição.
 */
export function TalkCard({
  id,
  headingLevel = 'h2',
  closeHref,
}: {
  id: PalestraId;
  /** h1 na página da palestra, h2 em listas. */
  headingLevel?: 'h1' | 'h2' | 'h3';
  closeHref?: string;
}) {
  const t = getPalestra(id);
  const H = headingLevel;
  const tituloId = `talk-${id}`;
  const pals = t.palestrantes.map(getPalestrante);

  return (
    <Window
      as="article"
      className={['w98-talk', t.mini && 'is-minicurso'].filter(Boolean).join(' ')}
      aria-labelledby={tituloId}
      title={`C:\\SETAC2\\${t.mini ? 'Minicursos' : 'Palestras'}\\${id}.txt`}
      icon={t.mini ? '/icons/disquete.svg' : '/icons/megafone.svg'}
      closeHref={closeHref}
      body={false}
    >
      <header className="talk-head">
        <span className="talk-kind">{t.rotulo || 'Palestra'}</span>
        <H className="talk-title" id={tituloId}>
          {t.titulo}
          {t.aDefinir ? (
            <>
              {' '}
              <NewBadge>A DEFINIR</NewBadge>
            </>
          ) : null}
        </H>
      </header>

      {pals.length ? (
        <ul className="talk-speakers">
          {pals.map((p) => (
            <li key={p.id}>
              <Link href={`/palestrantes#${p.id}`} className="talk-speaker">
                <SpeakerPhoto nome={p.nome} foto={p.foto} variant="avatar" />
                <span>
                  <b>{p.nome}</b>
                  {p.bio[0] ? <small>{p.bio[0]}</small> : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="talk-tbd">{t.mini ? 'Ministrante' : 'Palestrante'} a confirmar.</p>
      )}

      <div className="w98-body is-doc talk-body">
        {t.resumo.length ? (
          <>
            {t.chamada ? <p className="talk-lead">{t.chamada}</p> : null}
            {t.resumo.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </>
        ) : (
          <p className="talk-tbd">Resumo em breve. Enquanto isso, confira a programação.</p>
        )}
      </div>

      <dl className="talk-facts">
        <div>
          <dt>Data:</dt>
          <dd>
            <b>{dataExtenso(t.data)}</b>
            <small>{dataBR(t.data)}</small>
          </dd>
        </div>
        <div>
          <dt>Horário:</dt>
          <dd>
            <b>{t.inicio}</b>
            <small>até {t.fim}</small>
          </dd>
        </div>
        <div>
          <dt>Local:</dt>
          <dd>
            <b>{t.local ?? 'A confirmar'}</b>
            <small>UTFPR-SH</small>
          </dd>
        </div>
      </dl>

      <div className="w98-actions is-end talk-actions">
        <InscricaoButton url={t.inscricaoUrl} titulo={t.titulo} />
      </div>
    </Window>
  );
}
