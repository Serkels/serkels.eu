//

import { TRPC_SSR } from ":trpc/server";
import { CreateExchangeForm } from "./page.client";

//

export default async function Page() {
  const categories = await TRPC_SSR.category.exchange.fetch();
  return (
    <main className="col-span-full my-10 px-4 md:col-span-6 xl:col-span-8">
      <CreateExchangeForm categories={categories} />
    </main>
  );
}
