"use client";

//

import { Button } from "@1/ui/components/ButtonV";
import { InputSearch } from "@1/ui/components/InputSearch";
import { useCallback, useState, type ChangeEvent } from "react";
import { useDebounce } from "react-use";
import { P, match } from "ts-pattern";
import { useInbox_controller } from "~/modules/inbox";
import { UserInbox_List } from "./UserInbox_List";

//

export function Inbox_UserThread_List() {
  const {
    list: { useQuery },
  } = useInbox_controller();
  const { info, inboxes } = useQuery({
    sort: ["updatedAt:desc"],
    pagination: { pageSize: 6 },
  });

  const [search_value, set_search_value] = useState("");
  const [filter_name, set_filter_name] = useState("");

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

  const filtered_inboxes = inboxes?.filter(
    (inbox) => inbox.get("thread")?.get("profile").name.includes(filter_name),
  );

  return match(info)
    .with({ status: "error", error: P.select() }, (error) => {
      throw error;
    })
    .with({ status: "loading" }, () => <UserInbox_List.Loading />)
    .with(
      { status: "success" },
      ({ isFetchingNextPage, hasNextPage, fetchNextPage }) => (
        <>
          <form className="mb-10 px-8" action="#">
            <InputSearch value={search_value} onChange={filter_list} />
          </form>
          <nav className="h-[80%] flex-1 overflow-y-auto">
            <UserInbox_List inboxes={filtered_inboxes} />
            {isFetchingNextPage ? <UserInbox_List.Loading /> : null}
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
      ),
    )
    .exhaustive();
}
