//

import { InputSearch } from "@1/ui/components/InputSearch";

import { getServerSession } from "next-auth";
import { FaqForm } from "./FaqForm";
import { FaqList } from "./FaqList";
import { SeeAlso } from "./SeeAlso";

//

export default async function Page() {
  const session = await getServerSession();
  const isConncected = Boolean(session?.user?.email);

  return (
    <>
      <main className="col-span-6 mb-5 mt-10">
        <InputSearch />
        {isConncected ? (
          <>
            <hr className="my-5 border-none" />
            <FaqForm />
          </>
        ) : null}
        <hr className="my-10" />
        <FaqList />
      </main>
      <aside className="col-span-3 mt-10 lg:px-10">
        <SeeAlso />
      </aside>
    </>
  );
}
