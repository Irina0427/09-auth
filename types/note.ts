export type Tag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export type NoteTag = Tag;
export interface Note {
  id: string;
  title: string;
  content: string;
  tag: Tag;
  createdAt: string;
  updatedAt: string;
}

export interface NewNote {
  title: string;
  content?: string;
  tag: Tag;
}
export interface CategoryType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}