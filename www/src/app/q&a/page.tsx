//

import { Hydrate, dehydrate } from "@tanstack/react-query";
import { getServerSession } from "next-auth";
import { fromServer } from "~/app/api/v1";
import { getQueryClient } from "~/app/getQueryClient";
import { Question_Repository } from "~/modules/question/repository";
import { Question_Controller } from "~/modules/question/view/react/controller";
import { useOpportunityCategoriesprefetchQuery } from "../opportunity/data/useOpportunityCategoriesQuery";
import { QACreateForm } from "./QACreateForm";
import { QAList } from "./QAList";
import { QASearchForm } from "./QASearchForm";
import { SeeAlso } from "./SeeAlso";

//

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession();
  const search = searchParams["q"] as string | undefined;
  const category = searchParams["category"] as string | undefined;
  const isConncected = Boolean(session?.user?.email);

  const repository = new Question_Repository(fromServer);

  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery(
    ["question", "list"] as ReturnType<
      InstanceType<typeof Question_Controller>["query_keys"]["lists"]
    >,
    repository.findAll.bind(repository, {
      filter: { category, search },
      sort: ["createdAt:desc"],
      pagination: { pageSize: 2 },
    }),
  );
  await useOpportunityCategoriesprefetchQuery();
  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <main className="col-span-full my-10 md:col-span-6 xl:col-span-6 ">
        <QASearchForm />
        {isConncected ? (
          <>
            <hr className="my-5 border-none" />
            <QACreateForm />
          </>
        ) : null}
        <hr className="my-10" />
        <Hydrate state={dehydratedState}>
          <QAList category={category} search={search} />
        </Hydrate>
      </main>
      <aside className="col-span-3 mt-10 hidden lg:px-10 xl:block">
        <SeeAlso />
      </aside>
    </>
  );
}
