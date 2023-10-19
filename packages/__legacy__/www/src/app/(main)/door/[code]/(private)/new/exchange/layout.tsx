//

import { NextTsyringe } from "@1/next-tsyringe";
import { dehydrate, Hydrate } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import Nest from "react-nest";
import { Main_Module } from "~/app/(main)/layout";
import { Get_Category_UseCase } from "~/modules/categories/application/get_categories.use-case";

//

export default async function Layout({ children }: PropsWithChildren) {
  const container = await NextTsyringe.injector(Main_Module);
  const queryClient = await container
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
