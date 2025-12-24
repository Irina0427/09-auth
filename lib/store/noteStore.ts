import { create } from 'zustand';
import type { NoteCreateInput } from '@/types/note';
import { persist } from 'zustand/middleware';

interface NoteDraft {
  draft: NoteCreateInput;
  setDraft: (note: NoteCreateInput) => void;
  clearDraft: () => void;
}

const initialDraft: NoteCreateInput = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useNoteDraft = create<NoteDraft>()(
  persist(
    (set) => {
      return {
        draft: initialDraft,
        setDraft: (note: NoteCreateInput) => set({ draft: note }),
        clearDraft: () => set({ draft: initialDraft }),
      };
    },
    { name: 'draft', partialize: (state) => ({ draft: state.draft }) },
  ),
);