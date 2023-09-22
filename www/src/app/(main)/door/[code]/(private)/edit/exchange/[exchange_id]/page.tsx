//

import { Hydrate, dehydrate } from "@tanstack/react-query";
import type { Metadata, ResolvingMetadata } from "next";
import { z } from "zod";
import { injector_session } from "~/core/di";
import { getQueryClient } from "~/core/getQueryClient";
import { Exchange_Repository } from "~/modules/exchange/infrastructure";
import { Exchange_QueryKeys } from "~/modules/exchange/queryKeys";
import { Edit_Exchange } from "./page.client";

//

export async function generateMetadata(
  { params }: { params: { exchange_id: string } },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Edit Exchange@${params.exchange_id} :: ${(await parent).title
      ?.absolute}`,
  };
}

//

export default async function Page({
  params,
}: {
  params: { exchange_id: string };
}) {
  try {
    const exchange_id = z.coerce
      .number({ description: "exchange_id" })
      .parse(params.exchange_id, { path: ["params.exchange_id"] });

    //

    const container = await injector_session();

    const repository = container.resolve(Exchange_Repository);

    const queryClient = getQueryClient();
    await queryClient.prefetchQuery({
      queryKey: Exchange_QueryKeys.item(exchange_id),
      queryFn: () => repository.by_id(exchange_id),
    });
    const dehydratedState = dehydrate(queryClient);

    return (
      <Hydrate state={dehydratedState}>
        <Edit_Exchange exchange_id={exchange_id} />
      </Hydrate>
    );
  } catch (error) {
    return (
      <article className="px-4 pt-40 lg:px-16">
        <h1 className="text-4xl font-bold">Page introuvable.</h1>
      </article>
    );
  }
}
