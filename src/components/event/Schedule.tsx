'use client';

import Link from 'next/link';
import { Fragment, useEffect, useRef, useState } from 'react';
import { PixelIcon } from '@/components/win98/PixelIcon';
import { Tabs } from '@/components/win98/Tabs';
import { Window } from '@/components/win98/Window';
import { NewBadge } from '@/components/web90s/Enfeites';
import { ICONES_TIPO, PROGRAMACAO, TIPOS } from '@/data/programacao';
import type { Dia, Programacao } from '@/data/types';
import { useNow } from '@/hooks/useNow';
import { getPalestra, hrefPalestra, inscricaoAtividade } from '@/lib/event';
import { duracao, emBrasilia, hojeEmBrasilia } from '@/lib/format';

/**
 * Janela Programação.exe (porte de Setac.schedule): uma aba por dia, atividades por período,
 * a atividade em andamento em preto e dourado com o selo AGORA.
 *
 * O HTML estático sai sem estado de horário (nada "AGORA" congelado no build);
 * no navegador, a aba de hoje abre sozinha durante o evento e os estados se atualizam a cada minuto.
 */
export function Schedule({ data = PROGRAMACAO, now }: { data?: Programacao; now?: Date }) {
  const relogio = useNow(60_000);
  const agora = now ?? relogio;
  const [escolhido, setEscolhido] = useState<string | null>(null);
  const hoje = agora ? data.dias.find((d) => d.data === hojeEmBrasilia(agora)) : undefined;
  const aberto = escolhido ?? hoje?.id ?? data.dias[0]?.id;

  // Leva a atividade em andamento para a vista (uma vez).
  const listaRef = useRef<HTMLDivElement>(null);
  const rolou = useRef(false);
  useEffect(() => {
    if (rolou.current || !agora) return;
    const el = listaRef.current?.querySelector('[role="tabpanel"]:not([hidden]) .is-now');
    if (el) {
      el.scrollIntoView({ block: 'nearest' });
      rolou.current = true;
    }
  }, [agora]);

  return (
    <Window
      className="w98-schedule"
      title="C:\SETAC2\Programação.exe"
      titleId="programacao-titulo"
      icon="/icons/calendario.svg"
      closeHref="/"
    >
      <div ref={listaRef}>
        <Tabs
          ariaLabel="Dias do evento"
          selected={aberto}
          onSelect={setEscolhido}
          panelClassName="sch-panel"
          tabs={data.dias.map((d) => ({
            id: d.id,
            label: d.rotulo,
            panel: <PainelDia dia={d} agora={agora} />,
          }))}
        />
      </div>
      <p className="sch-obs">{data.obs}</p>
    </Window>
  );
}

function PainelDia({ dia, agora }: { dia: Dia; agora: Date | null }) {
  const n = dia.itens.filter((i) => i.tipo !== 'coffee' && i.tipo !== 'intervalo').length;
  const primeiro = dia.itens[0];
  const ultimo = dia.itens[dia.itens.length - 1];

  return (
    <>
      <ol className="sch-list w98-scroll">
        {dia.itens.map((it, idx) => {
          const novoPeriodo = idx === 0 || dia.itens[idx - 1]?.periodo !== it.periodo;
          const ini = emBrasilia(dia.data, it.inicio);
          const fim = emBrasilia(dia.data, it.fim);
          const estado = !agora
            ? ''
            : agora >= ini && agora < fim
              ? 'is-now'
              : agora >= fim
                ? 'is-past'
                : '';
          const inscricao = it.palestra
            ? getPalestra(it.palestra).inscricaoUrl
            : it.inscricao
              ? inscricaoAtividade(it.inscricao)
              : undefined;
          const cls = ['sch-item', `is-${it.tipo}`, estado, it.aDefinir && 'is-tbd']
            .filter(Boolean)
            .join(' ');
          return (
            <Fragment key={`${it.inicio}-${it.titulo}-${idx}`}>
              {novoPeriodo ? (
                <li className="sch-period" aria-hidden="true">
                  <span>{it.periodo}</span>
                </li>
              ) : null}
              <li className={cls} aria-current={estado === 'is-now' ? 'time' : undefined}>
                <div className="sch-time">
                  <b>{it.inicio}</b>
                  <span>
                    <span className="sr-only">até </span>
                    {it.fim}
                  </span>
                </div>
                <div className="sch-icon">
                  <PixelIcon src={ICONES_TIPO[it.tipo]} size={24} />
                </div>
                <div className="sch-main">
                  <h4>
                    {it.palestra ? (
                      <Link href={hrefPalestra(it.palestra)}>{it.titulo}</Link>
                    ) : (
                      it.titulo
                    )}
                    {estado === 'is-now' ? <span className="sch-live">AGORA</span> : null}
                    {it.aDefinir ? <NewBadge>A DEFINIR</NewBadge> : null}
                  </h4>
                  <p>{it.desc}</p>
                  {it.quem ? <p className="sch-who">{it.quem}</p> : null}
                  {inscricao ? (
                    <a
                      href={inscricao}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="site-signup sch-signup"
                      aria-label={`Inscrever-se em ${it.titulo} (abre o formulário em nova aba)`}
                    >
                      Inscrever-se
                    </a>
                  ) : null}
                </div>
                <div className="sch-meta">
                  <span className="sch-kind">{TIPOS[it.tipo]}</span>
                  <span className="sch-dur">{duracao(it.inicio, it.fim)}</span>
                </div>
              </li>
            </Fragment>
          );
        })}
      </ol>
      <div className="w98-statusbar">
        <span>{n} atividade(s)</span>
        <span>{dia.rotulo}/2026</span>
        <span>
          {primeiro?.inicio} às {ultimo?.fim}
        </span>
      </div>
    </>
  );
}
