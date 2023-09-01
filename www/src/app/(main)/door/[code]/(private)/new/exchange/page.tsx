//

import type { Metadata, ResolvingMetadata } from "next";
import { CreateForm } from "./CreateForm";

//

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `New Exchange :: ${(await parent).title?.absolute}`,
  };
}

//

export default async function Page() {
  return (
    <main className="col-span-full my-10 px-4 md:col-span-6 xl:col-span-8">
      <CreateForm />
    </main>
  );
}
