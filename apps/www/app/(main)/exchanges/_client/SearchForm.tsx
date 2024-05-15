"use client";

import { DEBOUNCE_DELAY, MAX_WAIT } from ":app/constants";
import { useSyncSearchQuery } from ":components/hooks/useSyncSearchQuery";
import InputSearch from "@1.ui/react/input/InputSearch";
import { useDebouncedCallback } from "@react-hookz/web";
import type { ComponentProps } from "react";

//

export default function SearchForm() {
  const { query, setQuery } = useSyncSearchQuery("q");
  const onChange = useDebouncedCallback<
    NonNullable<ComponentProps<"input">["onChange"]>
  >((ev) => setQuery(ev.target.value), [setQuery], DEBOUNCE_DELAY, MAX_WAIT);
  return <InputSearch onChange={onChange} defaultValue={query} />;
}
