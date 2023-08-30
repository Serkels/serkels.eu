//

import { Spinner } from "@1/ui/components/Spinner";
import { Suspense } from "react";
import { OpportunityInfiniteList } from "./OpportunityInfiniteList";

//
export const revalidate = 60;

export default async function Page() {
  return (
    <main className="col-span-full my-10 md:col-span-6 xl:col-span-9">
      <Suspense fallback={<Spinner />}>
        <OpportunityInfiniteList />
      </Suspense>
    </main>
  );
}
