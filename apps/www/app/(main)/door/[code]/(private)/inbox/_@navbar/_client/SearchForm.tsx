"use client";

import { useSyncSearchQuery } from ":components/hooks/useSyncSearchQuery";
import InputSearch from "@1.ui/react/input/InputSearch";
import { useDebouncedCallback } from "@react-hookz/web";
import type { ComponentProps } from "react";

//

export default function SearchForm() {
  const { query, setQuery } = useSyncSearchQuery("q");
  const onChange = useDebouncedCallback<
    NonNullable<ComponentProps<"input">["onChange"]>
  >((ev) => setQuery(ev.target.value), [setQuery], 666, 500);
  return (
    <div>
      <InputSearch
        className="shadow-[0px_12px_44px_#0000000D]"
        defaultValue={query}
        onChange={onChange}
      />
    </div>
  );
}
