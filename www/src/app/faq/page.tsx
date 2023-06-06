//

import { InputSearch } from "@1/ui/components/InputSearch";
import { FaqList } from "./FaqList";
import { SeeAlso } from "./SeeAlso";

//

export default async function Page() {
  return (
    <>
      <aside className="col-span-3 hidden lg:block lg:px-10">
        <article className="mt-10">
          <h3 className="font-bold uppercase text-[#00adee]">Échanges</h3>

          <InputSearch />

          <ul></ul>
        </article>
      </aside>
      <main className="col-span-6 mt-10">
        <InputSearch />
        <hr />
        <FaqList />
      </main>
      <aside className="col-span-3 mt-10 lg:px-10">
        <SeeAlso />
      </aside>
    </>
  );
}
