import type { Metadata } from "next";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const ogImage = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);

    const title = `${note.title} | NoteHub`;
    const description = note.content
      ? note.content.slice(0, 140)
      : "Note details in NoteHub.";
    const url = `${siteUrl}/notes/${id}`;

    return {
      title,
      description,
      openGraph: { title, description, url, images: [ogImage] },
    };
  } catch {
    const title = "Note | NoteHub";
    const description = "Note details in NoteHub.";
    const url = `${siteUrl}/notes/${id}`;

    return {
      title,
      description,
      openGraph: { title, description, url, images: [ogImage] },
    };
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <NoteDetailsClient id={id} />;
}
