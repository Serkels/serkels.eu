//

import { ExchangeList } from "./ExchangeList";
import { SeeAlso } from "./SeeAlso";

//

export default async function Page() {
  return (
    <>
      <main className="col-span-full my-10 md:col-span-6 xl:col-span-6 ">
        <ExchangeList />
      </main>
      <aside className="col-span-3 hidden lg:px-10 xl:block">
        <SeeAlso />
      </aside>
    </>
  );
}
