//

import { TRPC_Hydrate } from ":trpc/server";
import type { Metadata, ResolvingMetadata } from "next";
import { AsyncListInfinite } from "./List";
import { trpc_server } from "@1.infra/trpc/react-query/server";

//

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const title = `Notifications :: ${(await parent).title?.absolute}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

//

export default async function Page() {
  await trpc_server.notification.find.prefetchInfinite({});
  //
  return (
    <TRPC_Hydrate>
      <main className="container mx-auto my-32 px-4 sm:px-8 md:px-6 lg:px-8">
        <h1 className="mb-8 text-4xl font-bold">Notifications</h1>
        <AsyncListInfinite />
      </main>
    </TRPC_Hydrate>
  );
}
