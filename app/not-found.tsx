import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const ogImage = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

export const metadata: Metadata = {
  title: "Page not found | NoteHub",
  description: "This page does not exist in NoteHub.",
  alternates: { canonical: `${siteUrl}/not-found` },
  openGraph: {
    title: "Page not found | NoteHub",
    description: "This page does not exist in NoteHub.",
    url: `${siteUrl}/not-found`,
    images: [ogImage],
  },
};

export default function NotFound() {
  return <h1>404 — Page not found</h1>;
}
