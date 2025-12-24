
import axios from "axios";
import type { Note, NewNote, CategoryType } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";
export type CreateNotePayload = NewNote;

export interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

const getApiInstance = () => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
  if (!token) throw new Error("NEXT_PUBLIC_NOTEHUB_TOKEN is missing!");

  return axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<NotesHttpResponse> => {
  const api = getApiInstance();

  const queryParams: Record<string, string | number> = {
    page: params.page,
    perPage: params.perPage,
  };

  if (params.search) queryParams.search = params.search;
  if (params.tag && params.tag !== "all") queryParams.tag = params.tag;

  const res = await api.get<NotesHttpResponse>("/notes", {
    params: queryParams,
  });
  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const api = getApiInstance();
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
};

export const createNote = async (newNote: NewNote): Promise<Note> => {
  const api = getApiInstance();
  const res = await api.post<Note>("/notes", newNote);
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const api = getApiInstance();
  const res = await api.delete<Note>(`/notes/${id}`);
  return res.data;
};

export const getCategories = async (): Promise<CategoryType[]> => {
  const api = getApiInstance();
  const res = await api.get<CategoryType[]>("/categories");
  return res.data;
};

export interface NewNoteData {
  title: string;
  content: string;
}

export const editNote = async (
  id: string,
  newNoteData: NewNoteData
): Promise<Note> => {
  const api = getApiInstance();
  const res = await api.patch<Note>(`/notes/${id}`, newNoteData);
  return res.data;
};
