"use client";

import { useSearchParam } from "react-use";
//

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";

//

export const OpportunityFilterContext = createContext<{
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
}>({ category: "", setCategory: () => null });

export function OpportunityFilterContextProvider({
  children,
}: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchCategory = useSearchParam("category");
  const [category, setCategory] = useState(searchCategory ?? "");

  useEffect(() => {
    if (searchCategory === category) return;

    const params = new URLSearchParams(searchParams.toString());
    if (!category) {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    router.push(pathname + "?" + params.toString());
  }, [router, searchParams, category]);

  useEffect(() => {
    setCategory(searchCategory ?? "");
  }, [searchCategory]);

  return (
    <OpportunityFilterContext.Provider value={{ category, setCategory }}>
      {children}
    </OpportunityFilterContext.Provider>
  );
}

export const useOpportunityFilterContext = () =>
  useContext(OpportunityFilterContext);
