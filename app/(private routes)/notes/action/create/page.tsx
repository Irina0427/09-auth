import NoteForm from '@/components/NoteForm/NoteForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create New Note | NoteHub',
  description: 'Create a new note in NoteHub: add a title, content, and tag.',

  openGraph: {
    title: 'Create New Note | NoteHub',
    description: 'Create a new note in NoteHub: add a title, content, and tag.',
    url: 'https://notehub.com/notes/action/create',
    siteName: 'NoteHub',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub — Create Note',
      },
    ],
    type: 'website',
  },
};

export default function CreateNote() {
  return (
    <>
      <NoteForm />
    </>
  );
}