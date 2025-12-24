"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import css from "./NoteForm.module.css";

import { createNote } from "@/lib/api";
import { useNoteStore, initialDraft } from "@/lib/store/noteStore";
import type { Tag } from "@/types/note";

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteStore((s) => s.draft);
  const setDraft = useNoteStore((s) => s.setDraft);
  const clearDraft = useNoteStore((s) => s.clearDraft);

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.back();
    },
  });

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "title") setDraft({ title: value });
    if (name === "content") setDraft({ content: value });
    if (name === "tag") setDraft({ tag: value as Tag });
  };

  const action = (formData: FormData) => {
    const title = String(formData.get("title") ?? "").trim();
    const content = String(formData.get("content") ?? "");
    const tag = String(formData.get("tag") ?? "Todo") as Tag;

    mutate({ title, content, tag });
  };

  return (
    <form className={css.form} action={action}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          className={css.input}
          id="title"
          name="title"
          defaultValue={draft?.title ?? initialDraft.title}
          required
          minLength={3}
          maxLength={50}
          onChange={onChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          className={css.textarea}
          id="content"
          name="content"
          rows={8}
          defaultValue={draft?.content ?? initialDraft.content}
          maxLength={500}
          onChange={onChange}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          className={css.select}
          id="tag"
          name="tag"
          defaultValue={draft?.tag ?? initialDraft.tag}
          onChange={onChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>

        <button type="submit" className={css.submitButton} disabled={isPending}>
          Create note
        </button>
      </div>
    </form>
  );
}
