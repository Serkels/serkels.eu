//

import type { Metadata, ResolvingMetadata } from "next";
import { UserForm } from "./UserForm";
import { Avartar_Form } from "./page.client";

//

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Parameters :: ${(await parent).title?.absolute}`,
  };
}

//

export default async function Page() {
  return (
    <main className="col-span-full my-10 md:col-span-6 xl:col-span-8">
      <Avartar_Form />
      <UserForm />
    </main>
  );
}
