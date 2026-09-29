import type { Metadata } from 'next';
import { LixeiraWindow } from '@/components/event/LixeiraWindow';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  title: 'Lixeira',
  description: 'O que foi parar na Lixeira do desktop da Setac² 2026. Não esvazie.',
  path: '/lixeira',
});

export default function LixeiraPage() {
  return (
    <>
      <h1 className="w98-display-sm site-heading">Lixeira</h1>
      <LixeiraWindow closeHref="/" />
    </>
  );
}
