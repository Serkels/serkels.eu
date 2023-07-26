//
import { Suspense } from "react";
import { OpportunityInfiniteList } from "./OpportunityInfiniteList";

//
export const revalidate = 60;

export default async function Page() {
  return (
    <main className="col-span-full my-10 md:col-span-6 xl:col-span-9">
      <Suspense fallback={null}>
        <OpportunityInfiniteList />
      </Suspense>
    </main>
  );
}
