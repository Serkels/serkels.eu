//

import type { Metadata, ResolvingMetadata } from "next";
import { Partener_SignUpForm } from "./page.client";

//

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Partener :: ${(await parent).title?.absolute}`,
  };
}

//

export default async function Page() {
  return <Partener_SignUpForm />;
}

//
