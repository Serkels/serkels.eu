//

import Nest from "react-nest";
import { Exchange_Provider } from "../Deal_Provider";
import { Deals_Nav } from "./page.client";

export default async function Page({ params }: { params: any }) {
  const exchange_id = params["exchange_id"];
  return (
    <Nest>
      <Exchange_Provider id={exchange_id} />
      <Deals_Nav />
    </Nest>
  );
}
