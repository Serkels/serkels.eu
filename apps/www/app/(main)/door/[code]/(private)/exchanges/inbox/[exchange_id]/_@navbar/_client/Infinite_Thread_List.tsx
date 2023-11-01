"use client";

import { SeeProfileAvatarMedia } from ":components/avatar";
import type { Params } from ":pipes/exchange_by_id";
import { TRPC_React } from ":trpc/client";
import { Deal_Status_Schema, type Deal } from "@1.modules/exchange.domain";
import type { Inbox, Message } from "@1.modules/inbox.domain";
import { thread_recipient } from "@1.modules/inbox.domain/select";
import { Thread_InfiniteList } from "@1.modules/inbox.ui/thread/InfiniteList";
import { Thread_AsyncItem } from "@1.modules/inbox.ui/thread/Thread_AsyncItem";
import { Thread_Item } from "@1.modules/inbox.ui/thread/Thread_Item";
import { PROFILE_UNKNOWN } from "@1.modules/profile.domain";
import {
  Approved,
  ApprovedByTheOrganizer,
  Denied,
  Idle,
} from "@1.ui/react/icons";
import type {
  UseInfiniteQueryResult,
  UseQueryResult,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { match } from "ts-pattern";

//

export default function Infinite_Thread_List(params: Params) {
  const { exchange_id } = params;

  const query_info =
    TRPC_React.exchanges.me.inbox.by_exchange_id.useInfiniteQuery(
      { exchange_id },
      { getNextPageParam: ({ next_cursor }) => next_cursor },
    ) as UseInfiniteQueryResult<{ data: Message[] }>;

  return (
    <Thread_InfiniteList info={query_info}>
      {({ id }) => {
        return (
          <li key={id}>
            <UserThread_Item inbox_id={id} />
          </li>
        );
      }}
    </Thread_InfiniteList>
  );
}

function UserThread_Item({ inbox_id }: { inbox_id: string }) {
  const { data: session } = useSession();
  const profile_id = session?.profile.id ?? PROFILE_UNKNOWN.id;
  const info = TRPC_React.exchanges.me.inbox.by_id.useQuery(
    inbox_id,
  ) as UseQueryResult<Inbox & { deal: { parent_id: string } }>;

  return (
    <Thread_AsyncItem info={info}>
      {({ inbox }) => {
        const { thread, deal } = inbox as Inbox & {
          deal: Deal;
        };
        const last_message =
          thread.messages.at(0) ??
          ({
            content: "...",
            created_at: new Date(),
            updated_at: new Date(),
          } satisfies Omit<Message, "author" | "id">);

        const participant = thread_recipient({
          participants: thread.participants,
          profile_id,
        });

        return (
          <Thread_Item last_update={last_message.updated_at}>
            <Thread_Item.Avatar>
              <SeeProfileAvatarMedia profile={participant} />
            </Thread_Item.Avatar>
            <Thread_Item.Body>
              <Link href={`/@~/exchanges/inbox/${deal.parent_id}/${thread.id}`}>
                <Indicator className="float-right" status={deal.status} />
                {last_message.content}
              </Link>
            </Thread_Item.Body>
          </Thread_Item>
        );
      }}
    </Thread_AsyncItem>
  );
}

function Indicator({
  status,
  ...other_props
}: ComponentPropsWithoutRef<"svg"> & Pick<Deal, "status">) {
  return match(status)
    .with(Deal_Status_Schema.Enum.APPROVED, () => <Approved {...other_props} />)
    .with(Deal_Status_Schema.Enum.APPROVED_BY_THE_ORGANIZER, () => (
      <ApprovedByTheOrganizer {...other_props} />
    ))
    .with(Deal_Status_Schema.Enum.DENIED, () => <Denied {...other_props} />)
    .with(Deal_Status_Schema.Enum.IDLE, () => <Idle {...other_props} />)
    .exhaustive();
}
