//

import { type Exchange } from "@1.modules/exchange.domain";
import { type PropsWithChildren } from "react";
import { createSlot } from "react-slotify";
import { match } from "ts-pattern";
import { Card_Deleting } from "./Card_Deleting";
import { Card_Idle } from "./Card_Idle";
import { Provider, useOutletState } from "./context";

//

//
export function Card({
  exchange,
  children,
}: PropsWithChildren<{ exchange: Exchange }>) {
  // const [outlet] = useOutletState();
  // const disabled = outlet.state === "deleting";
  return (
    <Provider exchange={exchange}>
      <Card_Outlet>{children}</Card_Outlet>
    </Provider>
  );
}

Card.Body = createSlot();
Card.Footer = {
  Left: createSlot(),
  Center: createSlot(),
  Right: createSlot(),
};

Card.Header = {
  Left: createSlot(),
  Center: createSlot(),
  Right: createSlot(),
};

//

function Card_Outlet({ children }: PropsWithChildren) {
  const [outlet] = useOutletState();

  return match(outlet)
    .with({ state: "deleting" }, () => (
      <Card_Deleting>{children}</Card_Deleting>
    ))
    .otherwise(() => <Card_Idle>{children}</Card_Idle>);
}
