"use client";

//

import { Button } from "@1/ui/components/ButtonV";
import { P, match } from "ts-pattern";
import { ErrorOccur } from "~/components/ErrorOccur";
import { useInbox_controller } from "~/modules/inbox";
import { UserInbox_List } from "./UserInbox_List";

//

export function Inbox_UserThread_List() {
  const {
    list: { useQuery },
  } = useInbox_controller();
  const { info, inboxes } = useQuery({
    sort: ["updatedAt:desc"],
    pagination: { pageSize: 1 },
  });

  return match(info)
    .with({ status: "error", error: P.select() }, (error) => (
      <ErrorOccur error={error as Error} />
    ))
    .with({ status: "loading" }, () => <UserInbox_List.Loading />)
    .with(
      { status: "success" },
      ({ isFetchingNextPage, hasNextPage, fetchNextPage }) => (
        <nav className="overflow-y-auto ">
          <UserInbox_List inboxes={inboxes} />
          {isFetchingNextPage ? <UserInbox_List.Loading /> : null}
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
