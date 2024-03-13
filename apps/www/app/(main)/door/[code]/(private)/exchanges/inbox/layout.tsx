//

import type { Metadata, ResolvingMetadata } from "next";
import type { PropsWithChildren, ReactNode } from "react";

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

export default function Layout({
  children,
  navbar,
}: PropsWithChildren<{ navbar: ReactNode }>) {
  return (
    <div className="grid h-full lg:grid-cols-[minmax(0,_300px),_1fr]">
      <aside className="hidden pt-10 md:block">{navbar}</aside>
      <div>{children}</div>
    </div>
  );
}
