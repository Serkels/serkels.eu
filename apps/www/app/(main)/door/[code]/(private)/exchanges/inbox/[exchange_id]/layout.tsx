//

import type { Params } from ":pipes/exchange_by_id";
import type { Metadata, ResolvingMetadata } from "next";
import type { PropsWithChildren } from "react";
import Navbar_Page from "./_@navbar/page";

//

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `<Echange Title> :: ${(await parent).title?.absolute}`,
  };
}

//
export default function Layout({
  children,
  params,
}: PropsWithChildren<{ params: Params }>) {
  const navbar = <Navbar_Page params={params} />;
  return (
    <div className="grid h-full xl:grid-cols-[minmax(0,_300px),_1fr]">
      <aside className="hidden pt-10 md:block">{navbar}</aside>
      <div className="bg-white">{children}</div>
    </div>
  );
}
