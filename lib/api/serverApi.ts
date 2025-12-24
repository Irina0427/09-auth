import { cookies } from 'next/headers';
import type { Note } from '../../types/note';
import { nextServer } from './clientApi';
import { User } from '@/types/user';
import { AxiosResponse } from 'axios';

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  search: string,
  page: number,
  tag?: string,
): Promise<NotesResponse> {
  const params: Record<string, string | number> = {
    perPage: 12,
    search,
    page,
    sortBy: 'created',
  };
  if (tag) params.tag = tag;

  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const { data } = await nextServer.get<NotesResponse>('/notes', {
    params,
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
  });

  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const { data } = await nextServer.get<Note>(`/notes/${id}`, {
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
  });

  return data;
}
export async function getMe(): Promise<User> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const { data } = await nextServer.get<User>('/users/me', {
    headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
  });

  return data;
}

export type SessionAxiosResponse = AxiosResponse<{ message?: string }>;

export const checkServerSession = async (): Promise<SessionAxiosResponse> => {
  const cookieStore = await cookies();
  return nextServer.get<{ message?: string }>('/auth/session', {
    headers: { Cookie: cookieStore.toString() },
    validateStatus: () => true,
  });
};