///

import type { Metadata, ResolvingMetadata } from "next";
import type { PropsWithChildren } from "react";

//

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Bookmarks :: ${(await parent).title?.absolute}`,
  };
}

//

export default function Layout({ children }: PropsWithChildren) {
  return children;
}
