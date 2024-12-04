//

import type { Params } from ":pipes/exchange_by_id";
import to from "await-to-js";
import type { Metadata, ResolvingMetadata } from "next";
import { Card } from "./Card";
import { trpc_server } from "@1.infra/trpc/react-query/server";

//

export async function generateMetadata(
  props: { params: Promise<Params> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;

  const { exchange_id } = params;

  const [, exchange] = await to(trpc_server.exchanges.by_id.fetch(exchange_id));

  const title = exchange?.title ?? "Not Found";
  return {
    title: `${title} :: ${(await parent).title?.absolute}`,
  };
}

export default async function Page(props: { params: Promise<Params> }) {
  const params = await props.params;
  const { exchange_id } = params;

  return <Card exchange_id={exchange_id} />;
}
