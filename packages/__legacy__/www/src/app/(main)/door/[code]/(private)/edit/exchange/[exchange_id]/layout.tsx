//

import { NextTsyringe } from "@1/next-tsyringe";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import Nest from "react-nest";
import { tv } from "tailwind-variants";
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
      <main className={main()} />
      <Hydrate state={dehydratedState} />
      {children}
    </Nest>
  );
}

const main = tv({
  base: ["col-span-full my-10 px-4 md:col-span-6 xl:col-span-8"],
});
