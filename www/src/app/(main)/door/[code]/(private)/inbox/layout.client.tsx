"use client";

//

import { Button } from "@1/ui/components/ButtonV";
import { InputSearch } from "@1/ui/components/InputSearch";
import { type InfiniteQueryObserverSuccessResult } from "@tanstack/react-query";
import { useCallback, useState, type ChangeEvent } from "react";
import ContentLoader from "react-content-loader";
import { useDebounce } from "react-use";
import { P, match } from "ts-pattern";
import { useInject } from "~/core/react";
import { Get_Inboxes_UseCase } from "~/modules/inbox/application/get_inboxes.use-case";
import { UserInbox_List, UserThread_Item } from "./UserInbox_List";

//

export function Inbox_UserThread_List() {
  const info = useInject(Get_Inboxes_UseCase).execute({
    sort: ["updatedAt:desc"],
    pagination: { pageSize: 6 },
  });

  return match(info)
    .with({ status: "error", error: P.select() }, (error) => {
      throw error;
    })
    .with({ status: "loading" }, () => <Loading />)
    .with({ status: "success" }, (result) => (
      <Inbox_UserThread_InfiniteList {...result} />
    ))
    .exhaustive();
}

function Loading() {
  return (
    <ContentLoader
      uniqueKey="Inbox_UserThread_List_Loading"
      viewBox="0 0 50 100"
      className="w-full"
    >
      <rect x="0" y="0" rx="5" ry="5" width="50" height="100" />
    </ContentLoader>
  );
}

function Inbox_UserThread_InfiniteList({
  data,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
}: InfiniteQueryObserverSuccessResult<number, unknown>) {
  const [search_value, set_search_value] = useState("");
  const [, set_filter_name] = useState("");

  // TODO(douglasduteil): make an API call to filter the list of ids
  const filtered_inboxes = data.pages;

  useDebounce(
    () => {
      set_filter_name(search_value);
    },
    444,
    [search_value],
  );

  const filter_list = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    set_search_value(value);
  }, []);

  return (
    <>
      <form className="mb-10 px-8" action="#">
        <InputSearch
          value={search_value}
          onChange={filter_list}
          disabled={true}
        />
      </form>
      <nav className="h-[80%] flex-1 overflow-y-auto">
        <UserInbox_List inbox_ids={filtered_inboxes} />
        {isFetchingNextPage ? (
          <UserThread_Item.Loading uniqueKey="Loading more" />
        ) : null}
        {hasNextPage ? (
          <Button
            className="mx-auto block"
            onPress={() => fetchNextPage()}
            isDisabled={!hasNextPage || isFetchingNextPage}
          >
            Charger plus
          </Button>
        ) : null}
      </nav>
    </>
  );
}
