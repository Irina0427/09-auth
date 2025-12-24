import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/serverApi';
import NotePreview from './NotePreview.client';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NotePreviewPage({ params }: Props) {
  const { id } = await params;

  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NotePreview />
    </HydrationBoundary>
  );
}