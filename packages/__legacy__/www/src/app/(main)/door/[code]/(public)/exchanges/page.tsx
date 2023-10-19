//

import type { Metadata, ResolvingMetadata } from "next";
import { Exchanges } from "./Exchanges";

//

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Exchanges :: ${(await parent).title?.absolute}`,
  };
}

export default async function Page() {
  return (
    <main>
      <Exchanges />
    </main>
  );
}
