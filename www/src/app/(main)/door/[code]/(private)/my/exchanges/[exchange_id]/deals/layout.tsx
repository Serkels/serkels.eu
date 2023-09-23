///

import type { PropsWithChildren } from "react";
import { MyDeals } from "./MyDeals";
import { Deal_Route_Provider, Deals_Aside_Nav } from "./layout.client";

//

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Deal_Route_Provider>
      <Deals_Aside_Nav>
        <MyDeals />
      </Deals_Aside_Nav>
      {children}
    </Deal_Route_Provider>
  );
}
