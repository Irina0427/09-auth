'use client';

import css from './NoteForm.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createNote } from '@/lib/api/clientApi';
import type { NoteCreateInput } from '../../types/note';
import { NOTES_TAGS } from '@/lib/constants';
import { useNoteDraft } from '@/lib/store/noteStore';
import { ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function NoteForm() {
  const { draft, setDraft, clearDraft } = useNoteDraft();
  const qc = useQueryClient();
  const router = useRouter();

  const createMut = useMutation({
    mutationFn: (values: NoteCreateInput) => createNote(values),
    onSuccess: () => {
      clearDraft();
      qc.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note created');
      router.push('/notes/filter/all');
    },
    onError: () => toast.error('Failed to create note'),
  });

  const handleSubmit = (formData: FormData) => {
    const noteData = Object.fromEntries(formData) as unknown as NoteCreateInput;
    createMut.mutate(noteData);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setDraft({ ...draft, [name]: value });
  };

  return (
    <div className={css.page}>
      <div className={css.card}>
        <h1 className={css.title}>Create note</h1>

        <form className={css.form} action={handleSubmit}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              className={css.input}
              value={draft.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              className={css.textarea}
              value={draft.content}
              onChange={handleChange}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <select
              id="tag"
              name="tag"
              className={css.select}
              value={draft.tag}
              onChange={handleChange}
            >
              {NOTES_TAGS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          <div className={css.actions}>
            <button type="button" className={css.cancelButton} onClick={() => router.back()}>
              Cancel
            </button>
            <button type="submit" className={css.submitButton} disabled={createMut.isPending}>
              {createMut.isPending ? 'Creating...' : 'Create note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}