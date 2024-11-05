//

import { TRPC_Hydrate } from ":trpc/server";
import { trpc_server } from "@1.infra/trpc/react-query/server";
import { auth } from "@1.modules/auth.next";
import { Forum_Filter, type ForumSearchParams } from "@1.modules/forum.domain";
import { Idle as CreateCard_Idle } from "@1.modules/forum.ui/CreateCard/Idle";
import { Spinner } from "@1.ui/react/spinner";
import type { _1_HOUR_ } from "@douglasduteil/datatypes...hours-to-seconds";
import type { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";

//

const List = dynamic(() => import("./_client/List"), {
  loading() {
    return <Spinner />;
  },
});

const Create = dynamic(() => import("./_client/Create"), {
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
  searchParams: ForumSearchParams;
}) {
  const { category, q: search, f: filter_param } = await searchParams;
  const filter_parsed_return = Forum_Filter.safeParse(filter_param);
  const filter = filter_parsed_return.success
    ? filter_parsed_return.data
    : undefined;

  await trpc_server.forum.question.find.prefetchInfinite({
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
  const session = await auth();

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
