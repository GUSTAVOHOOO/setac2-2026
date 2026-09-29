import type { SpeakerSlide } from '@/components/event/SpeakersWizard';
import { ORDEM_PALESTRANTES } from '@/data/palestrantes';
import { getPalestra, getPalestrante, hrefPalestra } from './event';
import { diaMesBR } from './format';

/** Slides do assistente de palestrantes, na ordem oficial, com a palestra de cada um resolvida. */
export function speakerSlides(): SpeakerSlide[] {
  return ORDEM_PALESTRANTES.map((id) => {
    const p = getPalestrante(id);
    const t = p.palestra ? getPalestra(p.palestra) : undefined;
    return {
      id,
      nome: p.nome,
      bio: p.bio,
      foto: p.foto,
      palestra: t
        ? {
            href: hrefPalestra(t.id),
            rotulo: t.rotulo,
            titulo: t.titulo,
            mini: t.mini,
            quando: `${diaMesBR(t.data)} · ${t.inicio} · ${t.local ?? 'Local a confirmar'}`,
          }
        : undefined,
    };
  });
}
