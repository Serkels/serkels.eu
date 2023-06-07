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
          <h3 className="text-2xl font-bold uppercase text-Congress_Blue">
            Question-réponse
          </h3>

          <ul className="mt-8">
            <li>
              <input type="radio" id="latest" />
              <label className="ml-2 text-[#656565]" htmlFor="latest">
                Les dernières questions
              </label>
            </li>
          </ul>
        </article>
      </aside>
      <main className="col-span-6 mt-10">
        <InputSearch />
        <hr className="my-10" />
        <FaqList />
      </main>
      <aside className="col-span-3 mt-10 lg:px-10">
        <SeeAlso />
      </aside>
    </>
  );
}
