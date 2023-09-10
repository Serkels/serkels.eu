//

import { Suspense } from "react";
import { ExchangeList } from "./ExchangeList";

//

export default async function Page() {
  return (
    <main className="col-span-full my-10 md:col-span-6 xl:col-span-6 ">
      <Suspense>
        <ExchangeList />
      </Suspense>
    </main>
  );
}
