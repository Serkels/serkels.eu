//

import { OpportunityList } from "./OpportunityList";

//

export default async function Page() {
  return (
    <main className="col-span-full my-10 px-4 md:col-span-6 md:px-0 xl:col-span-7">
      <OpportunityList />
    </main>
  );
}
