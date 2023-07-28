"use client";

import { fromClient } from "@/app/api/v1";
import type { components } from "@1/strapi-openapi/v1";
import { Spinner } from "@1/ui/components/Spinner";
import { useQuery } from "@tanstack/react-query";
import { QARepository } from "./QARepository";

//

export function QAList({ category }: { category: string | undefined }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["q&a"],
    queryFn: () =>
      new QARepository(fromClient).load({
        category: category,
        limit: 6,
        page: undefined,
        pageSize: undefined,
      }),
  });
  if (isLoading) return <Spinner />;
  if (isError) return <>Epic fail...</>;
  if (!data) return <>No data O_o</>;
  console.log({ data });
  return (
    <ul className="grid grid-cols-1 gap-9">
      {data.map((exchange) => (
        <li key={exchange.id}>
          <QACard {...exchange} />
        </li>
      ))}
    </ul>
  );
}

function QACard({
  attributes,
  id,
}: components["schemas"]["QuestionListResponseDataItem"]) {
  const title = attributes?.title;
  const username = attributes?.owner?.data?.attributes?.username;
  const updatedAt = attributes?.updatedAt
    ? new Date(attributes?.updatedAt)
    : new Date(NaN);

  return (
    <div
      className="overflow-hidden rounded-xl bg-white p-6 text-black shadow-[5px_5px_10px_#7E7E7E33]"
      id={id ? String(id) : undefined}
    >
      <div className="">
        <header className="mb-4 flex justify-between">
          <figure className="flex">
            <img
              className="h-12 w-12 rounded-full"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            />
            <figcaption className="ml-2 mt-0.5">
              <span className="block text-base font-medium leading-snug text-black">
                {username}
              </span>
              <span className="block text-sm font-light leading-snug text-gray-500 ">
                🎓 Université Lyon 3
              </span>
            </figcaption>
          </figure>
          <time
            className="mt-3 text-xs"
            dateTime={updatedAt.toUTCString()}
            title={updatedAt.toUTCString()}
          >
            {updatedAt.toLocaleDateString()}
          </time>
        </header>
        <article>
          <h3 className="my-5 text-xl font-bold">{title}</h3>
        </article>
      </div>
      <hr className="my-2" />
      <footer className="mt-4 ">
        <div className="flex justify-between">
          <button className="block text-sm font-bold text-Dove_Gray">
            <span className="text-Chateau_Green">1</span> réponse
          </button>
          <button className="text-md block  rounded-full px-7 font-bold text-Chateau_Green">
            Répondre
          </button>
          <button className="block">↗️</button>
        </div>
      </footer>
    </div>
  );
}
