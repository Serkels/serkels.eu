//

import { Hydrate, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "~/core/getQueryClient";
import { QAList } from "./QAList";
import { QASearchForm } from "./QASearchForm";
import { Question_Form } from "./page.client";

//

export const dynamic = "force-dynamic";

//

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const search = searchParams["q"] as string | undefined;
  const category = searchParams["category"] as string | undefined;
  return (
    <main>
      <QASearchForm />
      <Question_Form />
      <hr className="my-10" />
      <HydreatedQAList category={category} search={search} />
    </main>
  );
}

async function HydreatedQAList({
  category,
  search,
}: Record<"category" | "search", string | undefined>) {
  const queryClient = getQueryClient();
  //   ["question", "list"] as ReturnType<
  //     InstanceType<typeof Question_Controller>["query_keys"]["lists"]
  //   >,
  //   repository.findAll.bind(repository, {
  //     filter: { category, search },
  //     sort: ["createdAt:desc"],
  //     pagination: { pageSize: 2 },
  //   }),
  // );
  // await useOpportunityCategoriesprefetchQuery();
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <QAList category={category} search={search} />
    </Hydrate>
  );
}
