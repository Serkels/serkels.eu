//

import { TRPC_SSR } from ":trpc/server";
import type { Metadata, ResolvingMetadata } from "next";
import { Form } from "./form";

//

export const dynamic = "force-dynamic";
export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Categories :: ${(await parent).title?.absolute}`,
  };
}

export default async function Page() {
  const exchanges = await TRPC_SSR.category.exchange.fetch();
  return (
    <div className="space-y-4">
      <h1 className="text-4xl">Categories</h1>

      {/* <pre>{JSON.stringify(exchanges, null, 2)}</pre> */}
      <Form />
    </div>
  );
}
