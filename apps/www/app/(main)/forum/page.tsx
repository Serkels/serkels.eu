//

import { TRPC_Hydrate, TRPC_SSR } from ":trpc/server";
import { getServerSession } from "@1.modules/auth.next";
import { Forum_Filter } from "@1.modules/forum.domain";
import { Idle as CreateCard_Idle } from "@1.modules/forum.ui/CreateCard/Idle";
import { Spinner } from "@1.ui/react/spinner";
import type { _1_HOUR_ } from "@douglasduteil/datatypes...hours-to-seconds";
import type { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";

//

const List = dynamic(() => import("./_client/List"), {
  ssr: false,
  loading() {
    return <Spinner />;
  },
});

const Create = dynamic(() => import("./_client/Create"), {
  ssr: false,
  loading() {
    return <CreateCard_Idle />;
  },
});

//

export const revalidate: _1_HOUR_ = 3600;

//

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const title = `Discussions :: ${(await parent).title?.absolute}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

//

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession();

  const category = String(searchParams["category"]);
  const search = String(searchParams["q"]);
  const filter_parsed_return = Forum_Filter.safeParse(searchParams["f"]);
  const filter = filter_parsed_return.success
    ? filter_parsed_return.data
    : undefined;

  await TRPC_SSR.forum.question.find.prefetchInfinite({
    category,
    search,
    filter,
  });

  return (
    <TRPC_Hydrate>
      <main>
        <CreateQuestionSection />
        <List />
      </main>
    </TRPC_Hydrate>
  );
}

async function CreateQuestionSection() {
  const session = await getServerSession();

  if (!session) return null;
  if (session.profile.role !== "STUDENT") return null;

  return (
    <section>
      <Create />
      <div className="w-full pt-10 text-center sm:text-lg">
        Ou réponds aux questions des étudiant.e.s
      </div>
      <hr className="my-10" />
    </section>
  );
}
