//

import type { Metadata, ResolvingMetadata } from "next";
import { ConfirmPanel } from "./page.client";

//

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Sign In :: ${(await parent).title?.absolute}`,
  };
}

//

export default async function Page({ params }: { params: { token: string } }) {
  const { token } = params;

  return <ConfirmPanel token={token} />;
}

//
