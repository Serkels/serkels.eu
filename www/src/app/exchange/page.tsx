//

import { InputSearch } from "@1/ui/components/InputSearch";
import { ExchangeList } from "./ExchangeList";
import { SeeAlso } from "./SeeAlso";

//

export default async function Page() {
  return (
    <>
      <aside className="hidden md:col-span-2 md:block lg:col-span-3 ">
        <article className="mt-10 pl-4">
          <h3 className="font-bold uppercase text-Cerulean">Échanges</h3>

          <InputSearch />

          <ul></ul>
        </article>
      </aside>
      <main className="col-span-4 mt-10 sm:col-span-6 ">
        <ExchangeList />
      </main>
      <aside className="mt-10 hidden lg:col-span-3 lg:block ">
        <SeeAlso />
      </aside>
    </>
  );
}
