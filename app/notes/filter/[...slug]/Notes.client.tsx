"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import { useDebounce } from "@/components/hooks/UseDebounce";
import NoteList from "@/components/NoteList/NoteList";

import Loading from "@/app/loading";
import Error from "./error";
import css from "./LayoutNotes.module.css";

interface NotesClientProps {
  category: string;
}

export default function NotesClient({ category }: NotesClientProps) {
  const [page, setPage] = useState<number>(1);
  const [topic, setTopic] = useState<string>("");

  const debouncedSearch = useDebounce(topic, 500);

  const handleSearchChange = (value: string) => {
    setTopic(value);
    setPage(1);
  };

  // Якщо змінився фільтр (категорія) — повертаємось на 1 сторінку
  useEffect(() => {
    setPage(1);
  }, [category]);

  const tag =
    category && category !== "all" ? category : undefined;

  const search =
    debouncedSearch.trim().length > 0 ? debouncedSearch.trim() : undefined;

  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ["notes", { search: search ?? "", category: tag ?? "", page }],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        tag,
        search,
      }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <div className={css.topBar}>
        <SearchBox value={topic} onChange={handleSearchChange} />

        <Link href="/notes/action/create" className={css.createBtn}>
          Створити нотатку +
        </Link>
      </div>

      {isSuccess && totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      )}

      {isLoading && <Loading />}
      {isError && <Error error={error} />}

      <NoteList notes={notes} />
    </div>
  );
}
