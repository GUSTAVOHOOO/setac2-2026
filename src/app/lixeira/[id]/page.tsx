import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArquivoWindow } from '@/components/event/ArquivoWindow';
import { getArquivoLixeira, LIXEIRA } from '@/data/lixeira';
import { pageMetadata } from '@/lib/metadata';

/** Só os arquivos que existem na Lixeira; qualquer outro vira 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return LIXEIRA.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: PageProps<'/lixeira/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const a = getArquivoLixeira(id);
  if (!a) return {};
  return pageMetadata({
    title: a.nome,
    description: `${a.nome}, achado na Lixeira da Setac² 2026.`,
    path: `/lixeira/${a.id}`,
  });
}

export default async function ArquivoPage({ params }: PageProps<'/lixeira/[id]'>) {
  const { id } = await params;
  const a = getArquivoLixeira(id);
  if (!a) notFound();
  return (
    <>
      <h1 className="sr-only">{a.nome}</h1>
      <ArquivoWindow arquivo={a} closeHref="/lixeira" />
    </>
  );
}
