
'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { fetchNoteById } from '@/lib/api/clientApi';
import css from './NoteDetails.module.css';
import Link from 'next/link';
import ercss from '@/components/ErrorMessage/ErrorMessage.module.css';

export default function NoteDetailsClient() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError || !data)
    return (
      <div className={css.wrap}>
        <p className={css.msg}>Something went wrong.</p>
        <Link href="/" className={ercss.link}>
          <span aria-hidden>←</span>
          Go back
        </Link>
      </div>
    );

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{data.title}</h2>
        </div>
        <p className={css.content}>{data.content}</p>
        <p className={css.date}>{new Date(data.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}