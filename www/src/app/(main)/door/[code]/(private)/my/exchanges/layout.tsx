//

import type { PropsWithChildren } from "react";
import { MyExchanges } from "./MyExchanges";

//

export default function Layout({ children }: PropsWithChildren<any>) {
  return (
    <>
      <MyExchanges className="-ml-8 shadow-[15px_0px_15px_#00000014]"></MyExchanges>
      {children}
    </>
  );
}
