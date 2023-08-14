"use client";

import { useSyncSearchQuery } from "@/components/useSyncSearchQuery";
import {
  createContext,
  useContext,
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
  statefulQuery: [string, Dispatch<SetStateAction<string>>];
}>({
  category: "",
  setCategory: () => null,
  setCategoryAndUrl: () => null,
  query: "",
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
