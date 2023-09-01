//

import type { Metadata, ResolvingMetadata } from "next";
import { Exchanges } from "./Exchanges";

//

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `${(await parent).title?.absolute} / Exchanges`,
  };
}

export default async function Page() {
  return (
    <main>
      <Exchanges />
    </main>
  );
}
