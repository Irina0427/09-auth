'use client';

import { useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/clientApi';

import modal from '@/components/Modal/Modal.module.css';
import css from './NotePreview.module.css';

export default function NotePreview() {
  const router = useRouter();
  const onClose = useCallback(() => router.back(), [router]);
  return <NotePreviewModal onClose={onClose} />;
}

function NotePreviewModal({ onClose }: { onClose: () => void }) {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className={modal.backdrop} role="dialog" aria-modal="true" onClick={onClose}>
      <div className={modal.panel} onClick={(e) => e.stopPropagation()}>
        <button className={modal.close} onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className={css.container}>
          {isLoading ? (
            <p>Loading, please wait...</p>
          ) : isError || !data ? (
            <div className={css.wrap}>
              <p className={css.msg}>Something went wrong.</p>
            </div>
          ) : (
            <div className={css.item}>
              <div className={css.header}>
                <h2>{data.title}</h2>
              </div>
              <p className={css.content}>{data.content}</p>
              <p className={css.date}>{new Date(data.createdAt).toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}