"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Note } from "@/types/note";
import { deleteNote } from "@/lib/api/clientApi";

import css from "./NoteList.module.css";

type Props = {
  notes: Note[];
};

export default function NoteList({ notes }: Props) {
  const queryClient = useQueryClient();

  const { mutate: removeNote, isPending } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>

          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>

            <div className={css.actions}>
              <Link className={css.detailsLink} href={`/notes/${note.id}`}>
                Переглянути деталі
              </Link>

              <button
                type="button"
                className={css.deleteButton}
                onClick={() => removeNote(note.id)}
                disabled={isPending}
              >
                Видалити
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
