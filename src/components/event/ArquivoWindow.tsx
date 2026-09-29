import { Window } from '@/components/win98/Window';
import type { ArquivoLixeira } from '@/data/lixeira';

/** Um arquivo da Lixeira aberto no Bloco de Notas. */
export function ArquivoWindow({
  arquivo,
  closeHref,
}: {
  arquivo: ArquivoLixeira;
  closeHref?: string;
}) {
  return (
    <Window
      title={`${arquivo.nome} - Bloco de Notas`}
      titleId={`arquivo-${arquivo.id}`}
      icon="/icons/documento.svg"
      closeHref={closeHref}
      doc
      statusbar={[arquivo.tamanho, arquivo.localOriginal]}
      style={{ width: '100%', maxWidth: 620 }}
    >
      <pre className="site-notepad">{arquivo.conteudo.join('\n')}</pre>
    </Window>
  );
}
