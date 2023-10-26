//

import type { Metadata, ResolvingMetadata } from "next";

//

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Opportunities :: ${(await parent).title?.absolute}`,
  };
}

//
export default function Page() {
  return (
    <>
      /home/x/zzz/github/toctocorg/toctoc/apps/www/app/(main)/door/[code]/(private)/bookmarks/opportunities/page.tsx
    </>
  );
}
