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
}: PropsWithChildren<{ navbar: ReactNode }>) {
  return (
    <div className="grid h-full md:grid-cols-6 xl:grid-cols-10">
      <Aside className="col-span-3">{navbar}</Aside>
      <div className="col-span-3 bg-white max-md:has-[>_.hidden]:hidden xl:col-span-7">
        {children}
      </div>
    </div>
  );
}
