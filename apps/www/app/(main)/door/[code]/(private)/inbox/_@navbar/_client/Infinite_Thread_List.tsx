"use client";

import { SeeProfileAvatarMedia } from ":components/avatar";
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

//

export default function Infinite_Thread_List() {
  const query_info = TRPC_React.inbox.find.useInfiniteQuery(
    {},
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
  const info = TRPC_React.inbox.by_id.useQuery(
    inbox_id,
  ) as UseQueryResult<Inbox>;

  return (
    <Thread_AsyncItem info={info}>
      {({ inbox }) => {
        const { thread } = inbox;
        const last_message = thread.messages.pop();
        console.log({ thread, last_message });
        const participant = thread_recipient({
          participants: thread.participants,
          profile_id,
        });

        if (!last_message) return null;

        return (
          <Thread_Item last_update={last_message.updated_at}>
            <Thread_Item.Avatar>
              <SeeProfileAvatarMedia profile={participant} />
            </Thread_Item.Avatar>
            <Thread_Item.Body>
              <Link href={`/@~/inbox/${thread.id}`}>
                {last_message?.content}
              </Link>
            </Thread_Item.Body>
          </Thread_Item>
        );
      }}
    </Thread_AsyncItem>
  );
}
