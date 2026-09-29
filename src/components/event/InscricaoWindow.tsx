import { ListView } from '@/components/win98/ListView';
import { Note } from '@/components/win98/Tooltip';
import { Window } from '@/components/win98/Window';
import { getPalestra, hrefPalestra } from '@/lib/event';
import { diaMesBR } from '@/lib/format';
import { PALESTRA_IDS } from '@/data/types';

/** Janela Inscrição.txt: como se inscrever + todas as atividades com o status da inscrição. */
export function InscricaoWindow({
  id,
  titleId = 'inscricao-titulo',
  inactive,
  className,
}: {
  /** Âncora na home (/#inscricao). */
  id?: string;
  titleId?: string;
  inactive?: boolean;
  className?: string;
}) {
  const atividades = PALESTRA_IDS.map(getPalestra);
  return (
    <Window
      id={id}
      inactive={inactive}
      className={className}
      title="Inscrição.txt"
      titleId={titleId}
      icon="/icons/documento.svg"
      statusbar={[`${atividades.length} objeto(s)`, 'Google Forms']}
    >
      <div className="site-stack">
        <Note title="Como se inscrever">
          Cada palestra e minicurso tem sua própria inscrição. Escolha abaixo e clique em{' '}
          <b>Inscrever-se</b>.
        </Note>
        <div style={{ width: '100%' }}>
          <ListView
            caption="Atividades com inscrição"
            columns={[{ label: 'Nome' }, { label: 'Dia' }, { label: 'Inscrição' }]}
            rows={atividades.map((a) => ({
              key: a.id,
              icon: a.mini ? '/icons/disquete.svg' : '/icons/megafone.svg',
              name: `${a.rotulo}: ${a.titulo}`,
              href: hrefPalestra(a.id),
              cells: [
                `${diaMesBR(a.data)} · ${a.inicio}`,
                a.inscricaoUrl && !a.aDefinir ? 'Aberta' : 'Em breve',
              ],
            }))}
          />
        </div>
      </div>
    </Window>
  );
}
