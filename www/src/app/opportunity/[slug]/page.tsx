//

import { InputSearch } from "@1/ui/components/InputSearch";
import { OpportunityArticle } from "./OpportunityArticle";
import { SeeAlso } from "./SeeAlso";

//

export default async function Page() {
  return (
    <>
      <aside className="col-span-3 hidden shadow lg:block lg:px-10">
        <article className="mt-10 ">
          <h3 className="font-bold uppercase text-Congress_Blue">
            Opportunités
          </h3>

          <InputSearch />
          <ul></ul>
        </article>
      </aside>
      <main className="col-span-6 bg-white">
        <OpportunityArticle />
      </main>
      <aside className="col-span-3 lg:px-10">
        <SeeAlso category="category-X" />
      </aside>
    </>
  );
}
