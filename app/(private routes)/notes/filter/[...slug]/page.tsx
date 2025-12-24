
import { fetchNotes } from '@/lib/api/serverApi';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import NotesClient from './Notes.client';
import type { NoteTag } from '@/types/note';
import { NOTES_TAGS } from '@/lib/constants';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug?: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const raw = slug?.[0] ?? 'all';
  const isValid = raw === 'all' || NOTES_TAGS.includes(raw as NoteTag);
  const filter = isValid ? raw : 'all';

  const title = filter === 'all' ? 'All Notes | NoteHub' : `Notes — ${filter} | NoteHub`;

  const description =
    filter === 'all' ? 'Browse all notes on NoteHub.' : `Browse ${filter} notes on NoteHub.`;

  const url = `https://notehub.com/notes/filter/${filter}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub',
        },
      ],
      type: 'website',
    },
  };
}

export default async function Notes({ params }: Props) {
  const { slug } = await params;

  const raw = slug?.[0] ?? 'all';

  const isValid = raw === 'all' || NOTES_TAGS.includes(raw as NoteTag);
  if (!isValid) redirect('/notes/filter/all');

  const tag = raw === 'all' ? undefined : (raw as NoteTag);

  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ['notes', '', 1, tag],
    queryFn: () => fetchNotes('', 1, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NotesClient key={tag ?? 'all'} initialTag={tag} />
    </HydrationBoundary>
  );
}