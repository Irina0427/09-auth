import axios from 'axios';
import type { Note, NoteCreateInput } from '../../types/note';
import { User } from '@/types/user';

const API_HOST = process.env.NEXT_PUBLIC_API_URL;

export const nextServer = axios.create({
  baseURL: `${API_HOST}/api`,
  withCredentials: true,
});

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}
export async function fetchNotes(
  search: string,
  page: number,
  tag?: string,
): Promise<NotesResponse> {
  const params: Record<string, string | number> = { perPage: 12, search, page, sortBy: 'created' };
  if (tag) params.tag = tag;
  const { data } = await nextServer.get<NotesResponse>('/notes', { params });
  return data;
}

export async function createNote(input: NoteCreateInput): Promise<Note> {
  const { data } = await nextServer.post<Note>('/notes', input);
  return data;
}
export async function deleteNote(id: string): Promise<Note> {
  const { data } = await nextServer.delete<Note>(`/notes/${id}`);
  return data;
}
export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await nextServer.get<Note>(`/notes/${id}`);
  return data;
}

export interface RegisterData {
  email: string;
  password: string;
}

export const register = async (registerData: RegisterData): Promise<User> => {
  const { data } = await nextServer.post<User>('/auth/register', registerData);

  return data;
};

export interface LoginData {
  email: string;
  password: string;
}

export async function login(loginData: LoginData) {
  const { data } = await nextServer.post<User>('/auth/login', loginData);
  return data;
}

export const checkSession = async (): Promise<boolean> => {
  const { status, data } = await nextServer.get<{ message: string }>('/auth/session', {
    validateStatus: () => true,
  });
  return status === 200 && data?.message === 'Session refreshed successfully';
};

export async function getMe(): Promise<User> {
  const { data } = await nextServer.get<User>(`/users/me`);
  return data;
}

export async function logout(): Promise<void> {
  await nextServer.post('/auth/logout');
}

export interface UpdateMeData {
  username: string;
}

export async function updateMe(input: UpdateMeData): Promise<User> {
  const { data } = await nextServer.patch<User>('/users/me', input);
  return data;
}