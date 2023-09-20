///

import type { Metadata, ResolvingMetadata } from "next";
import type { PropsWithChildren } from "react";
import { MyDeals } from "./MyDeals";
import { Deals_Aside_Nav } from "./layout.client";

//

export async function generateMetadata(
  { params }: { params: { exchange_id: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Exchange@${params.exchange_id} :: ${(await parent).title
      ?.absolute}`,
  };
}

//

export default function Layout({
  children,
  params,
}: PropsWithChildren<{ params: { exchange_id: string } }>) {
  const exchange_id = Number(params.exchange_id);

  return (
    <>
      <Deals_Aside_Nav exchange_id={exchange_id}>
        <MyDeals exchange_id={exchange_id} />
      </Deals_Aside_Nav>
      {children}
    </>
  );
}
