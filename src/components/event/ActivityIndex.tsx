import type { PalestraResolvida } from '@/lib/event';
import { ActivityFolder } from './ActivityFolder';
import { TalkCard } from './TalkCard';

/** Página-índice de palestras ou minicursos: pasta estilo Explorer + um card por atividade. */
export function ActivityIndex({
  tipo,
  itens,
}: {
  tipo: 'palestra' | 'minicurso';
  itens: PalestraResolvida[];
}) {
  return (
    <>
      <h1 className="w98-display-sm site-heading">
        {tipo === 'minicurso' ? 'Minicursos' : 'Palestras'}
      </h1>
      <ActivityFolder tipo={tipo} itens={itens} />
      <div className="site-cards">
        {itens.map((a) => (
          <TalkCard key={a.id} id={a.id} headingLevel="h2" />
        ))}
      </div>
    </>
  );
}
