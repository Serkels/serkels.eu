"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";

//

export const OpportunityFilterContext = createContext<{
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  setCategoryAndUrl: Dispatch<SetStateAction<string>>;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  setQueryAndUrl: Dispatch<SetStateAction<string>>;
}>({
  category: "",
  setCategory: () => null,
  setCategoryAndUrl: () => null,
  query: "",
  setQuery: () => null,
  setQueryAndUrl: () => null,
});

export function OpportunityFilterContextProvider({
  children,
  pathname,
}: PropsWithChildren<{ pathname?: string }>) {
  const router = useRouter();
  const actual_pathname = usePathname();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("q");
  const searchCategory = searchParams.get("category");
  const shouldUpdateUrl = useRef(false);

  const [category, setCategory] = useState(searchCategory ?? "");
  const [query, setQuery] = useState(searchQuery ?? "");

  const updateUrl = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (searchCategory !== category) {
      if (!category) {
        params.delete("category");
      } else {
        params.set("category", category);
      }
    }

    if (searchQuery !== query) {
      if (!query) {
        params.delete("q");
      } else {
        params.set("q", query);
      }
    }

    if (params.toString() === searchParams.toString()) return;

    router.push(`${pathname ?? actual_pathname}?${params.toString()}`);
  }, [category, query, searchCategory, searchQuery]);

  useShouldUpdateStateFromSearchParams("category", category, setCategory);
  useShouldUpdateStateFromSearchParams("q", query, setQuery);

  useEffect(() => {
    if (!shouldUpdateUrl.current) return;
    shouldUpdateUrl.current = false;
    updateUrl();
  }, [category, query]);

  return (
    <OpportunityFilterContext.Provider
      value={{
        category,
        setCategory,
        setCategoryAndUrl: (value: SetStateAction<string>) => {
          const new_category =
            typeof value === "function" ? value(category) : value;
          shouldUpdateUrl.current = true;
          setCategory(new_category);
        },
        query,
        setQuery,
        setQueryAndUrl: (value: SetStateAction<string>) => {
          const new_query = typeof value === "function" ? value(query) : value;
          shouldUpdateUrl.current = true;
          setQuery(new_query);
        },
      }}
    >
      {children}
    </OpportunityFilterContext.Provider>
  );
}

export const useOpportunityFilterContext = () =>
  useContext(OpportunityFilterContext);

//

function useShouldUpdateStateFromSearchParams(
  name: string,
  prevState: string,
  setState: Dispatch<SetStateAction<string>>
) {
  const searchParams = useSearchParams();
  const param = searchParams.get(name);
  useEffect(() => {
    if (param === prevState) return;
    setState(param ?? "");
  }, [param, setState]);
}
