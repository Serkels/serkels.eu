///

import type { PropsWithChildren } from "react";

export default function Layout({
  children,
  params,
}: PropsWithChildren<{
  params: { exchange_id: string; discussion_id: string };
}>) {
  const exchange_id = Number(params.exchange_id);
  const discussion_id = Number(params.discussion_id);
  console.log({ exchange_id, discussion_id });
  return <>{children}</>;
}
