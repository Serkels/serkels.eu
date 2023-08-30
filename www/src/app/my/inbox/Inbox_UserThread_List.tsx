"use client";

import { InputError, Result } from "@1/core/domain";
import { Inbox, Thread } from "@1/modules/inbox/domain";
import {
  InboxList_Schema,
  Inbox_Schema_ToDomain,
} from "@1/modules/inbox/infra/strapi";
import { Button } from "@1/ui/components/ButtonV";
import { Spinner } from "@1/ui/components/Spinner";
import type { InfiniteData } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import tw from "tailwind-styled-components";
import { tv } from "tailwind-variants";
import { P, match } from "ts-pattern";
import { Avatar_Show_Profile } from "~/components/Avatar_Show_Profile";
import { ErrorOccur } from "~/components/ErrorOccur";

//
const mock = {
  pages: [
    {
      data: Array.from({ length: 5 }).map((_, index) => ({
        id: index,
        updatedAt: new Date(`${2023 - index}-08-29T03:05:12.227Z`),
        thread: {
          id: index,
          profile: {
            about: "",
            createdAt: new Date(),
            updatedAt: new Date(),
            firstname: "firstname" + index,
            lastname: "lastname" + index,
            id: index,
            university: "university" + index,
          },
          last_message: {
            id: index,
            content: "Hello " + index,
            author: {
              about: "",
              createdAt: new Date(),
              updatedAt: new Date(),
              firstname: "firstname" + index,
              lastname: "lastname" + index,
              id: index,
              university: "university" + index,
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          updatedAt: new Date(`${2023 - index}-08-29T03:05:12.227Z`),
        },
      })),
      //  )} }) ,
      // ),
    },
  ],
  pageParams: [],
} satisfies InfiniteData<InboxList_Schema>;

function useInbox() {
  const inbox_dto_to_domain = new Inbox_Schema_ToDomain();
  const list_query_info = {
    status: "success" as "success" | "loading" | "error",
    data: mock,
    isFetchingNextPage: false,
    hasNextPage: false,
    error: new Error(
      "afterCreate plugin::comments.comment : question_id of api::exchange-deal.exchange-deal:12 is NaN afterCreate plugin::comments.comment : question_id of api::exchange-deal.exchange-deal:12 is NaN from https://www.toc-toc.org/api/v1/deals/12/messages",
    ),
    fetchNextPage: () => {},
  };
  const [inboxes, set_inboxes] = useState<Inbox[]>();
  useEffect(() => {
    if (!list_query_info.data) return;
    const flat_data = list_query_info.data.pages
      .map((page) => page.data)
      .flat();
    const result = Result.combine<Inbox[]>(
      flat_data.map((inbox) => inbox_dto_to_domain.build(inbox)),
    );
    if (result.isFail())
      throw new InputError("useInbox", { cause: result.error() });

    const results = flat_data.map((inbox) => inbox_dto_to_domain.build(inbox));
    if (Result.combine(results).isFail())
      throw new InputError("Inbox SubDomain", {
        cause: Result.combine(results).error(),
      });

    set_inboxes(results.map((e) => e.value()));
  }, [list_query_info.data, set_inboxes]);
  return { list_query_info, inboxes };
}

export function Inbox_UserThread_List() {
  const { list_query_info, inboxes } = useInbox();

  return match(list_query_info)
    .with({ status: "error", error: P.select() }, (error) => (
      <ErrorOccur error={error as Error} />
    ))
    .with({ status: "loading" }, () => <Loading />)
    .with(
      { status: "success" },
      ({ isFetchingNextPage, hasNextPage, fetchNextPage }) => (
        <nav className="overflow-y-auto ">
          <UserInbox_List inboxes={inboxes} />
          {isFetchingNextPage ? <Loading /> : null}
          {hasNextPage ? (
            <Button
              onPress={() => fetchNextPage()}
              isDisabled={!hasNextPage || isFetchingNextPage}
            >
              Charger plus
            </Button>
          ) : null}
        </nav>
      ),
    )
    .exhaustive();
}

// const userinbox_navt = tv({
//   base: "space-y-5 overflow-y-auto pb-8"})
const userinbox_list = tv({
  base: "space-y-5 overflow-y-auto px-8 pb-8",

  // variants: {
  //   scroll: {
  //     true: "overflow-y-auto",
  //   },
  //   sticky: {
  //     // true: "sticky top-[calc(theme(spacing.14)_+_theme(spacing.9))]",
  //   },
  // },
});

function UserInbox_List({ inboxes }: { inboxes: Inbox[] | undefined }) {
  return match(inboxes)
    .with(undefined, () => null)
    .when(
      (list) => list.length === 0,
      () => <EmptyList />,
    )
    .otherwise((list) => (
      <ul className={userinbox_list()}>
        {list.map((inbox) => (
          <li key={inbox.id.value()}>
            <UserThread_Item thread={inbox.get("thread")} />
          </li>
        ))}
      </ul>
    ));
}

//

function UserThread_Item({ thread }: { thread: Thread }) {
  const pathname = usePathname() ?? "";

  const href = `/my/inbox/${thread.get("id")}`;
  const active =
    pathname.split("/").length >= href.split("/").length &&
    href.includes(pathname);

  return (
    <Thread_Card $active={active}>
      <Thread_Header>
        <Avatar_Show_Profile profile={thread.profile} />
        <Thread_Time dateTime={thread.last_update} title={thread.last_update}>
          {thread.last_update}
        </Thread_Time>
      </Thread_Header>
      <Link href={href}>
        {/* <div className="float-right">
          <Circle className="h-5 w-5 text-Gamboge" />
        </div> */}
        <Thread_Excerpt
          $active={active}
          title={thread.last_message.the_excerpt}
        >
          {thread.last_message.the_excerpt}
        </Thread_Excerpt>
      </Link>
    </Thread_Card>
  );
}

const Thread_Header = tw.header`
  flex
  justify-between
`;

const Thread_Time = tw.time`
  text-xs
  font-bold
`;
const Thread_Card = tw.div<{ $active: boolean }>`
  block
  space-y-5
  rounded-xl
  border
  border-[#ECEDF4]
  bg-white
  p-4
  text-black
  shadow-[10px_10px_10px_#00000014]
`;

const Thread_Excerpt = tw.p<{ $active: boolean }>`
  mb-1
  line-clamp-1
`;
//

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

function EmptyList() {
  return (
    <EmptyList.ui.p>Aucune discussion disponible pour le moment</EmptyList.ui.p>
  );
}

EmptyList.ui = {
  p: tw.p`
  content-[Aucune
  discussion
  disponible
  pour
  le
  moment]
  flex
  h-1/3
  flex-col
  items-center
  justify-center
  text-center
  font-bold
  opacity-50
`,
};
