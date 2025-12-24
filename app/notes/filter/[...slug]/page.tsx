import type { Metadata } from "next";
import NotesClient from "./Notes.client";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const ogImage = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const filter = slug?.[0] ?? "all";

  const title = `Notes (${filter}) | NoteHub`;
  const description = `Browse your notes in NoteHub with filter: ${filter}.`;
  const url = `${siteUrl}/notes/filter/${filter}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [ogImage],
    },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;

  const category = slug?.[0] ?? "all";

  return <NotesClient category={category} />;
}
