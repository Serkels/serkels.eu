//

import { dehydrate, Hydrate } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import Nest from "react-nest";
import { injector } from "~/core/react";
import { Get_Category_UseCase } from "~/modules/categories/application/get_categories.use-case";

//

export default async function Layout({ children }: PropsWithChildren) {
  const queryClient = await injector()
    .resolve(Get_Category_UseCase)
    .prefetch("exchange");

  const dehydratedState = dehydrate(queryClient);
  return (
    <Nest>
      <Hydrate state={dehydratedState} />
      {children}
    </Nest>
  );
}
