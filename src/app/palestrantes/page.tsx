import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import { SpeakersWizard } from '@/components/event/SpeakersWizard';
import { speakerSlides } from '@/lib/speakers';

export const metadata: Metadata = pageMetadata({
  title: 'Palestrantes',
  description: 'Quem fala e quem ministra na Setac² 2026, UTFPR Santa Helena.',
  path: '/palestrantes',
});

export default function PalestrantesPage() {
  return (
    <>
      <h1 className="w98-display-sm site-heading">Palestrantes</h1>
      <SpeakersWizard slides={speakerSlides()} />
    </>
  );
}
