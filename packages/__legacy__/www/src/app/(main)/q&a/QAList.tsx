"use client";

import { useInject } from "@1/next-tsyringe";
import { Spinner } from "@1/ui/components/Spinner";
import { P, match } from "ts-pattern";
import { Question_Controller } from "~/modules/question/view/react/controller";
import { QACard } from "./components/QACard/QACard";

//

export function QAList({
  category,
  search,
}: {
  category: string | undefined;
  search: string | undefined;
}) {
  const {
    lists: { useQuery },
  } = useInject(Question_Controller);

  const query_result = useQuery({
    filter: { category, search },
    sort: ["createdAt:desc"],
    pagination: { pageSize: 4 },
  });

  //
  return match(query_result)
    .with({ status: "error" }, ({ error }) => {
      throw error;
    })
    .with({ status: "loading" }, () => <Loading />)
    .with(
      {
        status: "success",
        data: P.when(
          (list) => list.pages.map((page) => page.data!).flat().length === 0,
        ),
      },
      () => <EmptyList />,
    )
    .with(
      { status: "success" },
      ({ data: { pages }, isFetchingNextPage, hasNextPage, fetchNextPage }) => (
        <ul className="grid grid-cols-1 gap-9">
          {pages
            .map((page) => page.data!)
            .flat()
            .map((qa) => (
              <li key={qa.id}>
                <QACard id={Number(qa.id)} />
              </li>
            ))}
          <li className="col-span-full mx-auto">
            {isFetchingNextPage ? <Loading /> : null}
          </li>
          <li className="col-span-full mx-auto">
            {hasNextPage ? (
              <button
                className="
                  rounded-md
                  bg-gray-600
                  px-3
                  py-1.5
                  text-sm
                  font-semibold
                  leading-6
                  text-white
                  shadow-sm
                  hover:bg-gray-500
                  focus-visible:outline
                  focus-visible:outline-2
                  focus-visible:outline-offset-2
                  focus-visible:outline-gray-600
                "
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
              >
                Charger plus
              </button>
            ) : null}
          </li>
        </ul>
      ),
    )
    .exhaustive();
}

//

function EmptyList() {
  return (
    <h5 className="py-5 text-center font-bold">Pas plus de résultats ...</h5>
  );
}

function Loading() {
  return (
    <div className="mt-28 text-center">
      <Spinner />
    </div>
  );
}
