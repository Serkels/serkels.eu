//

import { InputSearch } from "@1/ui/components/InputSearch";
import { Footer } from "@1/ui/shell";
import { UserBar } from "../(index)/UserBar";
import { OpportunityList } from "./OpportunityList";

//

export default async function Page() {
  const now = await getServerDate();
  return (
    <>
      <UserBar />
      <Opportunities />
      <Footer now={now} />
    </>
  );
}

//

function Opportunities() {
  return (
    <div className="grid justify-between gap-5 px-1 lg:grid-cols-holy-grail">
      <aside className="hidden shadow lg:block lg:px-10">
        <article className="mt-10 ">
          <h3 className="font-bold uppercase text-Congress_Blue">
            Opportunités
          </h3>

          <InputSearch />
          <ul></ul>
        </article>
      </aside>
      <main className="mt-10">
        <OpportunityList />
      </main>
    </div>
  );
}

async function getServerDate() {
  return new Date().toISOString();
}
