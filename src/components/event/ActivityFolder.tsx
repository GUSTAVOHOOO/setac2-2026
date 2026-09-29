import { ListView } from '@/components/win98/ListView';
import { Window } from '@/components/win98/Window';
import type { PalestraResolvida } from '@/lib/event';
import { hrefPalestra } from '@/lib/event';
import { diaMesBR } from '@/lib/format';

/** Pasta estilo Explorer com as palestras ou minicursos (cada linha abre o card). */
export function ActivityFolder({
  tipo,
  itens,
}: {
  tipo: 'palestra' | 'minicurso';
  itens: PalestraResolvida[];
}) {
  const mini = tipo === 'minicurso';
  const pasta = mini ? 'Minicursos' : 'Palestras';
  return (
    <Window
      title={`C:\\SETAC2\\${pasta}`}
      titleId={`${tipo}-pasta`}
      icon="/icons/pasta.svg"
      closeHref="/"
      body={false}
      statusbar={[`${itens.length} objeto(s)`, 'Clique para abrir']}
      style={{ width: '100%', maxWidth: 760 }}
    >
      <ListView
        caption={pasta}
        columns={[{ label: 'Nome' }, { label: 'Dia' }, { label: 'Horário' }, { label: 'Local' }]}
        rows={itens.map((a) => ({
          key: a.id,
          icon: mini ? '/icons/disquete.svg' : '/icons/megafone.svg',
          name: `${a.rotulo}: ${a.titulo}`,
          href: hrefPalestra(a.id),
          cells: [diaMesBR(a.data), `${a.inicio} às ${a.fim}`, a.local ?? 'A confirmar'],
        }))}
      />
    </Window>
  );
}
