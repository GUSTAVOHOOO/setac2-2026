import Image from 'next/image';
import { iniciais } from '@/lib/format';

/**
 * Foto do palestrante dentro da moldura afundada. Sem foto: iniciais em `brand` sobre `brand-ink`
 * (nunca silhueta genérica). `variant` escolhe o tamanho: avatar 40px (card) ou retrato (assistente).
 */
export function SpeakerPhoto({
  nome,
  foto,
  variant,
  preload,
}: {
  nome: string;
  foto?: string;
  variant: 'avatar' | 'retrato';
  preload?: boolean;
}) {
  const cls = variant === 'avatar' ? 'talk-avatar' : 'spk-photo';
  if (!foto) {
    return (
      <div className={`${cls} is-empty`} role="img" aria-label={`${nome} (sem foto)`}>
        <span aria-hidden="true">{iniciais(nome)}</span>
      </div>
    );
  }
  return (
    <div className={cls}>
      <Image
        src={foto}
        alt={`Foto de ${nome}`}
        width={640}
        height={800}
        sizes={variant === 'avatar' ? '40px' : '(max-width: 640px) 220px, 200px'}
        preload={preload}
      />
    </div>
  );
}
