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
    title: `History :: ${(await parent).title?.absolute}`,
  };
}

export default async function Page() {
  return (
    <main>
      <History />
    </main>
  );
}
