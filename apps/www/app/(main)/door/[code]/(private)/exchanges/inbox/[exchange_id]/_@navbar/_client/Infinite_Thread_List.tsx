"use client";

import { SeeProfileAvatarMedia } from ":components/avatar";
import type { Params } from ":pipes/exchange_by_id";
import { TRPC_React } from ":trpc/client";
import type { Inbox, Message } from "@1.modules/inbox.domain";
import { thread_recipient } from "@1.modules/inbox.domain/select";
import { Thread_InfiniteList } from "@1.modules/inbox.ui/thread/InfiniteList";
import { Thread_AsyncItem } from "@1.modules/inbox.ui/thread/Thread_AsyncItem";
import { Thread_Item } from "@1.modules/inbox.ui/thread/Thread_Item";
import { PROFILE_UNKNOWN } from "@1.modules/profile.domain";
import type {
  UseInfiniteQueryResult,
  UseQueryResult,
} from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

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
          deal: { parent_id: string };
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
                <Sdf className="float-right" />
                {last_message.content}
              </Link>
            </Thread_Item.Body>
          </Thread_Item>
        );
      }}
    </Thread_AsyncItem>
  );
}

function Sdf(props: ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      {...props}
    >
      <circle cx="8" cy="8" r="8" fill="#ff5f5f" />
      <rect
        width="10"
        height="2"
        rx="1"
        transform="translate(3 7)"
        fill="#fff"
      />
    </svg>
  );
}
