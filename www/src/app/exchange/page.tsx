//

import { Suspense } from "react";
import { ExchangeList } from "./ExchangeList";
import { SeeAlso } from "./SeeAlso";

//

export const dynamic = "force-dynamic";

//

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const search = searchParams["q"] as string | undefined;
  const category = searchParams["category"] as string | undefined;
  return (
    <>
      <main className="col-span-full my-10 md:col-span-6 xl:col-span-6 ">
        <Suspense>
          <ExchangeList category={category} search={search} />
        </Suspense>
      </main>
      <aside className="col-span-3 hidden lg:px-10 xl:block">
        <SeeAlso />
      </aside>
    </>
  );
}
