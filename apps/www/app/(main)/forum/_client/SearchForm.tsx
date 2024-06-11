"use client";

import { DEBOUNCE_DELAY, MAX_WAIT } from ":app/constants";
import { useSyncSearchQuery } from ":components/hooks/useSyncSearchQuery";
import { context } from ":components/shell/AsideFilter.client";
import InputSearch, {
  InputSearch_RightBtn,
} from "@1.ui/react/input/InputSearch";
import { useDebouncedCallback } from "@react-hookz/web";
import Image from "next/image";
import { useContext, type ComponentProps } from "react";

//

export default function SearchForm() {
  const { query, setQuery } = useSyncSearchQuery("q");
  const { toggle } = useContext(context);
  const onChange = useDebouncedCallback<
    NonNullable<ComponentProps<"input">["onChange"]>
  >((ev) => setQuery(ev.target.value), [setQuery], DEBOUNCE_DELAY, MAX_WAIT);
  return (
    <InputSearch onChange={onChange} defaultValue={query}>
      <InputSearch_RightBtn>
        <button className="pr-2 md:hidden" onClick={toggle}>
          <Image
            src="/filter.svg"
            alt="filter"
            width={20}
            height={20}
            priority
          />
        </button>
      </InputSearch_RightBtn>
    </InputSearch>
  );
}
