//

import type { Metadata, ResolvingMetadata } from "next";

//

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Inbox :: ${(await parent).title?.absolute}`,
  };
}

//
export default function Page() {
  return (
    <>
      /home/x/zzz/github/toctocorg/toctoc/apps/www/app/(main)/door/[code]/(private)/exchanges/inbox/page.tsx
    </>
  );
}
