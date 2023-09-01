//

import type { Metadata, ResolvingMetadata } from "next";
import { OpportunityList } from "./page.client";

//

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Created Exchanges :: ${(await parent).title?.absolute}`,
  };
}

//

export default async function Page() {
  return (
    <main className="col-span-full my-10 px-4 md:col-span-6 md:px-0 xl:col-span-7">
      <OpportunityList />
    </main>
  );
}
