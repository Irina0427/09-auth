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

  const { mutate: handleDelete, isPending } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  if (!notes.length) {
    return <p className={css.empty}>Нотаток поки немає</p>;
  }

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.item}>
          <div className={css.header}>
            <h2 className={css.title}>{note.title}</h2>
            <span className={css.tag}>{note.tag}</span>
          </div>

          <p className={css.content}>{note.content}</p>

          {note.createdAt && (
            <p className={css.date}>
              {new Date(note.createdAt).toLocaleDateString()}
            </p>
          )}

          <div className={css.actions}>
            <Link href={`/notes/${note.id}`} className={css.link}>
              Переглянути
            </Link>

            <button
              type="button"
              className={css.deleteButton}
              onClick={() => handleDelete(note.id)}
              disabled={isPending}
            >
              Видалити
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
