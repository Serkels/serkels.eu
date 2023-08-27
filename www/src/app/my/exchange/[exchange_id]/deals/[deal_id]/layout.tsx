///

import type { PropsWithChildren } from "react";

export default function Layout({
  children,
} // params,
: PropsWithChildren<{
  params: { exchange_id: string; deal_id: string };
}>) {
  // const exchange_id = Number(params.exchange_id);
  // const deal_id = Number(params.deal_id);

  return <>{children}</>;
}
