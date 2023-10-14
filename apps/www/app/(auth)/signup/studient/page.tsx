//

import { Spinner } from ":components/shell/Spinner";
import type { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";

//

const Form = dynamic(() => import("./page.client"), {
  ssr: false,
  loading() {
    return <Spinner />;
  },
});

//

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Studient :: ${(await parent).title?.absolute}`,
  };
}

//

export default async function Page() {
  return <Form />;
}

//
