//

import { InputSearch } from "@1/ui/components/InputSearch";
import { FaqForm } from "./FaqForm";
import { FaqList } from "./FaqList";
import { SeeAlso } from "./SeeAlso";

//

export default async function Page() {
  return (
    <>
      <main className="col-span-6 mb-5 mt-10">
        <InputSearch />
        <hr className="my-5 border-none" />
        <FaqForm />
        <hr className="my-10" />
        <FaqList />
      </main>
      <aside className="col-span-3 mt-10 lg:px-10">
        <SeeAlso />
      </aside>
    </>
  );
}
