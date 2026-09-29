'use client';

import { useId, useRef, useState, type KeyboardEvent, type TouchEvent } from 'react';
import { ButtonLink } from '@/components/win98/Button';
import { Window } from '@/components/win98/Window';
import { useLocationHash } from '@/hooks/useLocationHash';
import { SpeakerPhoto } from './SpeakerPhoto';

/** Dados já resolvidos no servidor (serializáveis) para cada palestrante. */
export interface SpeakerSlide {
  id: string;
  nome: string;
  bio: string[];
  foto?: string;
  palestra?: {
    href: string;
    rotulo: string;
    titulo: string;
    mini: boolean;
    /** "06/10 · 09:15 · Auditório Daniel Blanco" */
    quando: string;
  };
}

/**
 * Palestrantes um por um, estilo assistente do 98 (porte de Setac.speakers):
 * < Voltar / Avançar >, bolinhas, setas ←/→ e swipe. Dá a volta no fim da lista.
 * Abre no palestrante do #hash da URL (ex.: /palestrantes#daniel-costa) ou no `inicio`.
 */
export function SpeakersWizard({
  slides,
  inicio,
  syncHash = true,
}: {
  slides: SpeakerSlide[];
  /** Id do palestrante inicial (tem prioridade sobre o #hash). */
  inicio?: string;
  /** Escreve o palestrante atual no #hash da URL (desligado nas janelas pop-up do PC). */
  syncHash?: boolean;
}) {
  const uid = useId();
  const hash = useLocationHash();
  const [escolhido, setEscolhido] = useState<number | null>(null);
  const doHash = slides.findIndex((s) => s.id === (inicio ?? (syncHash ? hash : '')));
  const i = escolhido ?? (doHash >= 0 ? doHash : 0);
  const total = slides.length;
  const s = slides[i];
  const x0 = useRef<number | null>(null);

  const show = (n: number) => {
    const novo = (n + total) % total;
    setEscolhido(novo);
    const id = slides[novo]?.id;
    if (id && syncHash) window.history.replaceState(null, '', `#${id}`);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  };
  const onTouchStart = (e: TouchEvent) => {
    x0.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: TouchEvent) => {
    const fim = e.changedTouches[0]?.clientX;
    if (x0.current == null || fim == null) return;
    const dx = fim - x0.current;
    if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1));
    x0.current = null;
  };

  if (!s) return null;
  const kicker = s.palestra?.mini ? 'Ministrante' : 'Palestrante';

  return (
    <Window
      className="w98-speaker"
      aria-roledescription="carrossel"
      title="Palestrantes"
      titleId={`${uid}-t`}
      icon="/icons/equipe.svg"
      closeHref="/"
      body={false}
      onKeyDown={onKeyDown}
    >
      <div
        className="spk-stage"
        id={`${uid}-stage`}
        aria-live="polite"
        aria-roledescription="slide"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <SpeakerPhoto nome={s.nome} foto={s.foto} variant="retrato" preload={i === 0} />
        <div className="spk-info">
          <p className="spk-kicker">{kicker}</p>
          <h2 className="spk-name">{s.nome}</h2>
          {s.bio.length ? (
            <ul className="spk-bio">
              {s.bio.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          ) : (
            <p className="spk-bio">Mini bio em breve.</p>
          )}
          {s.palestra ? (
            <div className="spk-talk">
              <span className="talk-kind">{s.palestra.rotulo}</span>
              <p>{s.palestra.titulo}</p>
              <small>{s.palestra.quando}</small>
              <ButtonLink href={s.palestra.href} className="spk-open">
                Ver {s.palestra.mini ? 'minicurso' : 'palestra'}
              </ButtonLink>
            </div>
          ) : null}
        </div>
      </div>
      <hr className="spk-rule" />
      <div className="spk-nav">
        <span className="spk-count">
          {i + 1} de {total}
        </span>
        <span className="spk-dots" role="tablist" aria-label="Escolher palestrante">
          {slides.map((sl, n) => (
            <button
              key={sl.id}
              type="button"
              role="tab"
              aria-label={sl.nome}
              aria-selected={n === i}
              aria-controls={`${uid}-stage`}
              onClick={() => show(n)}
            />
          ))}
        </span>
        <button
          type="button"
          className="w98-btn spk-prev"
          disabled={total < 2}
          onClick={() => show(i - 1)}
        >
          <span>
            &lt; <u>V</u>oltar
          </span>
        </button>
        <button
          type="button"
          className="w98-btn is-default spk-next"
          disabled={total < 2}
          onClick={() => show(i + 1)}
        >
          <span>
            <u>A</u>vançar &gt;
          </span>
        </button>
      </div>
    </Window>
  );
}
