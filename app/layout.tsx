import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const ogImage = "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: {
    default: "NoteHub",
    template: "%s | NoteHub",
  },
  description: "A simple and convenient app for managing your notes",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "NoteHub",
    description: "A simple and convenient app for managing your notes",
    url: siteUrl,
    images: [ogImage],
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
  modal?: React.ReactNode;
};

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="uk" className={roboto.variable}>
      <body>
        <TanStackProvider>
          <Header />
          {children}
          {modal ?? null}
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
