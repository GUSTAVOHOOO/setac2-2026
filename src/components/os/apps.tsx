'use client';

import type { ReactNode } from 'react';
import { ActivityFolder } from '@/components/event/ActivityFolder';
import { ArquivoWindow } from '@/components/event/ArquivoWindow';
import { CorujaoDialog } from '@/components/event/CorujaoDialog';
import { InscricaoWindow } from '@/components/event/InscricaoWindow';
import { LixeiraWindow } from '@/components/event/LixeiraWindow';
import { PizzaWindow } from '@/components/event/PizzaWindow';
import { Schedule } from '@/components/event/Schedule';
import { SpeakersWizard } from '@/components/event/SpeakersWizard';
import { TalkCard } from '@/components/event/TalkCard';
import { getArquivoLixeira } from '@/data/lixeira';
import { getPalestra, isPalestraId, listarMinicursos, listarPalestras } from '@/lib/event';
import { speakerSlides } from '@/lib/speakers';

/** Um "programa" que abre como janela pop-up no PC. */
export interface OsApp {
  /** Uma janela por chave: abrir de novo só traz para frente. */
  key: string;
  /** Nome no botão da barra de tarefas. */
  task: string;
  icon: string;
  /** Largura inicial da janela (px). */
  width: number;
  render: () => ReactNode;
}

/**
 * Qual janela cada link interno abre. `null` = link normal (navega como sempre).
 * As mesmas rotas continuam existindo como páginas (celular, link compartilhado, Google).
 */
export function appFor(pathname: string, hash: string): OsApp | null {
  const path = pathname.replace(/\/+$/, '') || '/';
  const frag = hash.replace(/^#/, '');

  if (path === '/' && frag === 'inscricao') {
    return {
      key: 'inscricao',
      task: 'Inscrição.txt',
      icon: '/icons/documento.svg',
      width: 620,
      render: () => <InscricaoWindow titleId="os-inscricao-titulo" />,
    };
  }
  if (path === '/' && frag === 'corujao') {
    return {
      key: 'corujao',
      task: 'Corujão de jogos',
      icon: '/icons/info.svg',
      width: 440,
      render: () => <CorujaoDialog />,
    };
  }
  if (path === '/' && frag === 'pizza') {
    return {
      key: 'pizza',
      task: 'Pizza.exe',
      icon: '/icons/pizza.svg',
      width: 600,
      render: () => <PizzaWindow titleId="os-pizza-titulo" />,
    };
  }
  if (path === '/programacao') {
    return {
      key: 'programacao',
      task: 'Programação.exe',
      icon: '/icons/calendario.svg',
      width: 760,
      render: () => <Schedule />,
    };
  }
  if (path === '/palestras' || path === '/minicursos') {
    const tipo = path === '/minicursos' ? 'minicurso' : 'palestra';
    return {
      key: path,
      task: tipo === 'minicurso' ? 'Minicursos' : 'Palestras',
      icon: '/icons/pasta.svg',
      width: 680,
      render: () => (
        <ActivityFolder
          tipo={tipo}
          itens={tipo === 'minicurso' ? listarMinicursos() : listarPalestras()}
        />
      ),
    };
  }
  if (path === '/palestrantes') {
    const inicio = frag || undefined;
    return {
      key: 'palestrantes',
      task: 'Palestrantes',
      icon: '/icons/equipe.svg',
      width: 640,
      // `key` remonta o assistente quando outro palestrante é pedido com a janela já aberta.
      render: () => (
        <SpeakersWizard key={inicio} slides={speakerSlides()} inicio={inicio} syncHash={false} />
      ),
    };
  }
  if (path === '/lixeira') {
    return {
      key: 'lixeira',
      task: 'Lixeira',
      icon: '/icons/lixeira.svg',
      width: 820,
      render: () => <LixeiraWindow />,
    };
  }
  const lixo = path.match(/^\/lixeira\/([^/]+)$/);
  if (lixo?.[1]) {
    const arquivo = getArquivoLixeira(lixo[1]);
    if (!arquivo) return null;
    return {
      key: `lixeira:${arquivo.id}`,
      task: arquivo.nome,
      icon: '/icons/documento.svg',
      width: 560,
      render: () => <ArquivoWindow arquivo={arquivo} />,
    };
  }
  const m = path.match(/^\/(palestras|minicursos)\/([^/]+)$/);
  if (m?.[2] && isPalestraId(m[2])) {
    const p = getPalestra(m[2]);
    if (p.mini !== (m[1] === 'minicursos')) return null;
    return {
      key: `atividade:${p.id}`,
      task: `${p.id}.txt`,
      icon: p.mini ? '/icons/disquete.svg' : '/icons/megafone.svg',
      width: 600,
      render: () => <TalkCard id={p.id} headingLevel="h2" />,
    };
  }
  return null;
}
