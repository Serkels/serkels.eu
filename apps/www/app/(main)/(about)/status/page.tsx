//

import type { Metadata, ResolvingMetadata } from "next";

//

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Status :: ${(await parent).title?.absolute}`,
  };
}

export default async function Page() {
  return null;
}
