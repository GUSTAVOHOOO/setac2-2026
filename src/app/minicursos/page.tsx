import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import { ActivityIndex } from '@/components/event/ActivityIndex';
import { listarMinicursos } from '@/lib/event';

export const metadata: Metadata = pageMetadata({
  title: 'Minicursos',
  description: 'Minicursos da Setac² 2026 na UTFPR Santa Helena. Inscrição por minicurso.',
  path: '/minicursos',
});

export default function MinicursosPage() {
  return <ActivityIndex tipo="minicurso" itens={listarMinicursos()} />;
}
