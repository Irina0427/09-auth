
'use client';

import { useQueryClient } from '@tanstack/react-query';

export default function NotesError({ error, reset }: { error: Error; reset: () => void }) {
  const qc = useQueryClient();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p>Could not fetch the list of notes. {error.message}</p>

      <button
        type="button"
        onClick={() => {
          qc.removeQueries({ queryKey: ['notes'] });
          reset();
        }}
      >
        Try again
      </button>
    </div>
  );
}