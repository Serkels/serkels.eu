//

import { InputSearch } from "@1/ui/components/InputSearch";
import { OpportunityList } from "./OpportunityList";

//

export default async function Page() {
  return (
    <>
      <aside className="col-span-3 hidden lg:block lg:px-10">
        <article className="mt-10 ">
          <h3 className="font-bold uppercase text-Congress_Blue">
            Opportunités
          </h3>

          <InputSearch />
          <ul></ul>
        </article>
      </aside>
      <main className="col-span-9 mt-10">
        <OpportunityList />
      </main>
    </>
  );
}
