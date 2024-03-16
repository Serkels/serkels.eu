"use client";

//

import type { RouterInput } from "@1.infra/trpc";
import type { ID_Schema } from "@1.modules/core/domain";
import { createContext, useContext, type PropsWithChildren } from "react";

//

const Page_Context = createContext({
  exclude_ids: [] as ID_Schema[],
  query_see_also: {} as RouterInput["opportunity"]["find"]["public"],
});

//

export function SeeAlso_Provider({
  children,
  category,
  exclude_ids,
}: PropsWithChildren<{ category: string; exclude_ids: ID_Schema[] }>) {
  return (
    <Page_Context.Provider
      value={{
        exclude_ids,
        query_see_also: { category, limit: 5 },
      }}
    >
      {children}
    </Page_Context.Provider>
  );
}
export function useSeeAlso() {
  return useContext(Page_Context);
}
export const _Page_Context = createContext({ query_see_also: {} } as {
  query_see_also: RouterInput["opportunity"]["find"]["public"];
});
