//

import type { Metadata, ResolvingMetadata } from "next";
import type { PropsWithChildren, ReactNode } from "react";
import { Aside } from "./layout.client";

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
}: PropsWithChildren<{
  navbar: ReactNode;
}>) {
  return (
    <div className="grid h-full lg:grid-cols-[minmax(0,_300px),_1fr]">
      <Aside className="">{navbar}</Aside>
      <div>{children}</div>
    </div>
  );
}
