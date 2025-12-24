import { cookies } from "next/headers";
import { api } from "./api";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";

export type NotesResponse = {
  notes: Note[];
  totalPages: number;
};

function getCookieHeader() {
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();
  return cookieHeader ? { Cookie: cookieHeader } : undefined;
}

export async function fetchNotes(
  search: string,
  page: number,
  tag?: NoteTag,
): Promise<NotesResponse> {
  const params: Record<string, string | number> = { perPage: 12, search, page };
  if (tag) params.tag = tag;

  const { data } = await api.get<NotesResponse>("/notes", {
    params,
    headers: getCookieHeader(),
  });

  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: getCookieHeader(),
  });
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/users/me", {
    headers: getCookieHeader(),
  });
  return data;
}

export async function checkSession(): Promise<boolean> {
  const { data } = await api.get<{ success: boolean }>("/auth/session", {
    headers: getCookieHeader(),
    validateStatus: () => true,
  });
  return Boolean(data?.success);
}
