"use client";

import { useSyncSearchQuery } from ":components/hooks/useSyncSearchQuery";
import InputSearch from "@1.ui/react/input/InputSearch";
import { useDebouncedCallback } from "@react-hookz/web";
import { usePathname, useRouter } from "next/navigation";
import { type ComponentProps } from "react";

//

export default function SearchForm() {
  const { query, setQuery } = useSyncSearchQuery("q");
  const pathname = usePathname() ?? "";
  const router = useRouter();

  const onChange = useDebouncedCallback<
    NonNullable<ComponentProps<"input">["onChange"]>
  >(
    (ev) =>
      pathname === "/opportunities"
        ? setQuery(ev.target.value)
        : router.push(`/opportunities?q=${ev.target.value}`),
    [setQuery, pathname],
    200,
    1_666,
  );

  return <InputSearch onChange={onChange} defaultValue={query} />;
}
