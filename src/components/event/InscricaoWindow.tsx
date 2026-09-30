import { ListView } from '@/components/win98/ListView';
import { Note } from '@/components/win98/Tooltip';
import { Window } from '@/components/win98/Window';
import { listarInscricoes } from '@/lib/event';
import { diaMesBR } from '@/lib/format';

/** Janela Inscrição.txt: como se inscrever + todas as atividades com o link da inscrição. */
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
  const atividades = listarInscricoes();
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
          Cada atividade tem sua própria inscrição. Escolha abaixo e clique em <b>Inscrever-se</b>{' '}
          (o formulário abre em outra aba).
        </Note>
        <div className="site-inscricoes" style={{ width: '100%' }}>
          <ListView
            caption="Atividades com inscrição"
            columns={[{ label: 'Nome' }, { label: 'Dia' }, { label: 'Inscrição' }]}
            rows={atividades.map((a) => ({
              key: a.key,
              icon: a.icone,
              name: a.nome,
              href: a.href,
              cells: [
                `${diaMesBR(a.data)} · ${a.inicio}`,
                a.url ? (
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="site-signup"
                    aria-label={`Inscrever-se em ${a.nome} (abre o formulário em nova aba)`}
                  >
                    Inscrever-se
                  </a>
                ) : (
                  'Em breve'
                ),
              ],
            }))}
          />
        </div>
      </div>
    </Window>
  );
}
