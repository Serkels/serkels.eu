//

import type { Metadata, ResolvingMetadata } from "next";
import { History } from "./History";

//

//

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `${(await parent).title?.absolute} / History`,
  };
}

export default async function Page() {
  return (
    <main>
      <History />
    </main>
  );
}
