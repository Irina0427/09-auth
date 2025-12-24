import type { AxiosError } from "axios";
import { api } from "./api";
import type { Note, NoteCreateInput, NoteTag } from "@/types/note";
import type { User } from "@/types/user";

export type NotesResponse = {
  notes: Note[];
  totalPages: number;
};

export async function fetchNotes(
  search: string,
  page: number,
  tag?: NoteTag,
): Promise<NotesResponse> {
  const params: Record<string, string | number> = { perPage: 12, search, page };
  if (tag) params.tag = tag;

  const { data } = await api.get<NotesResponse>("/notes", { params });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(input: NoteCreateInput): Promise<Note> {
  const { data } = await api.post<Note>("/notes", input);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}

export type RegisterData = { email: string; password: string };
export type LoginData = { email: string; password: string };

export async function register(payload: RegisterData): Promise<User> {

  await api.post("/auth/register", payload);
  return getMe();
}

export async function login(payload: LoginData): Promise<User> {
  await api.post("/auth/login", payload);
  return getMe();
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

/**
 * Returns true if there is an active session OR it was refreshed via refreshToken.
 * (app/api/auth/session returns { success: boolean } with 200 status)
 */
export async function checkSession(): Promise<boolean> {
  const { data } = await api.get<{ success: boolean }>("/auth/session", {
    validateStatus: () => true,
  });
  return Boolean(data?.success);
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/users/me");
  return data;
}

export type UpdateMeData = { username: string };
export async function updateMe(input: UpdateMeData): Promise<User> {
  const { data } = await api.patch<User>("/users/me", input);
  return data;
}


export function getErrorMessage(error: unknown): string {
  const err = error as AxiosError<{ error?: string; message?: string }>;
  return err?.response?.data?.error ?? err?.response?.data?.message ?? "Something went wrong";
}
