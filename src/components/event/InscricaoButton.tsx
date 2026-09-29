import { ButtonLink } from '@/components/win98/Button';
import { PixelIcon } from '@/components/win98/PixelIcon';

/**
 * Botão de inscrição de uma palestra/minicurso.
 * Com link (src/data/inscricoes.ts): abre o Google Forms em nova aba.
 * Sem link: aviso "Inscrições em breve" legível (não um botão cinza desabilitado: o design
 * system diz que desabilitado nunca carrega informação).
 */
export function InscricaoButton({
  url,
  titulo,
  big,
}: {
  url?: string;
  /** Título da atividade, para o nome acessível. */
  titulo: string;
  big?: boolean;
}) {
  if (url) {
    return (
      <ButtonLink
        href={url}
        external
        isDefault
        big={big}
        icon="/icons/documento.svg"
        aria-label={`Inscrever-se em ${titulo} (abre o formulário em nova aba)`}
      >
        <span>
          <u>I</u>nscrever-se
        </span>
      </ButtonLink>
    );
  }
  return (
    <p className={['site-soon', big && 'is-big'].filter(Boolean).join(' ')}>
      <PixelIcon src="/icons/ampulheta.svg" />
      Inscrições em breve
    </p>
  );
}
