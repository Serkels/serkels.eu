//

import { TRPC_SSR } from ":trpc/server";
import Form from ":widgets/auth/SignUpForm";
import { auth } from "@1.modules/auth.next";
import type { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";
import { tv } from "tailwind-variants";
import { match, P } from "ts-pattern";

//

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Student :: ${(await parent).title?.absolute}`,
  };
}

//

export default async function Routing() {
  const session = await auth();

  return match({ session })
    .with({ session: { profile: { id: P.string } } }, () => redirect("/"))
    .with({ session: { user: { email: P.string } } }, async () => {
      return <Page />;
    })
    .otherwise(() => redirect("/"));
}

async function Page() {
  const { base } = style();

  return (
    <main className={base()}>
      <Form categories={await TRPC_SSR.category.exchange.fetch()} />
    </main>
  );
}

//

const style = tv({
  base: "container mx-auto my-10 flex max-w-4xl flex-col justify-center",
  slots: {
    form: "flex flex-col justify-center space-y-10",
    label: "col-span-full flex items-center space-x-1",
  },
});
