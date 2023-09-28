//

import type { PropsWithChildren } from "react";
import Nest from "react-nest";
import { tv } from "tailwind-variants";
import { injector } from "~/core/di";
import { getQueryClient } from "~/core/getQueryClient";
import { Exchange_QueryKeys } from "~/modules/exchange/queryKeys";
import { Deal_Route_Provider, Deals_Aside_Nav } from "./layout.client";

//

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Nest>
      <Deal_Route_Provider />
      {/* <Exchange_ValueProvider /> */}
      <Aside />

      {/* */}

      {children}
    </Nest>
    // <Deal_Route_Provider>
    //   <Deals_Aside_Nav>
    //     <MyDeals />
    //   </Deals_Aside_Nav>
    //   {children}
    // </Deal_Route_Provider>
  );
}

function Aside() {
  const { diviser, header, title } = aside();
  const query_client = getQueryClient();
  const id = injector().resolve("ROUTE_EXCHANGE_ID_TOKEN");
  const exchange = query_client.getQueryData(Exchange_QueryKeys.item(id));
  console.log({ exchange });
  return (
    <Deals_Aside_Nav>
      <header className={header()}>
        <h6 className={title()}></h6>
      </header>
      <hr className={diviser()} />
    </Deals_Aside_Nav>
  );
}

const aside = tv({
  slots: {
    diviser: "my-6 border-2 border-[#F0F0F0] ",
    header: "mt-6 flex h-16 items-center justify-start space-x-7",
    title: "line-clamp-2 flex-1 text-xl font-bold",
  },
});
