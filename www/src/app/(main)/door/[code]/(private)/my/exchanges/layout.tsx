//

import type { PropsWithChildren } from "react";
import { AsideBar } from "~/components/layouts/holy/aside";
import { EchangeNav } from "./EchangeNav";

//

export default function Layout({ children }: PropsWithChildren<any>) {
  return (
    <>
      <AsideBar className="-ml-[20px] flex-col overflow-hidden pt-8 md:flex">
        <EchangeNav />
      </AsideBar>
      {children}
    </>
  );
}
