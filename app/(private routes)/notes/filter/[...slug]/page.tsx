import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import type { Metadata } from "next";

import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api/serverApi";
import type { Tag } from "@/types/note";

const siteUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
const ogImage = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

type Props = {
  params: { slug?: string[] };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const filter = params.slug?.[0] ?? "all";

  const title = `Notes (${filter}) | NoteHub`;
  const description = `Browse your notes in NoteHub with filter: ${filter}.`;
  const url = `${siteUrl}/notes/filter/${filter}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, images: [ogImage] },
  };
}

export default async function Page({ params }: Props) {
  const slugTag = params.slug?.[0] ?? "all";
  const tag: Tag | undefined = slugTag === "all" ? undefined : (slugTag as Tag);

  const qc = new QueryClient();

  await qc.prefetchQuery({
    queryKey: ["notes", { search: "", page: 1, tag: tag ?? "" }],
    queryFn: () => fetchNotes("", 1, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NotesClient key={tag ?? "all"} initialTag={tag} />
    </HydrationBoundary>
  );
}
