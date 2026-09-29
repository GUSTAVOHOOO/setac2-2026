import type { Metadata } from 'next';
import { TalkCard } from '@/components/event/TalkCard';
import { metadataDe, paramsDe, resolver } from '@/lib/activity-page';

/** Só os ids gerados no build; qualquer outro vira 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return paramsDe('palestra');
}

export async function generateMetadata({
  params,
}: PageProps<'/palestras/[id]'>): Promise<Metadata> {
  const { id } = await params;
  return metadataDe(id, 'palestra');
}

export default async function PalestraPage({ params }: PageProps<'/palestras/[id]'>) {
  const { id } = await params;
  const p = resolver(id, 'palestra');
  return <TalkCard id={p.id} headingLevel="h1" closeHref="/palestras" />;
}
