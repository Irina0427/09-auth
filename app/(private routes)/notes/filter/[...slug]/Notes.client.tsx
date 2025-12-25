"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api/clientApi";
import type { Tag } from "@/types/note";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import { useDebounce } from "@/components/hooks/UseDebounce";

import Loading from "@/app/loading";
import Error from "./error";

import css from "./Notes.module.css";

type Props = {
  initialTag?: Tag;
};

export default function NotesClient({ initialTag }: Props) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState<Tag | undefined>(initialTag);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, tag]);

  const {
    data,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery({
    queryKey: ["notes", { search: debouncedSearch, page, tag: tag ?? "" }],
    queryFn: () => fetchNotes(debouncedSearch, page, tag),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  const handleSearchChange = (value: string) => setSearch(value);

  return (
    <div className={css.wrapper}>
      <div className={css.topBar}>
        <SearchBox value={search} onChange={handleSearchChange} />

        <Link href="/notes/action/create" className={css.button}>
          Створити нотатку +
        </Link>
      </div>

      {isLoading && <Loading />}
      {isError && <Error error={error} />}

      {isSuccess && notes.length > 0 && (
        <>
          <NoteList notes={notes} />

          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}
