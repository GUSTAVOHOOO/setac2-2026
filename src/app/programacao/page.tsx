import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/metadata';
import { Schedule } from '@/components/event/Schedule';

export const metadata: Metadata = pageMetadata({
  title: 'Programação',
  description:
    'Programação da Setac² 2026: abertura, palestras, minicursos, competição de programação e corujão de jogos, 05 e 06/10 na UTFPR Santa Helena.',
  path: '/programacao',
});

export default function ProgramacaoPage() {
  return (
    <>
      <h1 className="w98-display-sm site-heading">Programação</h1>
      <Schedule />
    </>
  );
}
