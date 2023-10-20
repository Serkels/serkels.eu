"use client";

import InputSearch from "@1.ui/react/input/InputSearch";
import { useDebouncedCallback } from "@react-hookz/web";
import type { ComponentProps } from "react";
import { useSyncSearchQuery } from "~/components/useSyncSearchQuery";

//

export default function SearchForm() {
  const { query, setQuery } = useSyncSearchQuery("q");
  const onChange = useDebouncedCallback<
    NonNullable<ComponentProps<"input">["onChange"]>
  >((ev) => setQuery(ev.target.value), [], 300, 500);
  return <InputSearch onChange={onChange} defaultValue={query} />;
}
