"use client";

import {
  createContext,
  useContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";
import { useSyncSearchQuery } from "~/components/useSyncSearchQuery";

//

export const OpportunityFilterContext = createContext<{
  category: string | undefined;
  setCategory: Dispatch<SetStateAction<string | undefined>>;
  setCategoryAndUrl: Dispatch<SetStateAction<string | undefined>>;
  query: string | undefined;
  setQuery: Dispatch<SetStateAction<string | undefined>>;
  setQueryAndUrl: Dispatch<SetStateAction<string | undefined>>;
  statefulQuery: [
    string | undefined,
    Dispatch<SetStateAction<string | undefined>>,
  ];
}>({
  category: undefined,
  setCategory: () => null,
  setCategoryAndUrl: () => null,
  query: undefined,
  setQuery: () => null,
  setQueryAndUrl: () => null,
} as any);

export function OpportunityFilterContextProvider({
  children,
}: PropsWithChildren<{ pathname?: string }>) {
  const { query: searchQuery, setQuery: setSearchQuery } =
    useSyncSearchQuery("q");
  const { query: categoryQuery, setQuery: setCategoryQuery } =
    useSyncSearchQuery("category");

  return (
    <OpportunityFilterContext.Provider
      value={{
        category: categoryQuery,
        setCategory: setCategoryQuery,
        setCategoryAndUrl: setCategoryQuery,
        query: searchQuery,
        setQuery: setSearchQuery,
        setQueryAndUrl: setSearchQuery,
        statefulQuery: [searchQuery, setSearchQuery],
      }}
    >
      {children}
    </OpportunityFilterContext.Provider>
  );
}

export const useOpportunityFilterContext = () =>
  useContext(OpportunityFilterContext);
