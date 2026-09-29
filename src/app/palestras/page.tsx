import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import { ActivityIndex } from '@/components/event/ActivityIndex';
import { listarPalestras } from '@/lib/event';

export const metadata: Metadata = pageMetadata({
  title: 'Palestras',
  description:
    'Palestras da Setac² 2026 na UTFPR Santa Helena: direito digital, cybersecurity, Erasmus+ e mercado de trabalho.',
  path: '/palestras',
});

export default function PalestrasPage() {
  return <ActivityIndex tipo="palestra" itens={listarPalestras()} />;
}
