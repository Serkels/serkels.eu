//

import type { Metadata, ResolvingMetadata } from "next";
import { CreateForm } from "./CreateForm";

//

export async function generateMetadata(
  undefined: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `${(await parent).title?.absolute} / New Exchange`,
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
