///

import type { Metadata, ResolvingMetadata } from "next";
import type { PropsWithChildren } from "react";
import { AsideBar } from "~/components/layouts/holy/aside";
import { MyDeals } from "./MyDeals";

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
      <AsideBar>
        <div className="sticky top-[calc(theme(spacing.14)_+_theme(spacing.6))]">
          <MyDeals exchange_id={exchange_id} />
        </div>
      </AsideBar>
      {children}
    </>
  );
}
