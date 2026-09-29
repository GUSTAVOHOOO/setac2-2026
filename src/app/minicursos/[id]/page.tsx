import type { Metadata } from 'next';
import { TalkCard } from '@/components/event/TalkCard';
import { metadataDe, paramsDe, resolver } from '@/lib/activity-page';

/** Só os ids gerados no build; qualquer outro vira 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return paramsDe('minicurso');
}

export async function generateMetadata({
  params,
}: PageProps<'/minicursos/[id]'>): Promise<Metadata> {
  const { id } = await params;
  return metadataDe(id, 'minicurso');
}

export default async function MinicursoPage({ params }: PageProps<'/minicursos/[id]'>) {
  const { id } = await params;
  const p = resolver(id, 'minicurso');
  return <TalkCard id={p.id} headingLevel="h1" closeHref="/minicursos" />;
}
