"use client";

//

import { InputError } from "@1/core/error";
import {
  Thread_Schema,
  Thread_Schema_ToDomain,
} from "@1/modules/inbox/infra/strapi";
import { Spinner } from "@1/ui/components/Spinner";
import { useEffect, type PropsWithChildren } from "react";
import tw from "tailwind-styled-components";
import { P, match } from "ts-pattern";
import { ErrorOccur } from "~/components/ErrorOccur";
import { useThread_Value } from "./Thread.context";

//

const mock = {
  id: 1,
  profile: {
    about: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    firstname: "firstname" + 1,
    lastname: "lastname" + 1,
    id: 1,
    university: "university" + 1,
  },
  last_message: {
    id: 1,
    content: "Hello " + 1,

    author: {
      about: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      firstname: "firstname" + 1,
      lastname: "lastname" + 1,
      id: 1,
      university: "university" + 1,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  updatedAt: new Date(`${2123 - 1}-08-29T03:05:12.227Z`),
} satisfies Thread_Schema;

function useThread(id: number) {
  const thread_schema_to_domain = new Thread_Schema_ToDomain();
  const list_query_info = {
    status: "success" as "success" | "loading" | "error",
    data: mock,
    isFetchingNextPage: false,
    hasNextPage: false,
    error: new Error(
      id +
        "afterCreate plugin::comments.comment : question_id of api::exchange-deal.exchange-deal:12 is NaN afterCreate plugin::comments.comment : question_id of api::exchange-deal.exchange-deal:12 is NaN from https://www.toc-toc.org/api/v1/deals/12/messages",
    ),
    fetchNextPage: () => {},
  };

  const [thread, set_thread] = useThread_Value();

  useEffect(() => {
    const { data } = list_query_info;
    if (!data) return;

    const result = thread_schema_to_domain.build(data);
    if (result.isFail())
      throw new InputError("Thread Provider", { cause: result.error() });

    set_thread(result.value());
  }, [list_query_info.data, set_thread]);

  return { list_query_info, thread };
}

export function Thread({ children, id }: PropsWithChildren<{ id: number }>) {
  const { list_query_info } = useThread(id);

  return match(list_query_info)
    .with({ status: "error", error: P.select() }, (error) => (
      <div className="mt-24">
        <ErrorOccur error={error as Error} />
      </div>
    ))
    .with({ status: "loading" }, () => <Loading />)
    .with({ status: "success" }, ({}) => children)
    .exhaustive();
}

function Loading() {
  return (
    <Loading.ui.figure>
      <Spinner />
    </Loading.ui.figure>
  );
}

Loading.ui = {
  figure: tw.figure`
  mt-28
  text-center
`,
};
