//

import type { Metadata, ResolvingMetadata } from "next";
import { About } from "./About";

//

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `${(await parent).title?.absolute}`,
  };
}
//

export default async function Page() {
  // if (1) throw new Error("lolZ")
  return (
    <main>
      <About />
    </main>
  );
}
