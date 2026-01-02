import { api } from "./api";
import type { Note, NoteTag } from "@/types/note";
import type { User } from "@/types/user";
import type { AxiosResponse, RawAxiosRequestHeaders } from "axios";



export type NotesResponse = {
  notes: Note[];
  totalPages: number;
};


export function createCookieHeaderFromTokens(tokens: {
  accessToken?: string;
  refreshToken?: string;
}): RawAxiosRequestHeaders {
  const cookies: string[] = [];

  if (tokens.accessToken) {
    cookies.push(`accessToken=${tokens.accessToken}`);
  }

  if (tokens.refreshToken) {
    cookies.push(`refreshToken=${tokens.refreshToken}`);
  }

  return cookies.length
    ? { Cookie: cookies.join("; ") }
    : {};
}


export async function fetchNotes(
  search: string,
  page: number,
  tag?: NoteTag
): Promise<NotesResponse> {
  const params: Record<string, string | number> = {
    perPage: 12,
    search,
    page,
  };

  if (tag) params.tag = tag;

  const { data } = await api.get<NotesResponse>("/notes", {
    params,
  });

  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/users/me");
  return data;
}


export async function checkSession(
  headers: RawAxiosRequestHeaders
): Promise<AxiosResponse<{ success: boolean }>> {
  return api.get("/auth/session", {
    headers,
    validateStatus: () => true,
  });
}


