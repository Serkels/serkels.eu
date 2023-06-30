"use client";

//

import { InputSearch } from "@1/ui/components/InputSearch";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useRef, type FormEventHandler } from "react";
import { useOpportunityFilterContext } from "./OpportunityFilter.context";

//

export function SearchForm() {
  const router = useRouter();
  const location = usePathname();
  const inputSearch = useRef<HTMLInputElement>(null);
  const inputValue = useRef("");
  const { setQueryAndUrl, query } = useOpportunityFilterContext();
  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();
      setQueryAndUrl(inputValue.current);
    },
    [inputSearch.current, router, location]
  );

  return (
    <form onSubmit={onSubmit}>
      <InputSearch
        ref={inputSearch}
        defaultValue={query}
        onReset={() => setQueryAndUrl("")}
        onChange={(e) => (inputValue.current = e.target.value)}
      />
    </form>
  );
}
